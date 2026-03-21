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
  ],
  build: {
    emptyOutDir: true,
  },
})
