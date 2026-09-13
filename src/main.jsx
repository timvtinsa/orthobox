import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/fonts.css'
import './styles/global.css'
import './styles/gallery.css'
import './styles/game.css'

// HashRouter : l'application doit pouvoir être déposée telle quelle sur n'importe
// quel hébergement statique (GitHub Pages, Netlify, intranet du cabinet), sans
// configuration de réécriture d'URL.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
