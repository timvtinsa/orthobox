/**
 * The number line: where a number sits, and what a jump along it lands on.
 *
 * A number is not only a quantity, it is also a place. Patients who count
 * everything often have no spatial image of the number chain at all, and
 * calculation stays a recitation. The line gives that image, then the third
 * task asks for a calculation read off it: start here, jump this far, where do
 * you land.
 *
 * Graduations are the difficulty knob rather than the range: with every tick
 * shown, placing is counting; with the landmarks only, it is estimating; with
 * a bare line, it is the mental image doing the work.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { buildRound, ratioOf, ticksFor, toleranceFor, valueAt } from './line.js'

// Repère de dessin : la ligne vit dans un viewBox large, pour rester nette
// à toutes les tailles sans recalculer de pixels.
const W = 1000
const H = 210
const LEFT = 70
const RIGHT = W - 70
const AXIS = 132

const at = (ratio) => LEFT + ratio * (RIGHT - LEFT)

/** The arc of a jump, drawn from the start towards where it lands. */
function jumpPath(round, answered) {
  const from = at(ratioOf(round.start, round.max))
  const to = answered
    ? at(ratioOf(round.target, round.max))
    : from + (round.plus ? 1 : -1) * 70
  const peak = AXIS - (answered ? 78 : 52)
  return `M${from} ${AXIS - 18} Q${(from + to) / 2} ${peak} ${to} ${AXIS - 18}`
}

function Marker({ ratio, variant, label }) {
  const x = at(ratio)
  return (
    <g className={`line-marker line-marker--${variant}`}>
      <path d={`M${x} ${AXIS - 4}v-40`} strokeWidth="7" strokeLinecap="round" />
      <circle cx={x} cy={AXIS - 52} r="15" />
      {label !== undefined && (
        <text x={x} y={AXIS - 68} textAnchor="middle" className="line-marker__label">
          {label}
        </text>
      )}
    </g>
  )
}

export default function NumberLine({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [round, setRound] = useState(() => buildRound(config))
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const tolerance = toleranceFor(round.max)
  const ticks = ticksFor(round.max, config.ticks)

  const settle = (value, isCorrect) => {
    setPicked(value)
    session.register(isCorrect)
  }

  /** A tap anywhere along the line, read back as a number. */
  const tapLine = (event) => {
    if (!lock.take()) return
    const box = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - box.left) / box.width
    const value = valueAt(ratio, round.max)
    settle(value, Math.abs(value - round.target) <= tolerance)
  }

  const chooseNumber = (value) => {
    if (!lock.take()) return
    settle(value, value === round.target)
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

  const answered = picked !== null
  const isRight = answered && Math.abs(picked - round.target) <= tolerance
  const byTap = round.kind !== 'read'

  const prompt =
    round.kind === 'place'
      ? `Où se place ${round.target} ?`
      : round.kind === 'read'
        ? 'Quel nombre est marqué ?'
        : `Pars de ${round.start}, ${round.plus ? 'avance' : 'recule'} de ${round.step}. Où arrives-tu ?`

  return (
    <div className="game-board">
      <p className="game-round">
        Nombre {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">{prompt}</p>

      <svg
        className="number-line"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Ligne numérique de 0 à ${round.max}`}
      >
        <line x1={LEFT} y1={AXIS} x2={RIGHT} y2={AXIS} className="number-line__axis" />

        {ticks.map((value) => (
          <g key={value}>
            <line
              x1={at(ratioOf(value, round.max))}
              y1={AXIS - 12}
              x2={at(ratioOf(value, round.max))}
              y2={AXIS + 12}
              className="number-line__tick"
            />
            {(config.ticks === 'landmarks' || value % (round.max <= 20 ? 5 : 50) === 0) && (
              <text
                x={at(ratioOf(value, round.max))}
                y={AXIS + 46}
                textAnchor="middle"
                className="number-line__figure"
              >
                {value}
              </text>
            )}
          </g>
        ))}

        {/* Les deux bornes sont toujours écrites : sans elles la ligne ne dit
            pas de quoi à quoi elle va. */}
        <text x={LEFT} y={AXIS + 46} textAnchor="middle" className="number-line__figure">
          0
        </text>
        <text x={RIGHT} y={AXIS + 46} textAnchor="middle" className="number-line__figure">
          {round.max}
        </text>

        {round.kind === 'read' && (
          <Marker ratio={ratioOf(round.target, round.max)} variant="ask" />
        )}

        {round.kind === 'compute' && (
          <>
            <Marker ratio={ratioOf(round.start, round.max)} variant="start" label={round.start} />
            {/* Avant la réponse, l'arc part et s'arrête : c'est au patient de
                dire où il retombe. Après, il rejoint le nombre visé. */}
            <path className="number-line__jump" d={jumpPath(round, answered)} />
          </>
        )}

        {answered && !isRight && (
          <Marker ratio={ratioOf(round.target, round.max)} variant="expected" label={round.target} />
        )}
        {answered && (
          <Marker
            ratio={ratioOf(picked, round.max)}
            variant={isRight ? 'ok' : 'err'}
            label={Math.round(picked)}
          />
        )}

        {byTap && !answered && (
          <rect
            className="number-line__hit"
            x={LEFT}
            y={AXIS - 70}
            width={RIGHT - LEFT}
            height={140}
            onClick={tapLine}
          />
        )}
      </svg>

      {round.kind === 'read' && (
        <div className="choice-grid">
          {round.options.map((value) => {
            const state = answerState(value, { picked, expected: round.target })
            const dim = answered && !state ? ' choice--dim' : ''
            return (
              <button
                key={value}
                type="button"
                className={`choice choice--number${stateClass(state)}${dim}`}
                disabled={answered}
                onClick={() => chooseNumber(value)}
              >
                {value}
                <StateMark state={state} />
              </button>
            )
          })}
        </div>
      )}

      {byTap && !answered && (
        <p className="game-instruction">Touche la ligne à l’endroit qui convient.</p>
      )}

      {answered && (
        <>
          <Feedback
            status={isRight ? 'correct' : 'wrong'}
            message={isRight ? undefined : `C’était ${round.target}.`}
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Nombre suivant
            </button>
          </div>
        </>
      )}
    </div>
  )
}
