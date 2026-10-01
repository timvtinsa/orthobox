/**
 * Triomino du 10: extend a real strip of triangular tiles, apex up then
 * apex down in turn so each one shares a full edge with its neighbour, by
 * dragging in the one candidate whose facing third completes the open edge
 * to ten.
 *
 * Each tile is split into three thirds by cevians from its centre to its
 * three corners. Whatever a tile's orientation, `left` is the third against
 * the previous tile, `right` the third against the next one, `free` the
 * third on the tile's own outer edge, which this strip never touches.
 */
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useDragToZone } from '../../hooks/useDragToZone.js'
import { useRounds } from '../../hooks/useRounds.js'
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { buildRound, firstTile } from './logic.js'

const TILE_WIDTH = 88
const TOP_Y = 8
const BOTTOM_Y = 88
const MARGIN = 6

function bottomX(i) {
  return MARGIN + i * TILE_WIDTH
}

function topX(i) {
  return MARGIN + TILE_WIDTH / 2 + i * TILE_WIDTH
}

/** The three corners (apex, baseLeft, baseRight) of the k-th tile of a
 * horizontal strip: apex up on even tiles, apex down on odd ones, each
 * sharing a full edge with the tile before and after it — a real
 * tessellation, not a row of separate icons. */
function stripSlot(k) {
  if (k % 2 === 0) {
    const m = k / 2
    return { apex: [topX(m), TOP_Y], baseLeft: [bottomX(m), BOTTOM_Y], baseRight: [bottomX(m + 1), BOTTOM_Y] }
  }
  const m = (k - 1) / 2
  return { apex: [bottomX(m + 1), BOTTOM_Y], baseLeft: [topX(m), TOP_Y], baseRight: [topX(m + 1), TOP_Y] }
}

const ISOLATED = {
  up: { apex: [50, TOP_Y], baseLeft: [6, BOTTOM_Y], baseRight: [94, BOTTOM_Y] },
  down: { apex: [50, BOTTOM_Y], baseLeft: [6, TOP_Y], baseRight: [94, TOP_Y] },
}

function mid(...points) {
  return [
    points.reduce((sum, p) => sum + p[0], 0) / points.length,
    points.reduce((sum, p) => sum + p[1], 0) / points.length,
  ]
}

/** Centre of each of the three thirds a tile's cevians carve out. */
function regionCentres({ apex, baseLeft, baseRight }) {
  const centre = mid(apex, baseLeft, baseRight)
  return {
    centre,
    left: mid(centre, apex, baseLeft),
    right: mid(centre, apex, baseRight),
    free: mid(centre, baseLeft, baseRight),
  }
}

/** A tile's shape, division lines and digits — placed at each third's own
 * centre, inside its region rather than on the lines that bound it. */
function TileMarks({ slot, tile, ghost }) {
  const points = `${slot.apex.join(',')} ${slot.baseLeft.join(',')} ${slot.baseRight.join(',')}`
  if (ghost) {
    return <polygon points={points} className="triomino-tile__shape" />
  }
  const { centre, left, right, free } = regionCentres(slot)
  return (
    <>
      <polygon points={points} className="triomino-tile__shape" />
      <path
        d={`M${centre.join(',')} L${slot.apex.join(',')} M${centre.join(',')} L${slot.baseLeft.join(',')} M${centre.join(',')} L${slot.baseRight.join(',')}`}
        className="triomino-tile__lines"
      />
      <text x={left[0]} y={left[1]} className="triomino-tile__digit">
        {tile.left}
      </text>
      <text x={right[0]} y={right[1]} className="triomino-tile__digit">
        {tile.right}
      </text>
      <text x={free[0]} y={free[1]} className="triomino-tile__digit">
        {tile.free}
      </text>
    </>
  )
}

/** A single tile, isolated: the pool's candidates and the dragged ghost,
 * drawn in whichever orientation they would take if attached next. */
function TriangleTile({ tile, orientation = 'up', size = 78, ghost = false, state }) {
  const modifier = `${ghost ? ' triomino-tile--ghost' : ''}${state ? ` triomino-tile--${state}` : ''}`
  return (
    <svg
      viewBox="0 0 100 96"
      width={size}
      height={size * 0.96}
      className={`triomino-tile${modifier}`}
      aria-hidden="true"
    >
      <TileMarks slot={ISOLATED[orientation]} tile={tile} ghost={ghost} />
    </svg>
  )
}

/** The whole chain, one shared coordinate system, plus the dashed slot
 * waiting for the next tile — flush against the chain's last real edge, so
 * dropping the right candidate there really glues two faces together. */
function Strip({ chain, zoneRef, over, pendingState }) {
  const slots = []
  for (let k = 0; k <= chain.length; k += 1) slots.push(stripSlot(k))
  const xs = slots.flatMap((slot) => [slot.apex[0], slot.baseLeft[0], slot.baseRight[0]])
  const viewWidth = Math.max(...xs) + MARGIN
  const viewHeight = BOTTOM_Y + MARGIN
  // Same unit scale as an isolated pool tile (viewBox 100 wide at `size`
  // CSS px, see TriangleTile), so a chained tile and a pooled one read as
  // the same size — only capped so a long chain stays on screen instead of
  // pushing the pool below the fold.
  const pixelWidth = Math.min(viewWidth * 0.85, 680)
  const pixelHeight = (pixelWidth / viewWidth) * viewHeight

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      width={pixelWidth}
      height={pixelHeight}
      className="triomino-strip"
      preserveAspectRatio="xMidYMid meet"
    >
      {slots.map((slot, k) => {
        if (k === chain.length) {
          const modifier = `${over ? ' triomino-tile--over' : ''}${pendingState ? ` triomino-tile--${pendingState}` : ''}`
          return (
            <g key={k} ref={zoneRef} className={`triomino-tile triomino-tile--ghost${modifier}`}>
              <TileMarks slot={slot} ghost />
            </g>
          )
        }
        return (
          <g key={k} className="triomino-tile">
            <TileMarks slot={slot} tile={chain[k]} />
          </g>
        )
      })}
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

  const nextOrientation = chain.length % 2 === 0 ? 'up' : 'down'

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

      <Strip chain={chain} zoneRef={zone} over={over} pendingState={attachedState} />

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
            aria-label={`Triangle : ${option.left}, ${option.right}, ${option.free}`}
          >
            <TriangleTile tile={option} orientation={nextOrientation} />
          </button>
        ))}
      </div>

      {drag && (
        <div className="triomino-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          <TriangleTile tile={drag.tile} orientation={nextOrientation} />
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
