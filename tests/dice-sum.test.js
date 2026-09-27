/**
 * The guarantees « La somme des dés » needs: a throw only ever produces real
 * die faces, the correction reads the typed answer as a quantity rather than
 * as a string, and the 3D tumble always settles on the face that was drawn.
 */
import { describe, expect, it } from 'vitest'
import {
  FACE_ROTATION,
  FACES,
  isCorrectAnswer,
  MAX_DICE,
  MIN_DICE,
  maxSum,
  rollDice,
  sumOf,
  tumbleRotation,
} from '../src/games/dice-sum/logic.js'

const RUNS = 200

/** Degrees modulo 360, always in `[0, 360)` regardless of sign. */
function normalize(degrees) {
  return ((degrees % 360) + 360) % 360
}

describe('throws', () => {
  it('rolls exactly the number of dice asked for', () => {
    for (let dice = MIN_DICE; dice <= MAX_DICE; dice += 1) {
      for (let run = 0; run < RUNS; run += 1) {
        expect(rollDice({ dice })).toHaveLength(dice)
      }
    }
  })

  it('never shows a face a die does not have', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const die of rollDice({ dice: MAX_DICE })) {
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

describe('the 3D tumble', () => {
  it('lands on the rotation that shows the drawn value, however many extra turns it takes', () => {
    for (let value = 1; value <= FACES; value += 1) {
      for (let run = 0; run < RUNS; run += 1) {
        const rotation = tumbleRotation(value)
        expect(normalize(rotation.x)).toBe(normalize(FACE_ROTATION[value].x))
        expect(normalize(rotation.y)).toBe(normalize(FACE_ROTATION[value].y))
      }
    }
  })

  it('only ever adds whole extra turns, never a partial one', () => {
    for (let value = 1; value <= FACES; value += 1) {
      for (let run = 0; run < RUNS; run += 1) {
        const rotation = tumbleRotation(value)
        expect(Math.abs(rotation.x - FACE_ROTATION[value].x) % 360).toBe(0)
        expect(Math.abs(rotation.y - FACE_ROTATION[value].y) % 360).toBe(0)
      }
    }
  })

  it('gives each face on the cube a distinct rotation, opposite faces summing to seven', () => {
    const opposite = { 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1 }
    for (const [value, expected] of Object.entries(opposite)) {
      expect(Number(value) + expected).toBe(7)
    }
    const rotations = Object.values(FACE_ROTATION).map((r) => `${r.x},${r.y}`)
    expect(new Set(rotations).size).toBe(FACES)
  })
})

describe('correction', () => {
  const roll = [
    { id: 0, value: 4 },
    { id: 1, value: 3 },
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
