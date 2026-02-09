import { URL, fileURLToPath } from 'node:url'

// devtools removed
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// nitro plugin removed (tanstackStart handles server runtime)
import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

const config = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    // devtools(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  server: {
    port: 3002,
    proxy: {
      '/ws': {
        target: 'https://moltbot-sandbox.xsun.workers.dev',
        changeOrigin: true,
        ws: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ws/, '/ws'),
      },
      '/api': {
        target: 'https://moltbot-sandbox.xsun.workers.dev',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

export default config
