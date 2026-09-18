/**
 * Building a clock round: the time shown, and the three lures around it.
 *
 * Kept apart from the component so the guarantee can be tested: a round always
 * offers the right answer exactly once, and never the same wording twice.
 */
import { randomInt, shuffle } from '../../lib/random.js'

/** Minutes the hands may land on, per precision setting. */
export const STEPS = {
  hour: [0],
  half: [0, 30],
  quarter: [0, 15, 30, 45],
  five: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
}

/** How the hour is said in French, the way a practitioner would say it. */
export function speak(hours, minutes) {
  if (minutes === 0) return `${hours} h`
  if (minutes === 15) return `${hours} h et quart`
  if (minutes === 30) return `${hours} h et demie`
  if (minutes === 45) return `${hours} h moins le quart`
  return `${hours} h ${minutes}`
}

export function buildRound(config) {
  const steps = STEPS[config.precision] ?? STEPS.hour
  const hours = randomInt(1, 12)
  const minutes = steps[randomInt(0, steps.length - 1)]
  const label = speak(hours, minutes)

  // Lures are the real slips: the neighbouring hour, and the neighbouring
  // position of the long hand.
  const at = steps.indexOf(minutes)
  const candidates = [
    { hours: hours === 12 ? 1 : hours + 1, minutes },
    { hours, minutes: steps[(at + 1) % steps.length] },
    { hours: hours === 1 ? 12 : hours - 1, minutes },
    { hours, minutes: steps[(at + 2) % steps.length] },
    { hours: hours >= 11 ? hours - 10 : hours + 2, minutes },
  ]

  const lures = []
  for (const candidate of candidates) {
    const wording = speak(candidate.hours, candidate.minutes)
    if (wording !== label && !lures.includes(wording)) lures.push(wording)
    if (lures.length === 3) break
  }

  return { hours, minutes, label, options: shuffle([label, ...lures]) }
}
