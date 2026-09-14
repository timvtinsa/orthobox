import { useCallback, useState } from 'react'

/**
 * Round tracking: current round (0-based), end of game and restart.
 *
 * Games own their content; this hook only tracks progress.
 */
export function useRounds(total) {
  const [round, setRound] = useState(0)

  const next = useCallback(() => setRound((current) => current + 1), [])
  const restart = useCallback(() => setRound(0), [])

  return { round, total, isOver: round >= total, next, restart }
}
