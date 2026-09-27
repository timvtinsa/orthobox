/**
 * Building a round of « La suite de formes ».
 *
 * A pool holds more items than the sequence asks for, exactly as in « La
 * bonne consigne »: the patient has to pick the right ones out, in order,
 * not just replay everything shown. The material setting is what makes the
 * game progressive: plain colours to start, shapes and colours combined once
 * that is mastered.
 */
import { shuffle } from '../../lib/random.js'
import { COLORS, SHAPES } from './data.js'

export const POOL_SIZE = 6
const LENGTH_BY_LEVEL = { two: 2, three: 3, four: 4, five: 5 }

function allItems(material) {
  if (material === 'shapes') {
    const items = []
    for (const shape of SHAPES) {
      for (const color of COLORS) {
        items.push({
          id: `${shape.id}-${color.id}`,
          shapeId: shape.id,
          shapeLabel: shape.label,
          colorLabel: color.label,
          hex: color.hex,
        })
      }
    }
    return items
  }
  return COLORS.map((color) => ({
    id: color.id,
    shapeId: null,
    shapeLabel: null,
    colorLabel: color.label,
    hex: color.hex,
  }))
}

export function lengthFor(config) {
  return LENGTH_BY_LEVEL[config.length] ?? 3
}

export function buildRound(config) {
  const length = lengthFor(config)
  const bank = allItems(config.material)
  const pool = shuffle(bank).slice(0, Math.min(POOL_SIZE, bank.length))
  const target = shuffle(pool).slice(0, length)
  return { pool, target }
}
