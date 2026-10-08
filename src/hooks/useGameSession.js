import { useCallback, useMemo, useState } from 'react'

/**
 * Score state shared by every game: correct answers, attempts, current streak.
 *
 * A game calls `register(true | false)`, the surrounding frame displays the
 * result. `lastAnswer` and `answerCount` drive the child-mode companion: the
 * counter lets the animation replay even on two correct answers in a row,
 * where the state itself would not change.
 *
 * `register` also takes an optional `detail`, a short readable label of the
 * item (« 7 + 8 = 15 »). The ones answered wrongly are kept in `misses`, which
 * is what the session report lists as « à revoir »: a game that gives no
 * detail simply leaves that list empty.
 *
 * `results` keeps one mark per answer, in order, which is what the board bar
 * shows as a frieze. `index` and `total` are reported by the game through
 * `useRounds`, so the bar can say where the patient is without the game
 * having to display it a second time.
 */
const EMPTY = {
  correct: 0,
  attempts: 0,
  streak: 0,
  bestStreak: 0,
  lastAnswer: null,
  answerCount: 0,
  results: [],
  misses: [],
  index: 0,
  total: null,
}

/** The next session state once one more answer is registered. */
export function nextSessionState(previous, isCorrect, detail) {
  const streak = isCorrect ? previous.streak + 1 : 0
  return {
    ...previous,
    correct: previous.correct + (isCorrect ? 1 : 0),
    attempts: previous.attempts + 1,
    streak,
    bestStreak: Math.max(previous.bestStreak, streak),
    lastAnswer: isCorrect ? 'correct' : 'wrong',
    answerCount: previous.answerCount + 1,
    results: [...previous.results, isCorrect ? 'ok' : 'err'],
    misses: !isCorrect && detail ? [...previous.misses, detail] : previous.misses,
  }
}

export function useGameSession() {
  const [state, setState] = useState(EMPTY)

  const register = useCallback((isCorrect, detail) => {
    setState((previous) => nextSessionState(previous, isCorrect, detail))
  }, [])

  const setProgress = useCallback((index, total) => {
    setState((previous) =>
      previous.index === index && previous.total === total
        ? previous
        : { ...previous, index, total },
    )
  }, [])

  const reset = useCallback(() => {
    setState(EMPTY)
  }, [])

  return useMemo(
    () => ({ ...state, register, reset, setProgress }),
    [state, register, reset, setProgress],
  )
}
