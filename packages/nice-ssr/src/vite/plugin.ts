import fs from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from 'vite'
import { transformPage } from './transform-csr.ts'
import { csrEntryFilePath, csrEntryModuleId, getAppPath, ssrRoutesFilePath, ssrRoutesModuleId } from './utils.ts'

type NiceSsrOptions = Readonly<{
  devTools?: Readonly<{
    enabled?: boolean
    enabledInProd?: boolean
  }>
}>

const niceSsrPlugin = (_: NiceSsrOptions = {}): Plugin => {
  return {
    name: 'nice-ssr-plugin',
    resolveId(source, importer) {
      if (source === ssrRoutesModuleId || source === csrEntryModuleId) {
        return `\0${source}`
      }
      if (importer === `\0${csrEntryModuleId}`) {
        if (source.startsWith('./') || source.startsWith('../')) {
          return path.resolve(path.join(path.dirname(csrEntryFilePath), source))
        }
      }
    },

    async load(id) {
      if (id === `\0${ssrRoutesModuleId}`) {
        this.addWatchFile(ssrRoutesFilePath)
        return fs.readFile(ssrRoutesFilePath, 'utf-8')
      }
      if (id === `\0${csrEntryModuleId}`) {
        this.addWatchFile(csrEntryFilePath)
        return fs.readFile(csrEntryFilePath, 'utf-8')
      }
    },

    handleHotUpdate({ file, modules, server }) {
      if (file.endsWith(ssrRoutesFilePath)) {
        const virtualModule = server.moduleGraph.getModuleById(`\0${ssrRoutesModuleId}`)!
        return [...modules, virtualModule]
      }

      if (file.endsWith(csrEntryFilePath)) {
        const virtualModule = server.moduleGraph.getModuleById(`\0${csrEntryModuleId}`)!
        return [...modules, virtualModule]
      }

      return modules
    },

    config(config, env) {
      if (!this.meta.rolldownVersion) {
        throw new Error('This plugin only supports vite 8 or higher with rolldown')
      }

      config.resolve = {
        ...config.resolve,
        tsconfigPaths: true,
      }

      if (env.command === 'build') {
        config.build ??= {}
        config.build.rolldownOptions ??= {}
        config.build.assetsDir = '.p/assets'
        if (Array.isArray(config.build.rolldownOptions.output)) {
          throw new Error('Configuration error: build.rollupOptions.output cannot be an array')
        }
        config.build.rolldownOptions.output ??= {}
        config.build.rolldownOptions.output.entryFileNames = (chunkInfo) => {
          if (chunkInfo.name === 'server') {
            return '[name].js'
          }

          if (chunkInfo.facadeModuleId === `\0${csrEntryModuleId}`) {
            return '.p/client.js'
          }

          return `.p/chunks/${chunkInfo.name}.[hash].js`
        }
        config.build.rolldownOptions.output.chunkFileNames = (chunkInfo) => {
          if (chunkInfo.facadeModuleId) {
            const filePath = path.relative(getAppPath(), path.resolve(chunkInfo.facadeModuleId))
            if (!filePath.startsWith('..')) {
              if (filePath === 'middleware.ts') return '.p/middleware.js'
              if (filePath === 'root-layout.tsx') return '.p/pages/root-layout.js'
              const type = filePath.endsWith('error.tsx')
                ? 'error'
                : filePath.endsWith('not-found.tsx')
                  ? 'not-found'
                  : filePath.endsWith('page.tsx')
                    ? 'page'
                    : filePath.endsWith('route.ts')
                      ? 'route'
                      : '_'
              const pageName = path.dirname(filePath)
                .replaceAll(/[[\]/]/g, '_')
                .replaceAll(/_+/g, '_')
                .replace(/_$/, '') || 'root-page'
              return `.p/pages/${pageName}.${type}.[hash].js`
            }
          }

          return `.p/chunks/${chunkInfo.name}.[hash].js`
        }

        config.environments = {
          ...config.environments,
          client: {
            ...config.environments?.client,
            build: {
              outDir: 'dist/client',
              manifest: true,
              rolldownOptions: {
                input: ['virtual:entry-csr'],
                // needed for the csr pages, otherwise the export default is trimmed
                preserveEntrySignatures: 'exports-only',
              },
            },
          },
          ssr: {
            ...config.environments?.ssr,
            build: {
              ssr: path.join(import.meta.dirname, '..', 'entry/server.js'),
              target: 'node24',
              outDir: 'dist/server',
              rolldownOptions: {
                external: ['../client/.vite/manifest.json'],
              },
            },
          },
        }
      }
    },

    transform(code, id, options) {
      if (!options?.ssr && id.endsWith('page.tsx')) {
        const ast = this.parse(code, { sourceType: 'module', lang: 'tsx' })
        // @ts-expect-error types between OXC and estree are not 100% compatible
        const newCode = transformPage(ast)
        return { code: newCode, moduleSideEffects: false, moduleType: 'tsx' }
      }
    },
  }
}

export default niceSsrPlugin
