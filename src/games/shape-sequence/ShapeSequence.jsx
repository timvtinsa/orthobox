/**
 * Shape sequence: reproduce a sequence of lit cells, each cell carrying a
 * colour, or a shape and a colour together, instead of the blank cells of
 * « La suite lumineuse ». Choosing the material is what makes the game
 * progressive: colour alone first, shape and colour combined once that is
 * mastered.
 */
import { useEffect, useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { buildBoard, makeSequence, MAX_SPAN } from './logic.js'
import ShapeIcon from './ShapeIcon.jsx'

const COLUMNS = { 4: 2, 6: 3 }
const LIT_DURATION = 450
const STEP_DURATION = 700

export default function ShapeSequence({ config, session }) {
  const cells = Number(config.cells)
  const columns = COLUMNS[cells] ?? 2
  const [board, setBoard] = useState(() => buildBoard(config.material, cells))
  const [sequence, setSequence] = useState(() => makeSequence(cells, config.start))
  const [phase, setPhase] = useState('show') // show -> repeat -> passed | failed
  const [step, setStep] = useState(0)
  const [lit, setLit] = useState(null)
  const [input, setInput] = useState([])
  const [over, setOver] = useState(false)
  // Length of the longest sequence reproduced without a mistake.
  const [span, setSpan] = useState(0)
  // Synchronous mirror of `input`: a cell tapped twice in a row must not be
  // compared twice against the same position of the sequence.
  const inputRef = useRef([])

  // Playback of the sequence to memorise.
  useEffect(() => {
    if (phase !== 'show') return undefined
    if (step >= sequence.length) {
      setLit(null)
      setPhase('repeat')
      return undefined
    }
    setLit(sequence[step])
    const off = window.setTimeout(() => setLit(null), LIT_DURATION)
    const goNext = window.setTimeout(() => setStep(step + 1), STEP_DURATION)
    return () => {
      window.clearTimeout(off)
      window.clearTimeout(goNext)
    }
  }, [phase, step, sequence])

  const expected = config.direction === 'backward' ? [...sequence].reverse() : sequence

  const onPick = (index) => {
    if (phase !== 'repeat' || inputRef.current.length >= expected.length) return
    const position = inputRef.current.length
    const next = [...inputRef.current, index]
    inputRef.current = next
    setInput(next)

    if (index !== expected[position]) {
      session.register(false)
      setPhase('failed')
      setOver(true)
      return
    }
    if (next.length === expected.length) {
      session.register(true)
      setSpan(Math.max(span, expected.length))
      setPhase('passed')
    }
  }

  const longerSequence = () => {
    const size = Math.min(sequence.length + 1, MAX_SPAN)
    setSequence(makeSequence(cells, size))
    inputRef.current = []
    setInput([])
    setStep(0)
    setPhase('show')
  }

  const replay = () => {
    session.reset()
    setBoard(buildBoard(config.material, cells))
    setSequence(makeSequence(cells, config.start))
    inputRef.current = []
    setInput([])
    setStep(0)
    setLit(null)
    setOver(false)
    setSpan(0)
    setPhase('show')
  }

  if (over) {
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">
          {span === 0
            ? 'Aucune suite complète cette fois, on peut repartir plus lentement.'
            : `Empan atteint : ${span} ${span > 1 ? 'éléments' : 'élément'}${
                config.direction === 'backward' ? ' (ordre inverse)' : ''
              }`}
        </p>
      </GameOver>
    )
  }

  const prompt =
    phase === 'show'
      ? 'Regarde bien la suite…'
      : config.direction === 'backward'
        ? 'À toi : reproduis la suite À L’ENVERS'
        : 'À toi : reproduis la suite dans le même ordre'

  return (
    <div className="game-board">
      <p className="game-round">
        Suite de {sequence.length} · {config.material === 'shapes' ? 'formes et couleurs' : 'couleurs'} ·{' '}
        {config.direction === 'backward' ? 'ordre inverse' : 'ordre direct'}
      </p>
      <p className="game-prompt">{prompt}</p>

      <div
        className="memo-grid"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(72px, 110px))` }}
      >
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            className={`memo-cell memo-cell--material${lit === index ? ' memo-cell--lit' : ''}${
              phase === 'repeat' ? ' memo-cell--active' : ''
            }`}
            style={cell.shapeId ? undefined : { background: cell.hex }}
            disabled={phase !== 'repeat'}
            aria-label={`Case ${index + 1}`}
            onClick={() => onPick(index)}
          >
            {cell.shapeId && <ShapeIcon shapeId={cell.shapeId} hex={cell.hex} />}
          </button>
        ))}
      </div>

      <div className="memo-progress" aria-hidden="true">
        {expected.map((_, index) => (
          <span
            key={index}
            className={`memo-dot${index < input.length ? ' memo-dot--done' : ''}`}
          />
        ))}
      </div>

      {phase === 'passed' && (
        <>
          <Feedback status="correct" message="Suite complète, bravo !" />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={longerSequence}>
              Suite plus longue
            </button>
          </div>
        </>
      )}
    </div>
  )
}
