/**
 * Triomino du 10: extend a chain of triangular tiles, each split into three
 * numbered thirds, by dragging in the one candidate whose facing third
 * completes the open end to ten.
 *
 * A tile only ever shows its three digits; which two are "facing" each other
 * is for the patient to see from the chain itself, the same way two real
 * triomino tiles touch along one shared edge.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useDragToZone } from '../../hooks/useDragToZone.js'
import { useRounds } from '../../hooks/useRounds.js'
import { buildRound, firstTile } from './logic.js'

const CENTROID = { x: 50, y: 59.33 }

function TriangleTile({ tile, size = 74, ghost = false, state }) {
  const modifier = `${ghost ? ' triomino-tile--ghost' : ''}${state ? ` triomino-tile--${state}` : ''}`
  return (
    <svg
      viewBox="0 0 100 92"
      width={size}
      height={size * 0.92}
      className={`triomino-tile${modifier}`}
      aria-hidden="true"
    >
      <polygon points="50,6 6,86 94,86" className="triomino-tile__shape" />
      {!ghost && (
        <>
          <path
            d={`M${CENTROID.x},${CENTROID.y} L50,6 M${CENTROID.x},${CENTROID.y} L6,86 M${CENTROID.x},${CENTROID.y} L94,86`}
            className="triomino-tile__lines"
          />
          <text x="50" y="30" className="triomino-tile__digit">
            {tile.top}
          </text>
          <text x="27" y="75" className="triomino-tile__digit">
            {tile.left}
          </text>
          <text x="73" y="75" className="triomino-tile__digit">
            {tile.right}
          </text>
        </>
      )}
    </svg>
  )
}

export default function TriominoTen({ config, session }) {
  const optionCount = config.options === 'four' ? 4 : 3
  const rounds = useRounds(config.rounds, session)
  const [chain, setChain] = useState(() => [firstTile()])
  const [round, setRound] = useState(() => buildRound(chain[0].right, optionCount))
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const openEnd = chain[chain.length - 1]

  const attempt = (tile) => {
    if (!lock.take()) return
    setPicked(tile.id)
    session.register(tile.id === round.correct.id)
  }

  // Re-created every render, on purpose: it must always call the latest
  // `attempt`, which itself closes over the current round.
  const { drag, over, zone, start } = useDragToZone({ onDrop: (payload) => attempt(payload.tile) })

  const goNext = () => {
    lock.release()
    const attached = picked === round.correct.id
    const nextChain = attached ? [...chain, round.correct] : chain
    setChain(nextChain)
    rounds.next()
    setRound(buildRound(nextChain[nextChain.length - 1].right, optionCount))
    setPicked(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    const startChain = [firstTile()]
    setChain(startChain)
    setRound(buildRound(startChain[0].right, optionCount))
    setPicked(null)
  }

  if (rounds.isOver) {
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">Deux chiffres qui se touchent doivent toujours faire dix.</p>
      </GameOver>
    )
  }

  const attachedState = picked === null ? null : picked === round.correct.id ? 'ok' : 'err'

  return (
    <div className="game-board">
      <p className="game-round">
        Triomino {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">
        Fais glisser le triangle qui, une fois collé, fait dix avec celui-ci.
      </p>

      <div className="triomino-chain">
        {chain.map((tile, index) => (
          <TriangleTile key={index} tile={tile} />
        ))}
        <div className={`triomino-slot${over ? ' triomino-slot--over' : ''}`} ref={zone}>
          <TriangleTile tile={openEnd} ghost state={attachedState} />
        </div>
      </div>

      <div className="triomino-pool">
        {round.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`triomino-piece${
              picked === option.id ? ` triomino-piece--${attachedState}` : ''
            }${drag?.tile.id === option.id ? ' triomino-piece--dragging' : ''}`}
            disabled={picked !== null}
            onClick={() => attempt(option)}
            onPointerDown={(event) => start(event, { tile: option })}
            aria-label={`Triangle : ${option.top}, ${option.left}, ${option.right}`}
          >
            <TriangleTile tile={option} />
          </button>
        ))}
      </div>

      {drag && (
        <div className="triomino-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          <TriangleTile tile={drag.tile} />
        </div>
      )}

      {picked !== null && (
        <>
          <Feedback
            status={attachedState === 'ok' ? 'correct' : 'wrong'}
            message={
              attachedState === 'ok'
                ? undefined
                : `Il fallait un triangle avec un ${round.target} du côté qui touche.`
            }
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Triomino suivant
            </button>
          </div>
        </>
      )}
    </div>
  )
}
