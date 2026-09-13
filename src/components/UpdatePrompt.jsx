import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

/**
 * Bandeau discret proposé quand une nouvelle version a été téléchargée,
 * et confirmation que l'application est disponible hors ligne.
 */
export default function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  // Le message « disponible hors ligne » est une confirmation : il s'efface
  // seul pour ne pas masquer le jeu. Celui d'une mise à jour attend un choix.
  useEffect(() => {
    if (!offlineReady || needRefresh) return undefined
    const id = window.setTimeout(() => setOfflineReady(false), 6000)
    return () => window.clearTimeout(id)
  }, [offlineReady, needRefresh, setOfflineReady])

  if (!offlineReady && !needRefresh) return null

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="toast" role="status">
      <p className="toast__text">
        {needRefresh
          ? 'Une nouvelle version d’Orthobox est disponible.'
          : 'Orthobox est installé : les jeux fonctionnent maintenant hors ligne.'}
      </p>
      <div className="row">
        {needRefresh && (
          <button
            type="button"
            className="btn btn--subtle"
            onClick={() => updateServiceWorker(true)}
          >
            Mettre à jour
          </button>
        )}
        <button type="button" className="btn btn--ghost" onClick={close}>
          Fermer
        </button>
      </div>
    </div>
  )
}
