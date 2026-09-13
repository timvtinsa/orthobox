import { useEffect, useRef, useState } from 'react'

/**
 * Compte à rebours en secondes. `running` à false met en pause,
 * `onExpire` est appelé une seule fois lorsque le temps atteint zéro.
 */
export function useCountdown(seconds, { running = true, onExpire } = {}) {
  const [remaining, setRemaining] = useState(seconds)
  const expireRef = useRef(onExpire)
  expireRef.current = onExpire

  useEffect(() => {
    setRemaining(seconds)
  }, [seconds])

  useEffect(() => {
    if (!running) return undefined
    const id = window.setInterval(() => {
      setRemaining((previous) => {
        if (previous <= 1) {
          window.clearInterval(id)
          expireRef.current?.()
          return 0
        }
        return previous - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [running, seconds])

  return remaining
}
