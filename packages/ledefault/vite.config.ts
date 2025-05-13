import { createRequire } from 'node:module'
import niceSsrPlugin from '@melchor629/nice-ssr/vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  appType: 'custom',
  plugins: [
    tsconfigPaths(),
    preact({
      devToolsEnabled: true,
      prefreshEnabled: true,
      babel: {
        // Change cwd to load Preact Babel plugins
        cwd: createRequire(import.meta.url).resolve('@preact/preset-vite'),
      },
    }),
    tailwindcss(),
    niceSsrPlugin(),
    {
      name: 'copy-server',
      async closeBundle() {
        const [path, fs] = await Promise.all([import('node:path'), import('node:fs/promises')])
        const sourcePath = path.resolve('src')
        const distPath = path.resolve('dist')
        await Promise.all(
          ['config.ts', 'server.ts']
            .map((f) => fs.copyFile(path.join(sourcePath, f), path.join(distPath, f))),
        )
      },
    },
  ],
  build: {
    emptyOutDir: true,
  },
})
