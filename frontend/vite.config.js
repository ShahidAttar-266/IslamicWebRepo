import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // raise warning threshold to 1000kb
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor'
            if (id.includes('react')) return 'react-vendor'
            if (id.includes('@tanstack')) return 'query-vendor'
            if (id.includes('lucide') || id.includes('react-hot-toast')) return 'ui-vendor'
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) return 'form-vendor'
            return 'vendor'
          }
        }
      }
    }
  }
})