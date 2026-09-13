import { useCallback, useMemo, useState } from 'react'

/**
 * État de score commun à tous les jeux : réussites, essais, série en cours.
 * Le jeu appelle `register(true|false)`, le cadre affiche le résultat.
 */
export function useGameSession() {
  const [state, setState] = useState({ correct: 0, attempts: 0, streak: 0, bestStreak: 0 })

  const register = useCallback((isCorrect) => {
    setState((previous) => {
      const streak = isCorrect ? previous.streak + 1 : 0
      return {
        correct: previous.correct + (isCorrect ? 1 : 0),
        attempts: previous.attempts + 1,
        streak,
        bestStreak: Math.max(previous.bestStreak, streak),
      }
    })
  }, [])

  const reset = useCallback(() => {
    setState({ correct: 0, attempts: 0, streak: 0, bestStreak: 0 })
  }, [])

  return useMemo(() => ({ ...state, register, reset }), [state, register, reset])
}
