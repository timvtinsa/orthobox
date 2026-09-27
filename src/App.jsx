/**
 * Application routes: gallery, game page, session planning and session run.
 */
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import GamePage from './pages/GamePage.jsx'
import SessionBuilderPage from './pages/SessionBuilderPage.jsx'
import SessionRunPage from './pages/SessionRunPage.jsx'
import SessionSharedPage from './pages/SessionSharedPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<GalleryPage />} />
        <Route path="games/:gameId" element={<GamePage />} />
        <Route path="session" element={<SessionBuilderPage />} />
        <Route path="session/run" element={<SessionRunPage />} />
        <Route path="session/shared" element={<SessionSharedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
