import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        hmr: {
            overlay: false // Disable error overlay to prevent blocking view during minor errors
        }
    },
    build: {
        assetsInlineLimit: 0, // Ensure assets are not inlined as base64
        chunkSizeWarningLimit: 2000, // Increase warning limit for large chunks
    }
})
