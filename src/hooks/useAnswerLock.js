import { useCallback, useRef } from 'react'

/**
 * Synchronous lock for answers.
 *
 * React state only updates on the next render: two taps in quick succession
 * (a child tapping twice on the tablet) would otherwise register two answers
 * for the same round. `take()` succeeds once, until the next round calls
 * `release()`.
 */
export function useAnswerLock() {
  const locked = useRef(false)

  const take = useCallback(() => {
    if (locked.current) return false
    locked.current = true
    return true
  }, [])

  const release = useCallback(() => {
    locked.current = false
  }, [])

  return { take, release }
}
