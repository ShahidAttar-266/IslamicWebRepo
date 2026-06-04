import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

// Dynamically patch AJV schema in CommonJS cache to allow custom waitUntil options
try {
  const optionsPath = path.join(__dirname, 'node_modules/@prerenderer/renderer-puppeteer/dist/Options.js')
  const cjsOptions = require(optionsPath)
  if (cjsOptions && cjsOptions.schema?.properties?.navigationOptions?.properties?.waitUntil) {
    delete cjsOptions.schema.properties.navigationOptions.properties.waitUntil.type
    delete cjsOptions.schema.properties.navigationOptions.properties.waitUntil.nullable
  }
} catch (e) {
  // Silent fallback if module is missing or unable to patch
}

const isVercel = process.env.VERCEL === '1'

export default defineConfig({
  plugins: [
    react(),
    ...(!isVercel ? [
      prerender({
        staticDir: path.join(__dirname, 'dist'),
        routes: ['/', '/search', '/privacy', '/terms', '/disclaimer', '/faq'],
        renderer: '@prerenderer/renderer-puppeteer',
        rendererOptions: {
          renderAfterTime: 2000,
          timeout: 20000,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          userDataDir: path.join(__dirname, '.puppeteer_user_data'),
          navigationOptions: {
            waitUntil: 'domcontentloaded',
          }
        },
        postProcess(renderedRoute) {
          if (renderedRoute.route === '/') {
            const fs = require('fs')
            const fsPath = require('path')
            const distDir = fsPath.join(__dirname, 'dist')
            if (!fs.existsSync(distDir)) {
              fs.mkdirSync(distDir, { recursive: true })
            }
            fs.writeFileSync(fsPath.join(distDir, 'index.html'), renderedRoute.html)
          }
        }
      })
    ] : [])
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
