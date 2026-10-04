/**
 * The four seasons: where a season sits on the cycle of the year, and what
 * belongs to it.
 *
 * A strip of the four seasons can back the question up, with the one it
 * starts from marked; the practitioner can hide it once the order is secure.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { SEASONS, buildSeries } from './logic.js'

function SeasonStrip({ pivots }) {
  return (
    <ol className="season-strip" aria-label="Les saisons, en cycle">
      {SEASONS.map((season, index) => {
        const isPivot = pivots.includes(index)
        return (
          <li
            key={season}
            className={`season-strip__item${isPivot ? ' season-strip__item--pivot' : ''}`}
            aria-current={isPivot ? 'true' : undefined}
          >
            {season}
          </li>
        )
      })}
    </ol>
  )
}

export default function Seasons({ config, session }) {
  const [series, setSeries] = useState(() => buildSeries(config))
  const rounds = useRounds(series.length, session)
  const round = series[rounds.round]
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const answer = (season) => {
    if (!lock.take()) return
    setPicked(season)
    session.register(season === round.answer)
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

  return (
    <div className="game-board">
      <p className="game-round">
        Question {rounds.round + 1} sur {rounds.total}
      </p>

      {config.support === 'strip' && <SeasonStrip pivots={round.pivots} />}

      <div className="season-prompt">
        <p className="game-prompt">{round.prompt}</p>
        <SpeakButton text={round.prompt} label="Écouter la question" />
      </div>

      <div className="choice-grid">
        {round.options.map((season) => {
          const state = answerState(season, { picked, expected: round.answer })
          const dim = picked !== null && !state ? ' choice--dim' : ''
          return (
            <button
              key={season}
              type="button"
              className={`choice${stateClass(state)}${dim}`}
              disabled={picked !== null}
              onClick={() => answer(season)}
            >
              {season}
              <StateMark state={state} />
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <>
          <Feedback
            status={picked === round.answer ? 'correct' : 'wrong'}
            message={picked === round.answer ? undefined : round.explanation}
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Question suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
