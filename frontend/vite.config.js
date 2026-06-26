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
            // Core React runtime — keep together for shared dependency
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react';
            }
            // Router — separate chunk since only needed after hydration
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            // Helmet — SEO head management, loaded on every page
            if (id.includes('react-helmet')) {
              return 'vendor-helmet';
            }
            // Animation library — heavy, only needed for animated pages
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            // Data fetching layer
            if (id.includes('@tanstack') || id.includes('axios')) {
              return 'vendor-data';
            }
            // Google OAuth — only loaded on login/register pages
            if (id.includes('@react-oauth') || id.includes('google')) {
              return 'vendor-oauth';
            }
            // PDF generation — only loaded on-demand
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
