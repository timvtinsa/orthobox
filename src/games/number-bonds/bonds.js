/**
 * Building a complement round: the number given, the one missing, and the
 * lures around it.
 *
 * Kept apart from the component so the guarantee can be tested: a round always
 * offers the right answer exactly once, and never a negative number.
 */
import { createDrawer, drawSeries, randomInt, shuffle } from '../../lib/random.js'

export const TARGETS = { ten: 10, twenty: 20, hundred: 100 }

function stepFor(target) {
  return target === 100 ? 5 : 1
}

function roundFor(target, step, given) {
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

export function buildRound(config) {
  const target = TARGETS[config.target] ?? TARGETS.ten
  const step = stepFor(target)
  const given = randomInt(1, target / step - 1) * step
  return roundFor(target, step, given)
}

/**
 * The whole session's problems. The same bond must not come back soon: 3 and
 * 7 is the same calculation as 7 and 3, so a problem and its mirror count as
 * one, kept three problems apart, and a number is not given again while
 * others are left. A target of ten only has 9 distinct problems, twenty and
 * hundred 19, so at the settings' upper bound of 20 rounds a repeat cannot
 * always be avoided, only postponed.
 */
export function createBondDrawer(config) {
  const target = TARGETS[config.target] ?? TARGETS.ten
  const step = stepFor(target)
  const count = target / step - 1
  return createDrawer(
    () => roundFor(target, step, (randomInt(1, count)) * step),
    {
      recent: (round) => [`${Math.min(round.given, round.answer)}-${Math.max(round.given, round.answer)}`],
      series: (round) => [round.given],
      memory: 3,
    },
  )
}

export function buildSeries(config) {
  return drawSeries(createBondDrawer(config), config.rounds)
}
