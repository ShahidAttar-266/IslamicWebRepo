import React from 'react'
import ReactDOM from 'react-dom/client'
const RECENT_NAMES_URL =
  'https://islamic-web-repo.vercel.app/api/v1/names?sort=-createdAt&limit=8'

// Fire fetch instantly — browser starts TCP+TLS+request
// while React bundle is still being parsed
const recentNamesPromise = fetch(RECENT_NAMES_URL)
  .then(r => r.json())
  .catch(() => null)

// Store on window so useQuery can read it
window.__recentNamesPromise = recentNamesPromise

import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)