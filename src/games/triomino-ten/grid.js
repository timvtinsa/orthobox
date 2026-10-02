/**
 * The board's geometry: a triangular tiling addressed by (row, col), both
 * arbitrary integers, so the board can grow in any direction from its
 * first tile — left, right, above or below — rather than only rightward.
 *
 * Every tile has three thirds: `left` faces the tile at (row, col - 1),
 * `right` faces (row, col + 1), and `free` faces across to the next row —
 * below for a tile pointing up, above for one pointing down, since that is
 * the row its own base edge actually borders.
 */
export const TILE_WIDTH = 88
export const TILE_HEIGHT = 80

export function isUp(row, col) {
  return (row + col) % 2 === 0
}

export function key(row, col) {
  return `${row},${col}`
}

/** The x of the i-th vertex of the horizontal line between two rows: lines
 * alternate a half-tile offset, which is what makes adjacent rows mesh. */
function lineX(lineIndex, i) {
  const offset = lineIndex % 2 === 0 ? TILE_WIDTH / 2 : 0
  return offset + i * TILE_WIDTH
}

/** The three corners (apex, baseLeft, baseRight) of the tile at (row, col),
 * in one coordinate system shared by the whole board: any two tiles next
 * to each other, in the same row or across rows, share a full edge,
 * pixel for pixel. */
export function tileSlot(row, col) {
  const topY = row * TILE_HEIGHT
  const bottomY = (row + 1) * TILE_HEIGHT
  const up = isUp(row, col)
  const m = Math.floor(col / 2)
  const rowStartsUp = row % 2 === 0
  const topLine = (i) => lineX(row, i)
  const bottomLine = (i) => lineX(row + 1, i)

  if (up) {
    const apexIndex = rowStartsUp ? m : m + 1
    return { apex: [topLine(apexIndex), topY], baseLeft: [bottomLine(m), bottomY], baseRight: [bottomLine(m + 1), bottomY] }
  }
  const apexIndex = rowStartsUp ? m + 1 : m
  return { apex: [bottomLine(apexIndex), bottomY], baseLeft: [topLine(m), topY], baseRight: [topLine(m + 1), topY] }
}

/** The tile's three neighbouring positions: which of its own thirds faces
 * each one, and which third a new tile placed there would face back with. */
export function neighbours(row, col) {
  const across = isUp(row, col) ? { row: row + 1, col } : { row: row - 1, col }
  return [
    { row, col: col - 1, neighbourEdge: 'left', newEdge: 'right' },
    { row, col: col + 1, neighbourEdge: 'right', newEdge: 'left' },
    { ...across, neighbourEdge: 'free', newEdge: 'free' },
  ]
}

/**
 * Every empty position bordering exactly one placed tile, with which edge
 * of that tile it borders and which edge a new tile there would need. A
 * position bordering two or more placed tiles at once is left out — rare,
 * and only once the board has grown enough to close a small loop — rather
 * than risk offering a spot a correct tile could still clash with on its
 * other, already-placed side.
 */
export function openSlots(tiles) {
  const bySlot = new Map()
  for (const tileKey of tiles.keys()) {
    const [row, col] = tileKey.split(',').map(Number)
    for (const neighbour of neighbours(row, col)) {
      const slotKey = key(neighbour.row, neighbour.col)
      if (tiles.has(slotKey)) continue
      const list = bySlot.get(slotKey) ?? []
      list.push({
        row: neighbour.row,
        col: neighbour.col,
        neighbourKey: tileKey,
        neighbourEdge: neighbour.neighbourEdge,
        newEdge: neighbour.newEdge,
      })
      bySlot.set(slotKey, list)
    }
  }
  return [...bySlot.values()].filter((list) => list.length === 1).map((list) => list[0])
}
