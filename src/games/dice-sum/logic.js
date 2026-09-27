/**
 * Rolling and correcting a throw of « La somme des dés ».
 *
 * The roll is drawn once, before the dice are animated: what tumbles on
 * screen during the throw is decoration, and the result the patient has to
 * add up is fixed from the start. That keeps the answer independent of when
 * the animation happens to stop.
 */
import { randomInt } from '../../lib/random.js'

export const FACES = 6
export const MIN_DICE = 2
export const MAX_DICE = 4

/** One throw: `[{ id, value }]`. */
export function rollDice(config) {
  const count = Math.min(Math.max(config.dice ?? MIN_DICE, MIN_DICE), MAX_DICE)
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    value: randomInt(1, FACES),
  }))
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

/**
 * The cube rotation that brings each face value to the front, for a die laid
 * out the way a real one is: opposite faces sum to seven (1↔6, 2↔5, 3↔4).
 */
export const FACE_ROTATION = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: -90 },
  3: { x: -90, y: 0 },
  4: { x: 90, y: 0 },
  5: { x: 0, y: 90 },
  6: { x: 0, y: 180 },
}

/**
 * The rotation to animate a die's cube toward: the exact orientation that
 * shows `value`, plus a few random extra full turns per axis so the throw
 * visibly tumbles before landing rather than just spinning to the answer.
 * The extra turns are always a multiple of 360°, so they vanish modulo
 * 360 and never change which face ends up at the front.
 */
export function tumbleRotation(value) {
  const base = FACE_ROTATION[value]
  const spin = () => 360 * randomInt(1, 3) * (Math.random() < 0.5 ? 1 : -1)
  return { x: base.x + spin(), y: base.y + spin() }
}
