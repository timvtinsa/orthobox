/**
 * Number order: click a series of numbers in order.
 *
 * A series only counts as correct when it is finished without a single
 * mistake, which tells a mastered ordering apart from trial and error.
 */
import { useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import { sample, shuffle } from '../../lib/random.js'

const RANGES = {
  twenty: { min: 1, max: 20, step: 1 },
  hundred: { min: 1, max: 100, step: 1 },
  thousand: { min: 1, max: 1000, step: 1 },
  decimals: { min: 1, max: 100, step: 0.1 },
}

const format = (value, step) =>
  step < 1 ? value.toLocaleString('fr-FR', { minimumFractionDigits: 1 }) : String(value)

function buildRound(config) {
  const range = RANGES[config.range] ?? RANGES.twenty
  const pool = Array.from(
    { length: range.max - range.min + 1 },
    (_, index) => range.min + index,
  )
  const values = sample(pool, config.count).map((value) =>
    range.step < 1 ? Math.round(value * range.step * 10) / 10 : value,
  )
  const descending = config.direction === 'descending'
  const sorted = [...values].sort((a, b) => (descending ? b - a : a - b))
  return {
    // French label, shown in the instruction.
    order: descending ? 'décroissant' : 'croissant',
    step: range.step,
    expected: sorted,
    tiles: shuffle(values),
  }
}

export default function NumberOrder({ config, session }) {
  const rounds = useRounds(config.rounds)
  const [round, setRound] = useState(() => buildRound(config))
  const [placed, setPlaced] = useState([])
  const [error, setError] = useState(null)
  const [flawless, setFlawless] = useState(true)
  const [finished, setFinished] = useState(false)
  // Synchronous mirror of `placed`: guards against clicks faster than a render.
  const placedRef = useRef([])
  const doneRef = useRef(false)
  const flawlessRef = useRef(true)

  const onPick = (value) => {
    if (doneRef.current) return
    const already = placedRef.current
    if (value === round.expected[already.length]) {
      const next = [...already, value]
      placedRef.current = next
      setPlaced(next)
      setError(null)
      if (next.length === round.expected.length) {
        doneRef.current = true
        session.register(flawlessRef.current)
        setFinished(true)
      }
    } else {
      setError(value)
      flawlessRef.current = false
      setFlawless(false)
    }
  }

  const resetRound = () => {
    placedRef.current = []
    doneRef.current = false
    flawlessRef.current = true
    setPlaced([])
    setError(null)
    setFlawless(true)
    setFinished(false)
  }

  const goNext = () => {
    rounds.next()
    setRound(buildRound(config))
    resetRound()
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    setRound(buildRound(config))
    resetRound()
  }

  if (rounds.isOver) {
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">Le score compte les suites terminées sans aucune erreur.</p>
      </GameOver>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Suite {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">
        Clique sur les nombres dans l’ordre {round.order}
      </p>

      <div className="token-row">
        {round.tiles.map((value) => {
          const rank = placed.indexOf(value)
          const isPlaced = rank !== -1
          return (
            <button
              key={value}
              type="button"
              className={`token${isPlaced ? ' token--placed' : ''}${
                error === value ? ' token--error' : ''
              }`}
              disabled={isPlaced || finished}
              onClick={() => onPick(value)}
            >
              {format(value, round.step)}
              {isPlaced && <span className="token__rank">{rank + 1}</span>}
            </button>
          )
        })}
      </div>

      {error !== null && !finished && (
        <Feedback status="wrong" message="Pas encore celui-là : cherche le suivant." />
      )}

      {finished && (
        <>
          <Feedback
            status={flawless ? 'correct' : 'wrong'}
            message={
              flawless
                ? `Suite complète : ${round.expected.map((v) => format(v, round.step)).join(' · ')}`
                : `Suite terminée, avec quelques essais : ${round.expected
                    .map((v) => format(v, round.step))
                    .join(' · ')}`
            }
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Suite suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
