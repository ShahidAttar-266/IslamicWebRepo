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
} catch {
  // Silent fallback if module is missing or unable to patch
}

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
    prerender({
        staticDir: path.join(__dirname, 'dist'),
        routes: [
          '/', '/search', '/privacy', '/terms', '/disclaimer', '/faq', '/compare', '/free-service', '/report-bug', '/blog',
          '/blog/50-beautiful-islamic-girl-names-starting-with-f',
          '/blog/50-islamic-girl-names-starting-with-s',
          '/blog/can-muslims-use-non-arabic-names',
          '/blog/how-to-choose-an-islamic-name',
          '/blog/modern-arabic-girl-names-that-sound-beautiful',
          '/blog/names-meaning-light-in-the-quran',
          '/blog/names-of-the-prophets-in-islam',
          '/blog/rare-islamic-boy-names-with-deep-meanings',
          '/blog/the-name-fatima-meaning-history',
          '/blog/top-30-quranic-names-for-baby-boys-in-2026'
        ],
        renderer: '@prerenderer/renderer-puppeteer',
        rendererOptions: {
          renderAfterTime: 2000,
          timeout: 20000,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          userDataDir: path.join(__dirname, '.puppeteer_user_data'),
          navigationOptions: {
            waitUntil: 'domcontentloaded',
          }
        }
      })
  ],
  resolve: {
    alias: {
      'lucide-react': 'lucide-react/dist/esm/lucide-react.mjs',
    },
  },
  build: {
    cssCodeSplit: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('lucide-react')) {
            return 'icons'  // all icons → single icons-[hash].js chunk
          }
          if (id.includes('node_modules')) {
            return 'vendor'
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
