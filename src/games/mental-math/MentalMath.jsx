/**
 * Mental math: one operation, four possible results.
 *
 * The wrong options are not random: they reproduce the usual calculation
 * mistakes, so picking an answer requires a real check rather than a visual
 * elimination.
 */
import { useEffect, useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { createProblemDrawer } from './logic.js'

export default function MentalMath({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [drawer] = useState(() => createProblemDrawer(config))
  const [round, setRound] = useState(() => drawer.next())
  const [choice, setChoice] = useState(null)
  const lock = useAnswerLock()
  const start = useRef(performance.now())
  const times = useRef([])

  useEffect(() => {
    start.current = performance.now()
  }, [round])

  const answer = (value) => {
    if (!lock.take()) return
    times.current.push(performance.now() - start.current)
    setChoice(value)
    session.register(value === round.result)
  }

  const goNext = () => {
    lock.release()
    rounds.next()
    setRound(drawer.next())
    setChoice(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    times.current = []
    drawer.reset()
    setRound(drawer.next())
    setChoice(null)
  }

  if (rounds.isOver) {
    const average =
      times.current.length > 0
        ? times.current.reduce((sum, value) => sum + value, 0) / times.current.length / 1000
        : 0
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">Temps de réponse moyen : {average.toFixed(1)} s</p>
      </GameOver>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Calcul {rounds.round + 1} sur {rounds.total}
      </p>

      <p className="math-prompt">
        {round.equation} <span className="math-prompt__equals">=</span>
      </p>

      <div className="choice-grid">
        {round.options.map((value) => {
          const state = answerState(value, { picked: choice, expected: round.result })
          const dim = choice !== null && !state ? ' choice--dim' : ''
          return (
            <button
              key={value}
              type="button"
              className={`choice choice--number${stateClass(state)}${dim}`}
              disabled={choice !== null}
              onClick={() => answer(value)}
            >
              {value}
              <StateMark state={state} />
            </button>
          )
        })}
      </div>

      {choice !== null && (
        <>
          <Feedback
            status={choice === round.result ? 'correct' : 'wrong'}
            message={
              choice === round.result
                ? undefined
                : `${round.equation} = ${round.result}`
            }
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Calcul suivant
            </button>
          </div>
        </>
      )}
    </div>
  )
}
