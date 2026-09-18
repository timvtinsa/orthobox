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
import { pick, randomInt, shuffle } from '../../lib/random.js'

/** Operand bounds for each range setting. */
const RANGES = {
  ten: { max: 10, tables: [2, 3, 4, 5] },
  twenty: { max: 20, tables: [2, 3, 4, 5, 6, 10] },
  hundred: { max: 100, tables: [2, 3, 4, 5, 6, 7, 8, 9, 10] },
}

/**
 * Plausible lures: the usual mistakes are the immediate neighbour, the
 * forgotten carry (a gap of 10) and the reverse operation.
 */
function distractors(result, gaps) {
  const candidates = new Set()
  for (const gap of shuffle(gaps)) {
    const value = result + gap
    if (value >= 0 && value !== result) candidates.add(value)
    if (candidates.size >= 3) break
  }
  let neighbour = result + 1
  while (candidates.size < 3) {
    if (neighbour !== result && neighbour >= 0) candidates.add(neighbour)
    neighbour += 1
  }
  return [...candidates].slice(0, 3)
}

function buildOperation(config) {
  const range = RANGES[config.range] ?? RANGES.ten
  const operation =
    config.operation === 'mixed'
      ? pick(['addition', 'subtraction'])
      : config.operation

  if (operation === 'multiplication') {
    const a = pick(range.tables)
    const b = randomInt(2, 10)
    return { equation: `${a} × ${b}`, result: a * b, gaps: [a, -a, b, -b, 1, -1, 10, -10] }
  }
  if (operation === 'subtraction') {
    const a = randomInt(Math.ceil(range.max / 2), range.max)
    const b = randomInt(1, a)
    return { equation: `${a} − ${b}`, result: a - b, gaps: [1, -1, 2, -2, 10, -10] }
  }
  const a = randomInt(1, range.max)
  const b = randomInt(1, Math.max(1, range.max - a))
  return { equation: `${a} + ${b}`, result: a + b, gaps: [1, -1, 2, -2, 10, -10] }
}

function buildRound(config) {
  const operation = buildOperation(config)
  return {
    ...operation,
    options: shuffle([operation.result, ...distractors(operation.result, operation.gaps)]),
  }
}

export default function MentalMath({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [round, setRound] = useState(() => buildRound(config))
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
    setRound(buildRound(config))
    setChoice(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    times.current = []
    setRound(buildRound(config))
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
