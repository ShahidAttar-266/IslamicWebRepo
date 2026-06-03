import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      'lucide-react': 'lucide-react/dist/esm/lucide-react.mjs',
    },
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group core framework dependencies
            if (
              id.includes('react') || 
              id.includes('react-dom') || 
              id.includes('react-router-dom')
            ) {
              return 'framework';
            }
            // Group data fetching and state management
            if (
              id.includes('@tanstack/react-query') ||
              id.includes('axios') ||
              id.includes('zustand')
            ) {
              return 'data';
            }
            // Separate heavy UI libraries
            if (id.includes('framer-motion')) {
              return 'motion';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Utilities
            if (id.includes('react-hot-toast') || id.includes('zod') || id.includes('react-hook-form')) {
              return 'utils';
            }
            return 'modules';
          }
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://www.islamicnames.in',
        changeOrigin: true,
      },
    },
  },
})
