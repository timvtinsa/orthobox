import { useCallback, useMemo, useState } from 'react'

/**
 * Score state shared by every game: correct answers, attempts, current streak.
 *
 * A game calls `register(true | false)`, the surrounding frame displays the
 * result. `lastAnswer` and `answerCount` drive the child-mode companion: the
 * counter lets the animation replay even on two correct answers in a row,
 * where the state itself would not change.
 */
const EMPTY = { correct: 0, attempts: 0, streak: 0, bestStreak: 0, lastAnswer: null, answerCount: 0 }

export function useGameSession() {
  const [state, setState] = useState(EMPTY)

  const register = useCallback((isCorrect) => {
    setState((previous) => {
      const streak = isCorrect ? previous.streak + 1 : 0
      return {
        correct: previous.correct + (isCorrect ? 1 : 0),
        attempts: previous.attempts + 1,
        streak,
        bestStreak: Math.max(previous.bestStreak, streak),
        lastAnswer: isCorrect ? 'correct' : 'wrong',
        answerCount: previous.answerCount + 1,
      }
    })
  }, [])

  const reset = useCallback(() => {
    setState(EMPTY)
  }, [])

  return useMemo(() => ({ ...state, register, reset }), [state, register, reset])
}
