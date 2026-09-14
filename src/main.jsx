import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { ModeProvider } from './components/ModeProvider.jsx'
import './styles/fonts.css'
import './styles/global.css'
import './styles/gallery.css'
import './styles/game.css'
import './styles/child-mode.css'

// HashRouter: the application must be droppable as is on any static host
// (GitHub Pages, Netlify, a practice intranet), with no URL rewriting rule to
// configure.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ModeProvider>
  </StrictMode>,
)
