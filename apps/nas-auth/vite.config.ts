import { createRequire } from 'node:module'
import niceSsrPlugin from '@melchor629/nice-ssr/vite'
import { preact } from '@preact/preset-vite'
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
    niceSsrPlugin({ devTools: { enabled: true } }),
  ],
  build: {
    emptyOutDir: true,
  },
})
