import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import critical from 'rollup-plugin-critical'

export default defineConfig({
  plugins: [
    react(),
    critical({
      criticalUrl: 'https://www.islamicnames.in',
      criticalBase: './dist',
      criticalPages: [{ uri: '/', template: 'index' }],
      criticalConfig: {
        inline: true,
        width: 375,
        height: 812,
      }
    })
  ],
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('react-hot-toast')) {
              return 'ui';
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
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})