import fs from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from 'vite'
import { csrPageModuleId, getAppPath, getRelativeSourcePath, getRootLayoutPath, ssrRoutesModuleId } from './utils.ts'
import generateCsrPage from './virtual/csr-page.ts'
import generateSsrRoutes from './virtual/ssr-routes.ts'

const unsafeExists = (path: string) =>
  fs.access(path).then(() => true).catch(() => false)
const niceSsrPlugin = (): Plugin => {
  return {
    name: 'nice-ssr-plugin',
    resolveId(source) {
      if (source.startsWith(csrPageModuleId('')) && !source.endsWith('/')) {
        return `\0${source}`
      }
      if (source === ssrRoutesModuleId) {
        return `\0${source}`
      }
    },

    async load(id) {
      if (id.startsWith(`\0${csrPageModuleId('')}`)) {
        return generateCsrPage(id.slice(13))
      }
      if (id === `\0${ssrRoutesModuleId}`) {
        return generateSsrRoutes()
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
          return `.p/assets/${chunkInfo.name}.[hash].js`
        }

        if (!env.isSsrBuild) {
          config.build.outDir = 'dist/client'
          config.build.manifest = true
          config.build.rollupOptions.input = []
          config.build.rollupOptions.output.chunkFileNames = (chunkInfo) =>
            `.p/chunks/${chunkInfo.name}.[hash].js`

          const rootLayoutPath = getRootLayoutPath()
          if (await unsafeExists(rootLayoutPath)) {
            config.build.rollupOptions.input.push(getRelativeSourcePath(rootLayoutPath))
          }
          for await (const page of fs.glob(getAppPath('**', 'page.tsx'))) {
            const lePath = path.relative(getAppPath(), page).replace(/page\.tsx$/, '')
            config.build.rollupOptions.input.push(csrPageModuleId(lePath))
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
        return code
          .replaceAll(/import.+?from *(?:'|")node:[\w/]+(?:'|");?/g, '')
          .replaceAll(/import.+?from *(?:'|")@\/config(?:'|");?/g, '')
      }
    },
  }
}

export default niceSsrPlugin
