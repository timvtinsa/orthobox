import { useEffect, useRef, useState } from 'react'

/**
 * Countdown in seconds. Setting `running` to false pauses it, and `onExpire`
 * fires exactly once when the timer reaches zero.
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
