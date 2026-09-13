import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import UpdatePrompt from './UpdatePrompt.jsx'
import InstallButton from './InstallButton.jsx'

export default function Layout() {
  const { pathname } = useLocation()

  // Chaque changement de page repart du haut (utile sur tablette en séance).
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="brand">
            <svg className="brand__mark" viewBox="0 0 40 40" aria-hidden="true">
              <rect width="40" height="40" rx="12" fill="#a8c8ec" />
              <circle cx="13" cy="16" r="4" fill="#35608f" />
              <circle cx="27" cy="16" r="4" fill="#f6bdab" />
              <circle cx="13" cy="28" r="4" fill="#b9d8c2" />
              <circle cx="27" cy="28" r="4" fill="#cdc3ec" />
            </svg>
            Orthobox
          </Link>
          <InstallButton />
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        Orthobox — outil libre pour les séances d’orthophonie. Tout fonctionne hors ligne, aucune
        donnée patient n’est enregistrée.
      </footer>

      <UpdatePrompt />
    </div>
  )
}
