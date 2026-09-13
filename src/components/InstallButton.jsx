import { useEffect, useState } from 'react'

/**
 * Bouton « Installer » base sur l'evenement `beforeinstallprompt`.
 * Absent des navigateurs qui ne le proposent pas (iOS notamment),
 * et masqué si l'application tourne déjà en mode autonome.
 */
export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    const onPrompt = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
    }
    const onInstalled = () => setDeferredPrompt(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!deferredPrompt) return null

  const install = async () => {
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  return (
    <button type="button" className="btn btn--subtle app-header__install" onClick={install}>
      Installer l&apos;application
    </button>
  )
}
