/**
 * What time is it? Reading an analogue clock.
 *
 * Time reading sits between number and language: the dial has to be read, then
 * put into words, and the two hands have to be told apart. The dial is drawn
 * here rather than stored as an image, so it follows the palette and stays
 * crisp at any size.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { buildRound } from './clock.js'

function Dial({ hours, minutes }) {
  const minuteAngle = minutes * 6
  const hourAngle = (hours % 12) * 30 + minutes * 0.5
  const hand = (angle, length, width) => {
    const radians = ((angle - 90) * Math.PI) / 180
    return (
      <line
        x1="100"
        y1="100"
        x2={100 + Math.cos(radians) * length}
        y2={100 + Math.sin(radians) * length}
        stroke="var(--category)"
        strokeWidth={width}
        strokeLinecap="round"
      />
    )
  }

  return (
    <svg className="dial" viewBox="0 0 200 200" role="img" aria-label="Horloge à aiguilles">
      <circle cx="100" cy="100" r="92" fill="#fff" stroke="var(--category)" strokeWidth="6" />
      {Array.from({ length: 12 }, (_, index) => {
        const radians = ((index * 30 - 90) * Math.PI) / 180
        return (
          <circle
            key={index}
            cx={100 + Math.cos(radians) * 74}
            cy={100 + Math.sin(radians) * 74}
            r={index % 3 === 0 ? 7 : 4}
            fill="var(--category-pastel)"
          />
        )
      })}
      {hand(hourAngle, 46, 10)}
      {hand(minuteAngle, 68, 6)}
      <circle cx="100" cy="100" r="8" fill="var(--category)" />
    </svg>
  )
}

export default function ClockReading({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [round, setRound] = useState(() => buildRound(config))
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const answer = (label) => {
    if (!lock.take()) return
    setPicked(label)
    session.register(label === round.label)
  }

  const goNext = () => {
    lock.release()
    rounds.next()
    setRound(buildRound(config))
    setPicked(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setRound(buildRound(config))
    setPicked(null)
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Horloge {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">Quelle heure est-il ?</p>

      <Dial hours={round.hours} minutes={round.minutes} />

      <div className="choice-grid choice-grid--wide">
        {round.options.map((label) => {
          const state = answerState(label, { picked, expected: round.label })
          const dim = picked && !state ? ' choice--dim' : ''
          return (
            <button
              key={label}
              type="button"
              className={`choice${stateClass(state)}${dim}`}
              disabled={Boolean(picked)}
              onClick={() => answer(label)}
            >
              {label}
              <StateMark state={state} />
            </button>
          )
        })}
      </div>

      {picked && (
        <>
          <Feedback
            status={picked === round.label ? 'correct' : 'wrong'}
            message={picked === round.label ? undefined : `Il est ${round.label}.`}
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Horloge suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
