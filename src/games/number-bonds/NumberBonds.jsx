/**
 * The complement: how much is missing to reach the target.
 *
 * Not the same exercise as mental arithmetic, where both terms are given: here
 * one of the two is the unknown, which is what number bonds are about. A ten
 * frame can back the target up, so the answer can be seen before it is
 * computed.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { buildSeries } from './bonds.js'

export default function NumberBonds({ config, session }) {
  const [series, setSeries] = useState(() => buildSeries(config))
  const rounds = useRounds(series.length, session)
  const round = series[rounds.round]
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const answer = (value) => {
    if (!lock.take()) return
    setPicked(value)
    session.register(value === round.answer)
  }

  const goNext = () => {
    lock.release()
    rounds.next()
    setPicked(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setSeries(buildSeries(config))
    setPicked(null)
  }

  if (rounds.isOver || !round) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  const showFrame = config.support === 'frame' && round.target === 10

  return (
    <div className="game-board">
      <p className="game-round">
        Calcul {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">Combien manque-t-il pour faire {round.target} ?</p>

      <p className="bond-line">
        <span className="bond-line__given">{round.given}</span>
        <span className="bond-line__sign" aria-hidden="true">
          +
        </span>
        <span className="bond-line__hole" aria-label="nombre manquant" />
        <span className="bond-line__sign" aria-hidden="true">
          =
        </span>
        <span className="bond-line__given">{round.target}</span>
      </p>

      {showFrame && (
        <div className="ten-frame" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => (
            <span
              key={index}
              className={`ten-frame__cell${index < round.given ? ' ten-frame__cell--filled' : ''}`}
            />
          ))}
        </div>
      )}

      <div className="choice-grid">
        {round.options.map((value) => {
          const state = answerState(value, { picked, expected: round.answer })
          const dim = picked !== null && !state ? ' choice--dim' : ''
          return (
            <button
              key={value}
              type="button"
              className={`choice choice--number${stateClass(state)}${dim}`}
              disabled={picked !== null}
              onClick={() => answer(value)}
            >
              {value}
              <StateMark state={state} />
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <>
          <Feedback
            status={picked === round.answer ? 'correct' : 'wrong'}
            message={
              picked === round.answer
                ? undefined
                : `${round.given} + ${round.answer} = ${round.target}`
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
