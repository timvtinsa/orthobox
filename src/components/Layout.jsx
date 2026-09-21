/**
 * Shell shared by every page: header, navigation, footer.
 */
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import BrandMark from './BrandMark.jsx'
import UpdatePrompt from './UpdatePrompt.jsx'
import InstallButton from './InstallButton.jsx'
import ModeSwitch from './ModeSwitch.jsx'
import { version } from '../../package.json'

export default function Layout() {
  const { pathname } = useLocation()

  // Every page change scrolls back to the top, which matters on a tablet.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="brand">
            <BrandMark className="brand__mark" />
            Orthobox
          </Link>
          <nav className="app-nav" aria-label="Navigation principale">
            <NavLink to="/" end className="app-nav__link">
              Galerie
            </NavLink>
            <NavLink to="/session" className="app-nav__link app-nav__link--session">
              Séance
            </NavLink>
          </nav>
          <ModeSwitch />
          <InstallButton />
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        Orthobox, outil libre pour les séances d’orthophonie. Tout fonctionne hors ligne, aucune
        donnée patient n’est enregistrée.
        <span className="app-footer__version"> · v{version}</span>
      </footer>

      <UpdatePrompt />
    </div>
  )
}
