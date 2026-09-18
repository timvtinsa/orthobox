/**
 * Building a complement round: the number given, the one missing, and the
 * lures around it.
 *
 * Kept apart from the component so the guarantee can be tested: a round always
 * offers the right answer exactly once, and never a negative number.
 */
import { randomInt, shuffle } from '../../lib/random.js'

export const TARGETS = { ten: 10, twenty: 20, hundred: 100 }

export function buildRound(config) {
  const target = TARGETS[config.target] ?? TARGETS.ten
  const step = target === 100 ? 5 : 1
  const given = randomInt(1, target / step - 1) * step
  const answer = target - given

  // Lures are the usual slips: the neighbours, and the given number mistaken
  // for the complement.
  const lures = new Set()
  for (const gap of shuffle([step, -step, 2 * step, -2 * step, given - answer])) {
    const value = answer + gap
    if (value > 0 && value !== answer) lures.add(value)
    if (lures.size >= 3) break
  }
  let neighbour = answer + step
  while (lures.size < 3) {
    if (neighbour !== answer && neighbour > 0) lures.add(neighbour)
    neighbour += step
  }

  return { target, given, answer, options: shuffle([answer, ...[...lures].slice(0, 3)]) }
}
