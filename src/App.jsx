import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import GamePage from './pages/GamePage.jsx'
import SeancePage from './pages/SeancePage.jsx'
import SeanceRunPage from './pages/SeanceRunPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<GalleryPage />} />
        <Route path="jeux/:gameId" element={<GamePage />} />
        <Route path="seance" element={<SeancePage />} />
        <Route path="seance/jouer" element={<SeanceRunPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
