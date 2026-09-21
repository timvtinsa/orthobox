/**
 * Building the board of « La suite de formes ».
 *
 * The board itself never changes during a game: each cell keeps the same
 * material (a colour, or a shape+colour pair) from the first sequence to the
 * last. Only the sequence of positions lit one after another grows, exactly
 * as in « La suite lumineuse », which this game reuses the mechanic of.
 */
import { randomInt, sample, shuffle } from '../../lib/random.js'
import { COLORS, SHAPES } from './data.js'

export const MAX_SPAN = 9

/** One distinct material per cell: a colour alone, or a shape+colour pair. */
export function buildBoard(material, cells) {
  if (material === 'shapes') {
    const combos = []
    for (const shape of SHAPES) {
      for (const color of COLORS) {
        combos.push({ shapeId: shape.id, colorId: color.id, hex: color.hex })
      }
    }
    return sample(combos, cells)
  }
  return shuffle(COLORS)
    .slice(0, cells)
    .map((color) => ({ shapeId: null, colorId: color.id, hex: color.hex }))
}

/** Random sequence of board positions, never lighting the same cell twice in a row. */
export function makeSequence(cells, size) {
  const sequence = []
  for (let i = 0; i < size; i += 1) {
    let index = randomInt(0, cells - 1)
    while (cells > 1 && index === sequence[sequence.length - 1]) index = randomInt(0, cells - 1)
    sequence.push(index)
  }
  return sequence
}
