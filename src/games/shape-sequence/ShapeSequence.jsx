/**
 * Shape sequence: memorise an ordered sequence of colours, or shapes and
 * colours combined, then reconstitute it in order once it is hidden.
 *
 * Structurally close to « La bonne consigne » (tap to place, tap a placed
 * item to take it back), but the sequence is memorised visually during a
 * timed study phase instead of read as an instruction. The material setting
 * is what makes the game progressive: colour alone to start, shape and
 * colour combined once that is mastered.
 */
import { useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import StudyPhase from '../../components/StudyPhase.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import { buildRound } from './logic.js'
import ShapeIcon from './ShapeIcon.jsx'

function itemLabel(item) {
  return item.shapeLabel ? `${item.shapeLabel} ${item.colorLabel}` : item.colorLabel
}

function Item({ item, onClick, label, rank, disabled }) {
  return (
    <button
      type="button"
      className="token token--shape"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {item.shapeId ? (
        <ShapeIcon shapeId={item.shapeId} hex={item.hex} />
      ) : (
        <span className="token__color-swatch" style={{ background: item.hex }} aria-hidden="true" />
      )}
      {rank != null && <span className="token__rank">{rank}</span>}
    </button>
  )
}

export default function ShapeSequence({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [round, setRound] = useState(() => buildRound(config))
  const [phase, setPhase] = useState('study') // study -> test
  const [placed, setPlaced] = useState([])
  const [result, setResult] = useState(null)
  // Miroir synchrone de `placed` : deux taps dans la même image liraient
  // sinon deux fois le même état et fausseraient la validation.
  const placedRef = useRef([])

  const updatePlaced = (next) => {
    placedRef.current = next
    setPlaced(next)
  }

  const place = (item) => {
    if (result) return
    if (placedRef.current.some((entry) => entry.id === item.id)) return
    const next = [...placedRef.current, item]
    updatePlaced(next)
    if (next.length === round.target.length) {
      const isCorrect = next.every((entry, index) => entry.id === round.target[index].id)
      setResult(isCorrect ? 'correct' : 'wrong')
      session.register(isCorrect)
    }
  }

  const remove = (item) => {
    if (result) return
    updatePlaced(placedRef.current.filter((entry) => entry.id !== item.id))
  }

  const retry = () => {
    updatePlaced([])
    setResult(null)
  }

  const goNext = () => {
    rounds.next()
    setRound(buildRound(config))
    updatePlaced([])
    setResult(null)
    setPhase('study')
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    setRound(buildRound(config))
    updatePlaced([])
    setResult(null)
    setPhase('study')
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  if (phase === 'study') {
    return (
      <StudyPhase
        seconds={config.duration}
        instruction="Retiens bien l’ordre de cette suite"
        onDone={() => setPhase('test')}
      >
        <div className="token-row">
          {round.target.map((item, index) => (
            <Item key={item.id} item={item} label={itemLabel(item)} rank={index + 1} disabled />
          ))}
        </div>
      </StudyPhase>
    )
  }

  const remaining = round.pool.filter((item) => !placed.some((entry) => entry.id === item.id))

  return (
    <div className="game-board">
      <p className="game-round">
        Suite {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">Replace les éléments dans l’ordre mémorisé</p>

      <div className={`word-slot${result ? ` word-slot--${result}` : ''}`}>
        {placed.length === 0 ? (
          <span className="word-slot__hint">Touche les éléments dans l’ordre…</span>
        ) : (
          placed.map((item, index) => (
            <Item
              key={item.id}
              item={item}
              onClick={() => remove(item)}
              label={`Retirer ${itemLabel(item)}`}
              rank={index + 1}
            />
          ))
        )}
      </div>

      <div className="token-row">
        {remaining.map((item) => (
          <Item key={item.id} item={item} onClick={() => place(item)} label={itemLabel(item)} />
        ))}
      </div>

      {result === 'correct' && (
        <>
          <Feedback status="correct" message="Bravo, c’est le bon ordre." />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Suite suivante
            </button>
          </div>
        </>
      )}

      {result === 'wrong' && (
        <>
          <Feedback status="wrong" message="Ce n’était pas le bon ordre. L’ordre à retenir était :" />
          <div className="token-row">
            {round.target.map((item, index) => (
              <Item key={item.id} item={item} label={itemLabel(item)} rank={index + 1} disabled />
            ))}
          </div>
          <div className="game-actions">
            <button type="button" className="btn btn--subtle" onClick={retry}>
              Réessayer
            </button>
            <button type="button" className="btn" onClick={goNext}>
              Suite suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
