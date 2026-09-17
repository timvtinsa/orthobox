/**
 * Building a letter row: the target, and the letters it gets confused with.
 *
 * Kept apart from the component so the guarantee can be tested: the target
 * appears in the row exactly once, otherwise the answer would be ambiguous.
 */
import { pick, sample, shuffle } from '../../lib/random.js'

/** Confusion sets: every letter of a set is a plausible lure for the others. */
export const SETS = {
  mirrors: [
    ['b', 'd', 'p', 'q'],
    ['B', 'D', 'P', 'Q'],
  ],
  rotations: [
    ['n', 'u'],
    ['m', 'w'],
    ['a', 'e'],
    ['f', 't'],
  ],
}

export function buildRound(config) {
  const families =
    config.family === 'mixed' ? [...SETS.mirrors, ...SETS.rotations] : SETS[config.family] ?? SETS.mirrors
  const family = pick(families)
  const target = pick(family)
  const lures = family.filter((letter) => letter !== target)

  // The target takes one place; the rest are lures, drawn again as needed when
  // the family is too small to fill the row on its own.
  const cells = [target]
  while (cells.length < config.size) {
    const missing = config.size - cells.length
    cells.push(...sample(lures, Math.min(missing, lures.length)))
  }

  return { target, cells: shuffle(cells).map((letter, index) => ({ id: index, letter })) }
}
