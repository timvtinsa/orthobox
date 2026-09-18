/**
 * Building a number line round, and reading a tap back as a number.
 *
 * Kept apart from the component so the guarantees can be tested: a round never
 * asks for a number outside its own line, a computed round never lands outside
 * it either, and the tolerance never collapses to zero, which would make a
 * placement impossible to get right with a finger.
 */
import { randomInt, shuffle } from '../../lib/random.js'

export const RANGES = { ten: 10, twenty: 20, hundred: 100 }

/**
 * How far a tap may sit from the exact spot and still count.
 *
 * Four percent of the line, and never less than half a unit: on a tablet the
 * finger is wider than the mark it leaves, so asking for the pixel would
 * measure dexterity rather than number sense.
 */
export function toleranceFor(max) {
  return Math.max(0.5, max * 0.04)
}

/** The number a tap lands on, from its position along the line. */
export function valueAt(ratio, max) {
  const clamped = Math.min(1, Math.max(0, ratio))
  return clamped * max
}

/** Where a number sits along the line, as a ratio from 0 to 1. */
export function ratioOf(value, max) {
  return Math.min(1, Math.max(0, value / max))
}

function placeRound(max) {
  return { kind: 'place', max, target: randomInt(1, max - 1) }
}

function readRound(max) {
  const step = max <= 20 ? 1 : 5
  const target = step * randomInt(1, max / step - 1)

  // Drawn from the numbers the line can actually show, so the fill can never
  // run out of candidates: walking outwards from the target would loop for
  // ever once it reached the end of the line.
  const pool = []
  for (let value = step; value < max; value += step) {
    if (value !== target) pool.push(value)
  }

  // The instructive lures first: the two neighbours, then the number
  // symmetrical about the middle, which is where a mis-scaled line lands.
  const wanted = [target + step, target - step, max - target]
  const priority = wanted.filter((value) => pool.includes(value))
  const lures = [...new Set([...priority, ...shuffle(pool)])].slice(0, 3)

  return { kind: 'read', max, target, options: shuffle([target, ...lures]) }
}

function computeRound(max) {
  const step = max <= 20 ? randomInt(2, Math.max(2, Math.floor(max / 2))) : 5 * randomInt(2, 8)
  const plus = Math.random() < 0.5
  const start = plus ? randomInt(1, max - step - 1) : randomInt(step + 1, max - 1)
  const target = plus ? start + step : start - step
  return { kind: 'compute', max, start, step, plus, target }
}

export function buildRound(config) {
  const max = RANGES[config.range] ?? RANGES.ten
  if (config.task === 'read') return readRound(max)
  if (config.task === 'compute') return computeRound(max)
  return placeRound(max)
}

/** The graduations drawn under the line, for a given setting. */
export function ticksFor(max, ticks) {
  if (ticks === 'none') return []
  if (ticks === 'landmarks') return [0, max / 2, max]
  const step = max <= 20 ? 1 : 10
  const values = []
  for (let value = 0; value <= max; value += step) values.push(value)
  return values
}
