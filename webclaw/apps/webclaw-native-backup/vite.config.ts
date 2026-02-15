import { defineConfig } from 'vite'

export default defineConfig({
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
