import React from 'react'
import ReactDOM from 'react-dom/client'
const apiBase = import.meta.env.VITE_API_URL || 'https://islamic-web-repo.vercel.app/api/v1';
const RECENT_NAMES_URL =
  `${apiBase}/names?sort=-createdAt&limit=8`

// Fire fetch instantly — browser starts TCP+TLS+request
// while React bundle is still being parsed
const recentNamesPromise = fetch(RECENT_NAMES_URL)
  .then(r => r.json())
  .catch(() => null)

// Store on window so useQuery can read it
window.__recentNamesPromise = recentNamesPromise

import App from './App.jsx'
import './index.css'

import { createRoot, hydrateRoot } from 'react-dom/client'

const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.dispatchEvent(new Event('render-complete'));
    }, 1000);
  });
}