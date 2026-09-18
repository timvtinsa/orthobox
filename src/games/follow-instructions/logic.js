/**
 * Building a round of « La bonne consigne »: a pool of shapes shown, and an
 * ordered subset of them that the instruction asks for.
 *
 * Kept apart from the component so the guarantee that matters can be tested
 * directly: the instructed sequence is always a subset of what is actually
 * on screen, and it never repeats a shape.
 */
import { shuffle } from '../../lib/random.js'
import { COLORS, SHAPES } from './data.js'

export const POOL_SIZE = 6
const LENGTH_BY_LEVEL = { two: 2, three: 3, four: 4 }

function allTokens() {
  const tokens = []
  for (const shape of SHAPES) {
    for (const color of COLORS) {
      tokens.push({
        id: `${shape.id}-${color.id}`,
        shapeId: shape.id,
        shapeLabel: shape.label,
        colorId: color.id,
        colorLabel: color.label,
        hex: color.hex,
      })
    }
  }
  return tokens
}

export function lengthFor(config) {
  return LENGTH_BY_LEVEL[config.length] ?? 2
}

export function buildRound(config) {
  const length = lengthFor(config)
  const pool = shuffle(allTokens()).slice(0, POOL_SIZE)
  const target = shuffle(pool).slice(0, length)
  return { pool, target }
}

/** The instruction read out and displayed, agreeing in number but never in
 * gender: every noun here is masculine, so « le » never has to become « la ». */
export function instructionText(target) {
  const parts = target.map((token) => `le ${token.shapeLabel} ${token.colorLabel}`)
  if (parts.length === 1) return `Touche ${parts[0]}.`
  return `Touche ${parts.slice(0, -1).join(', puis ')}, puis ${parts[parts.length - 1]}.`
}
