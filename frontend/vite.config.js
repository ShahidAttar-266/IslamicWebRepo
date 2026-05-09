import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // raise warning threshold to 1000kb
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large vendor libraries into separate chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
        }
      }
    }
  }
})