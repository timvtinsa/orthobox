import { useCallback, useState } from 'react'

/**
 * Déroulement en manches : `round` (0-based), fin de partie et relance.
 * Les jeux gèrent leur contenu, ce hook ne gère que l'avancement.
 */
export function useRounds(total) {
  const [round, setRound] = useState(0)

  const next = useCallback(() => setRound((current) => current + 1), [])
  const restart = useCallback(() => setRound(0), [])

  return { round, total, isOver: round >= total, next, restart }
}
