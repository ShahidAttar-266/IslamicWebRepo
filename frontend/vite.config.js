import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// A simple plugin to inject preload links for the compiled CSS and JS assets
const injectCriticalPreloadsPlugin = () => {
  return {
    name: 'inject-critical-preloads',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;

      let jsFile = '';

      for (const value of Object.values(ctx.bundle)) {
        if (value.type === 'chunk' && value.isEntry) {
          jsFile = '/' + value.fileName;
        }
      }

      let preloads = '';
      if (jsFile) {
        preloads += `  <link rel="modulepreload" href="${jsFile}">\n`;
      }

      if (html.includes('<!-- CRITICAL_PRELOADS_PLACEHOLDER -->')) {
        return html.replace('<!-- CRITICAL_PRELOADS_PLACEHOLDER -->', preloads.trim());
      }

      return html.replace(/<head>/, `<head>\n${preloads}`);
    }
  };
};

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    injectCriticalPreloadsPlugin(),
  ],
  resolve: {
    alias: {
      'lucide-react': 'lucide-react/dist/esm/lucide-react.mjs',
    },
  },
  build: {
    modulePreload: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router') || id.includes('react-helmet')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            if (id.includes('@tanstack') || id.includes('axios')) {
              return 'vendor-data';
            }
            if (id.includes('jspdf')) {
              return 'vendor-pdf';
            }
            // Allow Vite to automatically split other node_modules
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
