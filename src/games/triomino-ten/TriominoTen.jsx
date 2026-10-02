/**
 * Triomino du 10: grow a real mosaic of triangular tiles — left, right or
 * across any already-placed one, not only to the right — by dragging in
 * the one candidate whose facing third completes the neighbour it touches
 * to ten.
 *
 * Each tile is split into three thirds by cevians from its centre to its
 * three corners. Whatever a tile's position, `left` is the third against
 * its left neighbour, `right` against its right one, `free` the third
 * facing across to the row above or below — whichever one its own base
 * edge actually borders.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useDragToZone } from '../../hooks/useDragToZone.js'
import { useRounds } from '../../hooks/useRounds.js'
import { isUp, key, openSlots, tileSlot } from './grid.js'
import { buildRound, firstTile } from './logic.js'
import { pick } from '../../lib/random.js'

const ISOLATED = {
  up: { apex: [50, 8], baseLeft: [6, 88], baseRight: [94, 88] },
  down: { apex: [50, 88], baseLeft: [6, 8], baseRight: [94, 8] },
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

/** A single isolated tile: the pool's candidates and the dragged ghost,
 * drawn in whichever orientation they would take if attached next. */
function TriangleTile({ tile, orientation = 'up', size = 78 }) {
  return (
    <svg viewBox="0 0 100 96" width={size} height={size * 0.96} className="triomino-tile" aria-hidden="true">
      <TileMarks slot={ISOLATED[orientation]} tile={tile} />
    </svg>
  )
}

/** The whole mosaic, one shared coordinate system, plus the pending slot —
 * flush against whichever neighbour it touches, left, right or across, so
 * completing it really glues two matching faces together. Before any
 * attempt it's an empty dashed outline; once the patient has picked a
 * candidate (by click or by drag), that candidate's own tile is drawn
 * right there, coloured by whether it fits. */
function Board({ tiles, pendingSlot, zoneRef, over, pendingTile, pendingState }) {
  const placed = [...tiles.entries()].map(([tileKey, tile]) => {
    const [row, col] = tileKey.split(',').map(Number)
    return { key: tileKey, slot: tileSlot(row, col), tile }
  })
  const pendingGeometry = tileSlot(pendingSlot.row, pendingSlot.col)

  const corners = [
    ...placed.flatMap((entry) => [entry.slot.apex, entry.slot.baseLeft, entry.slot.baseRight]),
    pendingGeometry.apex,
    pendingGeometry.baseLeft,
    pendingGeometry.baseRight,
  ]
  const PAD = 10
  const minX = Math.min(...corners.map((point) => point[0])) - PAD
  const maxX = Math.max(...corners.map((point) => point[0])) + PAD
  const minY = Math.min(...corners.map((point) => point[1])) - PAD
  const maxY = Math.max(...corners.map((point) => point[1])) + PAD
  const viewWidth = maxX - minX
  const viewHeight = maxY - minY
  // Same unit scale as an isolated pool tile (viewBox 100 wide at `size`
  // CSS px, see TriangleTile), so a placed tile and a pooled one read as
  // the same size — only capped so a board that has grown a lot in every
  // direction still stays on screen, on both axes.
  const scale = Math.min(0.85, 520 / viewWidth, 520 / viewHeight)
  const pixelWidth = viewWidth * scale
  const pixelHeight = viewHeight * scale
  const pendingModifier = `${over ? ' triomino-tile--over' : ''}${pendingState ? ` triomino-tile--${pendingState}` : ''}`

  return (
    <svg
      viewBox={`${minX} ${minY} ${viewWidth} ${viewHeight}`}
      width={pixelWidth}
      height={pixelHeight}
      className="triomino-strip"
      preserveAspectRatio="xMidYMid meet"
    >
      {placed.map((entry) => (
        <g key={entry.key} className="triomino-tile">
          <TileMarks slot={entry.slot} tile={entry.tile} />
        </g>
      ))}
      {pendingTile ? (
        <g ref={zoneRef} className={`triomino-tile${pendingModifier}`}>
          <TileMarks slot={pendingGeometry} tile={pendingTile} />
        </g>
      ) : (
        <g ref={zoneRef} className={`triomino-tile triomino-tile--ghost${pendingModifier}`}>
          <TileMarks slot={pendingGeometry} ghost />
        </g>
      )}
    </svg>
  )
}

function startBoard() {
  const tiles = new Map([[key(0, 0), firstTile()]])
  const slot = pick(openSlots(tiles))
  return { tiles, slot }
}

export default function TriominoTen({ config, session }) {
  const optionCount = config.options === 'four' ? 4 : 3
  const rounds = useRounds(config.rounds, session)

  const [tiles, setTiles] = useState(() => startBoard().tiles)
  const [activeSlot, setActiveSlot] = useState(() => pick(openSlots(tiles)))
  const [round, setRound] = useState(() => {
    const neighbourValue = tiles.get(activeSlot.neighbourKey)[activeSlot.neighbourEdge]
    return buildRound(neighbourValue, activeSlot.newEdge, optionCount)
  })
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const activeOrientation = isUp(activeSlot.row, activeSlot.col) ? 'up' : 'down'

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
    const nextTiles = attached ? new Map(tiles).set(key(activeSlot.row, activeSlot.col), round.correct) : tiles
    const nextSlot = pick(openSlots(nextTiles))
    const nextNeighbourValue = nextTiles.get(nextSlot.neighbourKey)[nextSlot.neighbourEdge]
    setTiles(nextTiles)
    setActiveSlot(nextSlot)
    rounds.next()
    setRound(buildRound(nextNeighbourValue, nextSlot.newEdge, optionCount))
    setPicked(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    const { tiles: startTiles, slot: startSlot } = startBoard()
    const startNeighbourValue = startTiles.get(startSlot.neighbourKey)[startSlot.neighbourEdge]
    setTiles(startTiles)
    setActiveSlot(startSlot)
    setRound(buildRound(startNeighbourValue, startSlot.newEdge, optionCount))
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
  const pickedTile = picked === null ? null : round.options.find((option) => option.id === picked)

  return (
    <div className="game-board">
      <p className="game-round">
        Triomino {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">
        Fais glisser le triangle qui, une fois collé, fait dix avec celui-ci.
      </p>

      <Board
        tiles={tiles}
        pendingSlot={activeSlot}
        zoneRef={zone}
        over={over}
        pendingTile={pickedTile}
        pendingState={attachedState}
      />

      <div className="triomino-pool">
        {round.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`triomino-piece${picked === option.id ? ' triomino-piece--placed' : ''}${
              drag?.tile.id === option.id ? ' triomino-piece--dragging' : ''
            }`}
            disabled={picked !== null}
            onClick={() => attempt(option)}
            onPointerDown={(event) => start(event, { tile: option })}
            aria-label={`Triangle : ${option.left}, ${option.right}, ${option.free}`}
          >
            <TriangleTile tile={option} orientation={activeOrientation} />
          </button>
        ))}
      </div>

      {drag && (
        <div className="triomino-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          <TriangleTile tile={drag.tile} orientation={activeOrientation} />
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
