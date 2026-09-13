import { useCallback, useMemo, useState } from 'react'

/**
 * État de score commun à tous les jeux : réussites, essais, série en cours.
 * Le jeu appelle `register(true|false)`, le cadre affiche le résultat.
 */
const VIDE = { correct: 0, attempts: 0, streak: 0, bestStreak: 0, dernier: null, evenement: 0 }

export function useGameSession() {
  const [state, setState] = useState(VIDE)

  const register = useCallback((isCorrect) => {
    setState((previous) => {
      const streak = isCorrect ? previous.streak + 1 : 0
      return {
        correct: previous.correct + (isCorrect ? 1 : 0),
        attempts: previous.attempts + 1,
        streak,
        bestStreak: Math.max(previous.bestStreak, streak),
        // `dernier` et `evenement` servent au compagnon du mode enfant :
        // le compteur permet de rejouer l'animation même sur deux bonnes
        // réponses de suite, où `dernier` ne change pas.
        dernier: isCorrect ? 'correct' : 'wrong',
        evenement: previous.evenement + 1,
      }
    })
  }, [])

  const reset = useCallback(() => {
    setState(VIDE)
  }, [])

  return useMemo(() => ({ ...state, register, reset }), [state, register, reset])
}
