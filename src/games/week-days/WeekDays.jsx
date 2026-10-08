/**
 * The days of the week: where a day sits on the cycle of the week.
 *
 * A strip of the seven days can back the question up, with the day it starts
 * from marked: the patient sees the cycle before computing on it, and the
 * practitioner can hide it once the order is secure.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { DAYS, buildSeries } from './logic.js'

function WeekStrip({ pivots }) {
  return (
    <ol className="week-strip" aria-label="La semaine">
      {DAYS.map((day, index) => {
        const isPivot = pivots.includes(index)
        const isWeekend = index >= 5
        return (
          <li
            key={day}
            className={`week-strip__day${isPivot ? ' week-strip__day--pivot' : ''}${
              isWeekend ? ' week-strip__day--weekend' : ''
            }`}
            aria-current={isPivot ? 'true' : undefined}
          >
            {day.slice(0, 3)}.
          </li>
        )
      })}
    </ol>
  )
}

export default function WeekDays({ config, session }) {
  const [series, setSeries] = useState(() => buildSeries(config))
  const rounds = useRounds(series.length, session)
  const round = series[rounds.round]
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const answer = (day) => {
    if (!lock.take()) return
    setPicked(day)
    session.register(day === round.answer, round.prompt)
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

      {config.support === 'strip' && <WeekStrip pivots={round.pivots} />}

      <div className="week-prompt">
        <p className="game-prompt">{round.prompt}</p>
        <SpeakButton text={round.prompt} label="Écouter la question" />
      </div>

      <div className="choice-grid">
        {round.options.map((day) => {
          const state = answerState(day, { picked, expected: round.answer })
          const dim = picked !== null && !state ? ' choice--dim' : ''
          return (
            <button
              key={day}
              type="button"
              className={`choice${stateClass(state)}${dim}`}
              disabled={picked !== null}
              onClick={() => answer(day)}
            >
              {day}
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
