/**
 * Quantity compare: weigh up two collections of dots.
 *
 * Dot sizes vary inside a collection, so the area covered never gives the
 * quantity away.
 */
import { useEffect, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { scatterOnGrid } from '../../lib/layout.js'
import { randomInt } from '../../lib/random.js'

const MATERIALS = {
  subitizing: { min: 1, max: 6, minGap: 2, duration: null, mixed: false },
  medium: { min: 4, max: 14, minGap: 2, duration: null, mixed: false },
  estimation: { min: 10, max: 28, minGap: 2, duration: 1200, mixed: false },
  transcoding: { min: 2, max: 12, minGap: 1, duration: null, mixed: true },
}

/** One collection: scattered dots, deliberately uneven in size. */
function collection(count) {
  return scatterOnGrid(count, { ratio: 2.2, jitter: 0.55 }).positions.map(
    (position, index) => ({
      id: index,
      ...position,
      // Varying sizes: the total area must not give the answer away.
      size: randomInt(16, 30),
    }),
  )
}

function buildRound(config) {
  const material = MATERIALS[config.material] ?? MATERIALS.subitizing
  const left = randomInt(material.min, material.max)
  let right = randomInt(material.min, material.max)
  while (Math.abs(right - left) < material.minGap) {
    right = randomInt(material.min, material.max)
  }
  return {
    duration: material.duration,
    // In transcoding mode, one of the two sides is written as a numeral.
    digit: material.mixed ? (Math.random() < 0.5 ? 'left' : 'right') : null,
    left: { total: left, points: collection(left) },
    right: { total: right, points: collection(right) },
  }
}

export default function QuantityCompare({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [round, setRound] = useState(() => buildRound(config))
  const [picked, setPicked] = useState(null)
  const [hidden, setHidden] = useState(false)
  const lock = useAnswerLock()

  // Estimation level: the collections vanish after a short while.
  useEffect(() => {
    setHidden(false)
    if (!round.duration) return undefined
    const id = window.setTimeout(() => setHidden(true), round.duration)
    return () => window.clearTimeout(id)
  }, [round])

  const winner = round.left.total > round.right.total ? 'left' : 'right'

  const answer = (side) => {
    if (!lock.take()) return
    setPicked(side)
    session.register(side === winner)
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

  const renderSide = (side) => {
    const collection = round[side]
    const asNumeral = round.digit === side
    const state = answerState(side, { picked, expected: winner })

    return (
      <button
        type="button"
        className={`quantity${stateClass(state)}`}
        disabled={Boolean(picked)}
        onClick={() => answer(side)}
        aria-label={`Choisir la collection de ${side === 'left' ? 'gauche' : 'droite'}`}
      >
        {asNumeral ? (
          <span className="quantity__number">{collection.total}</span>
        ) : hidden ? (
          <span className="quantity__hidden" aria-hidden="true">
            ?
          </span>
        ) : (
          collection.points.map((point) => (
            <span
              key={point.id}
              className="dot quantity__dot"
              style={{
                left: `${point.left}%`,
                top: `${point.top}%`,
                width: point.size,
                height: point.size,
              }}
            />
          ))
        )}
        {picked && <span className="quantity__total">{collection.total}</span>}
        <StateMark state={state} />
      </button>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Comparaison {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">Où y en a-t-il le plus ?</p>

      <div className="quantity-pair">
        {renderSide('left')}
        <span className="quantity-vs" aria-hidden="true">
          ou
        </span>
        {renderSide('right')}
      </div>

      {picked && (
        <>
          <Feedback
            status={picked === winner ? 'correct' : 'wrong'}
            message={`${round.left.total} et ${round.right.total} : le plus grand est ${Math.max(
              round.left.total,
              round.right.total,
            )}.`}
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Comparaison suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
