import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

/**
 * Discreet banner offered once a new version has been downloaded, and
 * confirmation that the application is available offline.
 */
export default function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  // The "available offline" message is a confirmation: it clears itself so
  // it never covers the game. An update message waits for a decision.
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
