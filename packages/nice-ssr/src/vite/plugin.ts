import fs from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from 'vite'
import { transformPage } from './transform-csr.ts'
import { csrPageModuleId, getAppPath, getRelativeSourcePath, getRootLayoutPath, ssrRoutesModuleId } from './utils.ts'
import generateCsrPage from './virtual/csr-page.ts'
import generateSsrRoutes from './virtual/ssr-routes.ts'

type NiceSsrOptions = Readonly<{
  devTools?: Readonly<{
    enabled?: boolean
    enabledInProd?: boolean
  }>
}>

const unsafeExists = (path: string) =>
  fs.access(path).then(() => true).catch(() => false)
const niceSsrPlugin = (_: NiceSsrOptions = {}): Plugin => {
  return {
    name: 'nice-ssr-plugin',
    resolveId(source, importer) {
      if (source.startsWith(csrPageModuleId('')) && !source.endsWith('/')) {
        return `\0${source}`
      }
      if (source === ssrRoutesModuleId || source === 'virtual:entry-csr') {
        return `\0${source}`
      }
      if (importer === '\0virtual:entry-csr' && source.startsWith('./')) {
        return path.resolve(import.meta.dirname, '..', source)
      }
    },

    async load(id) {
      if (id.startsWith(`\0${csrPageModuleId('')}`)) {
        return generateCsrPage(id.slice(13))
      }
      if (id === `\0${ssrRoutesModuleId}`) {
        return generateSsrRoutes()
      }
      if (id === '\0virtual:entry-csr') {
        return await fs.readFile(path.resolve(import.meta.dirname, '..', 'csr-entry.js'), 'utf-8')
      }
    },

    async config(config, env) {
      if (env.command === 'build') {
        config.build ??= {}
        config.build.rollupOptions ??= {}
        config.build.assetsDir = '.p/assets'
        if (Array.isArray(config.build.rollupOptions.output)) {
          throw new Error('Configuration error: build.rollupOptions.output cannot be an array')
        }
        config.build.rollupOptions.output ??= {}
        config.build.rollupOptions.output.importAttributesKey = 'with'
        config.build.rollupOptions.output.entryFileNames = (chunkInfo) => {
          if (env.isSsrBuild && chunkInfo.name === 'server') {
            return '[name].js'
          }

          if (chunkInfo.facadeModuleId) {
            if (chunkInfo.facadeModuleId.startsWith(`\0${csrPageModuleId('')}`)) {
              const pageName = chunkInfo.facadeModuleId
                .slice(csrPageModuleId('').length + 2)
                .replaceAll(/[[\]/]/g, '_')
                .replaceAll(/_+/g, '_')
                .replace(/_$/, '') || 'rp'
              return `.p/pages/${pageName}.[hash].js`
            }
          }
          return `.p/chunks/${chunkInfo.name}.[hash].js`
        }

        if (!env.isSsrBuild) {
          config.build.outDir = 'dist/client'
          config.build.manifest = true
          config.build.rollupOptions.input = ['virtual:entry-csr']
          config.build.rollupOptions.output.chunkFileNames = (chunkInfo) =>
            `.p/chunks/${chunkInfo.name}.[hash].js`
          // needed for the csr pages, otherwise the export default is trimmed
          config.build.rollupOptions.preserveEntrySignatures = 'exports-only'

          const rootLayoutPath = getRootLayoutPath()
          if (await unsafeExists(rootLayoutPath)) {
            config.build.rollupOptions.input.push(getRelativeSourcePath(rootLayoutPath))
          }
          for await (const page of fs.glob(getAppPath('**', 'page.tsx'))) {
            const lePath = path.relative(getAppPath(), page).replace(/page\.tsx$/, '')
            config.build.rollupOptions.input.push(csrPageModuleId(lePath))
          }
          for await (const page of fs.glob(getAppPath('**', 'not-found.tsx'))) {
            const lePath = path.relative(getAppPath(), page).replace(/not-found\.tsx$/, '')
            config.build.rollupOptions.input.push(csrPageModuleId(lePath) + '/_not_found')
          }
          for await (const page of fs.glob(getAppPath('**', 'error.tsx'))) {
            const lePath = path.relative(getAppPath(), page).replace(/error\.tsx$/, '')
            config.build.rollupOptions.input.push(csrPageModuleId(lePath) + '/_error')
          }
        } else {
          config.build.ssr = path.join(import.meta.dirname, '..', 'entry/server.js')
          config.build.target = 'node22'
          config.build.outDir = 'dist/server'
          config.build.rollupOptions.external = ['../client/.vite/manifest.json']
        }
      }
    },

    transform(code, id, options) {
      if (!options?.ssr && id.endsWith('page.tsx')) {
        const ast = this.parse(code, { jsx: true })
        const newCode = transformPage(ast)
        return { code: newCode, moduleSideEffects: false }
      }
    },
  }
}

export default niceSsrPlugin
