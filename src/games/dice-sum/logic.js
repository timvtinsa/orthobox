/**
 * Rolling and correcting a throw of « La somme des dés ».
 *
 * The roll is drawn once, before the dice are animated: what flickers on
 * screen during the throw is decoration, and the result the patient has to
 * add up is fixed from the start. That keeps the answer independent of when
 * the animation happens to stop.
 *
 * `display` decides how each die shows its value. « mixed » is the one that
 * matters clinically: one die in pips, the next as a digit, which asks the
 * patient to move between the two ways of writing a quantity.
 */
import { randomInt } from '../../lib/random.js'

export const FACES = 6
export const MIN_DICE = 2
export const MAX_DICE = 4

/** One throw: `[{ id, value, shown }]`, `shown` being 'pips' or 'digits'. */
export function rollDice(config) {
  const count = Math.min(Math.max(config.dice ?? MIN_DICE, MIN_DICE), MAX_DICE)
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    value: randomInt(1, FACES),
    shown: faceDisplay(config.display, index),
  }))
}

/** How die number `index` is shown, under the « Affichage » setting. */
export function faceDisplay(display, index) {
  if (display === 'digits') return 'digits'
  if (display === 'mixed') return index % 2 === 0 ? 'pips' : 'digits'
  return 'pips'
}

export function sumOf(roll) {
  return roll.reduce((total, die) => total + die.value, 0)
}

/** The largest sum the current setting can produce, so the pad can cap input. */
export function maxSum(config) {
  const count = Math.min(Math.max(config.dice ?? MIN_DICE, MIN_DICE), MAX_DICE)
  return count * FACES
}

/**
 * A typed answer is correct when it reads as the sum. Leading zeroes are
 * tolerated: « 07 » is the same quantity as « 7 », and the game is about the
 * addition, not about how a number is written down.
 */
export function isCorrectAnswer(typed, roll) {
  if (typed === '') return false
  return Number(typed) === sumOf(roll)
}
