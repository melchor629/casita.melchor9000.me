import niceSsrPlugin from '@melchor629/nice-ssr/vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  appType: 'custom',
  plugins: [
    react(),
    tailwindcss(),
    niceSsrPlugin({ devTools: { enabled: true } }),
    {
      name: 'copy-server',
      async closeBundle() {
        const [path, fs] = await Promise.all([import('node:path'), import('node:fs/promises')])
        const sourcePath = path.resolve('src')
        const distPath = path.resolve('dist')
        await Promise.all(
          ['config.ts', 'server.ts', 'instrumentation.ts']
            .map((f) => fs.copyFile(path.join(sourcePath, f), path.join(distPath, f))),
        )
      },
    },
  ],
  build: {
    emptyOutDir: true,
  },
})
