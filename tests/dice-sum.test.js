/**
 * The guarantees « La somme des dés » needs: a throw only ever produces real
 * die faces, the display setting decides how each one is written, and the
 * correction reads the typed answer as a quantity rather than as a string.
 */
import { describe, expect, it } from 'vitest'
import {
  FACES,
  faceDisplay,
  isCorrectAnswer,
  MAX_DICE,
  MIN_DICE,
  maxSum,
  rollDice,
  sumOf,
} from '../src/games/dice-sum/logic.js'

const RUNS = 200

describe('throws', () => {
  it('rolls exactly the number of dice asked for', () => {
    for (let dice = MIN_DICE; dice <= MAX_DICE; dice += 1) {
      for (let run = 0; run < RUNS; run += 1) {
        expect(rollDice({ dice, display: 'pips' })).toHaveLength(dice)
      }
    }
  })

  it('never shows a face a die does not have', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const die of rollDice({ dice: MAX_DICE, display: 'pips' })) {
        expect(die.value).toBeGreaterThanOrEqual(1)
        expect(die.value).toBeLessThanOrEqual(FACES)
        expect(Number.isInteger(die.value)).toBe(true)
      }
    }
  })

  it('clamps a dice count outside the settings back into range', () => {
    expect(rollDice({ dice: 1 })).toHaveLength(MIN_DICE)
    expect(rollDice({ dice: 99 })).toHaveLength(MAX_DICE)
  })

  it('eventually produces every face', () => {
    const seen = new Set()
    for (let run = 0; run < RUNS; run += 1) {
      for (const die of rollDice({ dice: MAX_DICE })) seen.add(die.value)
    }
    expect(seen.size).toBe(FACES)
  })

  it('sums the faces it actually rolled', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const roll = rollDice({ dice: 3 })
      expect(sumOf(roll)).toBe(roll[0].value + roll[1].value + roll[2].value)
    }
  })
})

describe('display', () => {
  it('shows every die the same way outside the mixed setting', () => {
    expect(rollDice({ dice: 4, display: 'pips' }).every((d) => d.shown === 'pips')).toBe(true)
    expect(rollDice({ dice: 4, display: 'digits' }).every((d) => d.shown === 'digits')).toBe(true)
  })

  it('alternates pips and digits when mixed', () => {
    expect(rollDice({ dice: 4, display: 'mixed' }).map((d) => d.shown)).toEqual([
      'pips',
      'digits',
      'pips',
      'digits',
    ])
  })

  it('defaults to pips when no display is set', () => {
    expect(faceDisplay(undefined, 0)).toBe('pips')
    expect(faceDisplay(undefined, 1)).toBe('pips')
  })
})

describe('correction', () => {
  const roll = [
    { id: 0, value: 4, shown: 'pips' },
    { id: 1, value: 3, shown: 'pips' },
  ]

  it('accepts the sum', () => {
    expect(isCorrectAnswer('7', roll)).toBe(true)
  })

  it('rejects any other total', () => {
    expect(isCorrectAnswer('6', roll)).toBe(false)
    expect(isCorrectAnswer('8', roll)).toBe(false)
    expect(isCorrectAnswer('43', roll)).toBe(false)
  })

  it('rejects an empty answer rather than reading it as zero', () => {
    expect(isCorrectAnswer('', roll)).toBe(false)
  })

  it('tolerates a leading zero, which is the same quantity', () => {
    expect(isCorrectAnswer('07', roll)).toBe(true)
  })

  it('caps the pad at the digits the largest reachable sum needs', () => {
    expect(maxSum({ dice: 2 })).toBe(12)
    expect(maxSum({ dice: 4 })).toBe(24)
    expect(String(maxSum({ dice: 2 })).length).toBe(2)
  })
})
