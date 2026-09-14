/**
 * Scattering items inside a frame, without overlap.
 *
 * Two games spread objects across an area: the dot collections and the visual
 * search scene. A purely random draw would clump and overlap, so cells are
 * drawn from an invisible grid, then nudged so that the grid itself does not
 * show.
 *
 * Coordinates are percentages of the container, so the layout follows the
 * real size of the frame on any screen.
 */
import { sample } from './random.js'

/**
 * @param {number} count  items to place
 * @param {object} options
 * @param {number} [options.spread]  cells available per item (the higher, the
 *                                   airier the layout)
 * @param {number} [options.jitter]  random offset, as a fraction of a cell
 * @returns {{ columns: number, rows: number, cellWidth: number,
 *             cellHeight: number, positions: Array<{left: number, top: number}> }}
 */
export function scatterOnGrid(count, { spread = 1.6, jitter = 0.5 } = {}) {
  const columns = Math.max(1, Math.ceil(Math.sqrt(count * spread)))
  const rows = Math.max(1, Math.ceil(count / columns))
  const cellWidth = 100 / columns
  const cellHeight = 100 / rows

  const cells = sample(
    Array.from({ length: columns * rows }, (_, index) => index),
    count,
  )

  const positions = cells.map((index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    const offset = (amplitude) => (Math.random() - 0.5) * amplitude
    return {
      left: column * cellWidth + cellWidth / 2 + offset(cellWidth * jitter),
      top: row * cellHeight + cellHeight / 2 + offset(cellHeight * jitter),
    }
  })

  return { columns, rows, cellWidth, cellHeight, positions }
}
