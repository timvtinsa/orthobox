/**
 * La bonne consigne: hold an ordered instruction, then act on it.
 *
 * Structurally close to « Le mot en morceaux » (tap to place, tap a placed
 * tile to take it back), but the pool holds more shapes than the
 * instruction asks for: the patient has to pick out the right ones among
 * decoys, not just reorder everything on screen.
 */
import { useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import { buildRound, instructionText } from './logic.js'
import ShapeIcon from './ShapeIcon.jsx'

function Token({ token, onClick, label, showLabel }) {
  return (
    <button type="button" className="token token--shape" onClick={onClick} aria-label={label}>
      <ShapeIcon shapeId={token.shapeId} hex={token.hex} />
      {showLabel && (
        <span className="token__label">
          {token.shapeLabel} {token.colorLabel}
        </span>
      )}
    </button>
  )
}

export default function FollowInstructions({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [round, setRound] = useState(() => buildRound(config))
  const [placed, setPlaced] = useState([])
  const [result, setResult] = useState(null)
  // Miroir synchrone de `placed` : deux taps dans la même image liraient
  // sinon deux fois le même état et fausseraient la validation.
  const placedRef = useRef([])

  const updatePlaced = (next) => {
    placedRef.current = next
    setPlaced(next)
  }

  const place = (token) => {
    if (result) return
    if (placedRef.current.some((item) => item.id === token.id)) return
    const next = [...placedRef.current, token]
    updatePlaced(next)
    if (next.length === round.target.length) {
      const isCorrect = next.every((item, index) => item.id === round.target[index].id)
      setResult(isCorrect ? 'correct' : 'wrong')
      session.register(isCorrect)
    }
  }

  const remove = (token) => {
    if (result) return
    updatePlaced(placedRef.current.filter((item) => item.id !== token.id))
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
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    setRound(buildRound(config))
    updatePlaced([])
    setResult(null)
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  const instruction = instructionText(round.target)
  const remaining = round.pool.filter((token) => !placed.some((item) => item.id === token.id))
  const showLabel = config.showLabels !== 'hidden'

  return (
    <div className="game-board">
      <p className="game-round">
        Consigne {rounds.round + 1} sur {rounds.total}
      </p>

      <div className="syllable-word">
        <p className="game-prompt">{instruction}</p>
        <SpeakButton text={instruction} label="Écouter la consigne" />
      </div>

      <div className={`word-slot${result ? ` word-slot--${result}` : ''}`}>
        {placed.length === 0 ? (
          <span className="word-slot__hint">Touche les formes dans l’ordre de la consigne…</span>
        ) : (
          placed.map((token) => (
            <Token
              key={token.id}
              token={token}
              onClick={() => remove(token)}
              label={`Retirer ${token.shapeLabel} ${token.colorLabel}`}
              showLabel={showLabel}
            />
          ))
        )}
      </div>

      <div className="token-row">
        {remaining.map((token) => (
          <Token
            key={token.id}
            token={token}
            onClick={() => place(token)}
            label={`${token.shapeLabel} ${token.colorLabel}`}
            showLabel={showLabel}
          />
        ))}
      </div>

      {result === 'correct' && (
        <>
          <Feedback status="correct" message="Bravo, c’est le bon ordre." />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Consigne suivante
            </button>
          </div>
        </>
      )}

      {result === 'wrong' && (
        <>
          <Feedback status="wrong" message={`La consigne était : ${instruction}`} />
          <div className="game-actions">
            <button type="button" className="btn btn--subtle" onClick={retry}>
              Réessayer
            </button>
            <button type="button" className="btn" onClick={goNext}>
              Consigne suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
