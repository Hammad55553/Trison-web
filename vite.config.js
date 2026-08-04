import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    // No sourcemaps in production — smaller deploy, faster builds
    sourcemap: false,
    // Split rarely-changing vendor code into its own cached chunk so repeat
    // visits (and future deploys) don't re-download React on every change
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
        },
      },
    },
    // Silence the default 500kb warning for the (already-optimized) media chunks
    chunkSizeWarningLimit: 800,
  },
})
