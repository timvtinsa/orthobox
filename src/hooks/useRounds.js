import { useCallback, useEffect, useState } from 'react'

/**
 * Round tracking: current round (0-based), end of game and restart.
 *
 * Games own their content; this hook only tracks progress. When a session is
 * passed, the progress is reported to it, which lets the board bar show the
 * item rank without the game having to display it itself.
 */
export function useRounds(total, session) {
  const [round, setRound] = useState(0)

  const next = useCallback(() => setRound((current) => current + 1), [])
  const restart = useCallback(() => setRound(0), [])

  const setProgress = session?.setProgress
  useEffect(() => {
    if (setProgress) setProgress(round, total)
  }, [setProgress, round, total])

  return { round, total, isOver: round >= total, next, restart }
}
