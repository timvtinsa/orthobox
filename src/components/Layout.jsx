import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
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
            <span className="brand__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 3C6.9 3 3 6.2 3 10.2c0 2.2 1.2 4.2 3.2 5.5L5.4 20l4.3-2.4c.7.1 1.5.2 2.3.2 5.1 0 9-3.2 9-7.6S17.1 3 12 3Z" />
                <g fill="#353fa8">
                  <circle cx="8.4" cy="10.2" r="1.3" />
                  <circle cx="12" cy="10.2" r="1.3" />
                  <circle cx="15.6" cy="10.2" r="1.3" />
                </g>
              </svg>
            </span>
            Orthobox
          </Link>
          <nav className="app-nav" aria-label="Navigation principale">
            <NavLink to="/" end className="app-nav__link">
              Galerie
            </NavLink>
            <NavLink to="/a-propos" className="app-nav__link">
              À propos
            </NavLink>
          </nav>
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
