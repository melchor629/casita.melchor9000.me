import react from '@vitejs/plugin-react'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    svgr(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: 'me.melchor9000.nas',
        short_name: 'NAS Web',
        name: 'NAS Web',
        description: 'A web page to access a lot of files from a NAS',
        icons: [
          {
            src: 'icon-64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'icon-144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'icon-180.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        start_url: '.',
        display: 'standalone',
        theme_color: '#f57c00',
        background_color: '#212529',
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api\/[^/]+\/(storage|a)\//],
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        // target: 'http://localhost:8002/',
        target: 'https://nas.melchor9000.me/api',
        secure: false,
        changeOrigin: true,
        autoRewrite: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: browserslistToEsbuild(),
    rollupOptions: {
      output: {
        manualChunks(id) {
          return id.includes('node_modules') && !id.endsWith('.svg') ? 'vendor' : undefined
        },
      },
    },
  },
})
