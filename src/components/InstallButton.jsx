import { useEffect, useState } from 'react'

/**
 * « Installer » button, built on the `beforeinstallprompt` event.
 * Absent from browsers that do not offer it (iOS in particular), and hidden
 * when the application already runs standalone.
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
