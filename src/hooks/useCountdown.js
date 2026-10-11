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

  // Pure updater: React may run it twice (StrictMode) or batch several ticks,
  // so the expiry side effect lives in its own effect below instead.
  useEffect(() => {
    if (!running) return undefined
    const id = window.setInterval(() => {
      setRemaining((previous) => Math.max(0, previous - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [running, seconds])

  const expired = seconds > 0 && remaining === 0
  useEffect(() => {
    if (expired) expireRef.current?.()
  }, [expired])

  return remaining
}
