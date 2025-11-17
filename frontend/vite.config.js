import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        global: 'globalThis',
    },
    server: {
        headers: {
            'Cache-Control': 'public, max-age=31536000',
        }
    },
    build: {
        assetsInlineLimit: 4096,
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    const extType = assetInfo.name.split('.')[1];
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        return `assets/images/[name]-[hash][extname]`;
                    }
                    return `assets/[name]-[hash][extname]`;
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js'
            }
        }
    }
})