/**
 * Guarantees of the number line.
 *
 * A round that asks for a number the line does not reach, or a jump that lands
 * off it, is unanswerable without anything crashing. The tolerance matters as
 * much: at zero, a placement could never be right with a finger.
 */
import { describe, expect, it } from 'vitest'
import {
  buildRound,
  RANGES,
  ratioOf,
  ticksFor,
  toleranceFor,
  valueAt,
} from '../src/games/number-line/line.js'

const RUNS = 300
const TASKS = ['place', 'read', 'compute']

describe('reading a tap back as a number', () => {
  it('maps the two ends of the line to the two ends of the range', () => {
    expect(valueAt(0, 100)).toBe(0)
    expect(valueAt(1, 100)).toBe(100)
    expect(valueAt(0.5, 100)).toBe(50)
  })

  it('stays on the line when the finger lands beyond it', () => {
    expect(valueAt(-0.4, 20)).toBe(0)
    expect(valueAt(1.8, 20)).toBe(20)
  })

  it('places a number back where it was read from', () => {
    for (const max of Object.values(RANGES)) {
      for (let value = 0; value <= max; value += 1) {
        expect(valueAt(ratioOf(value, max), max), `${value}/${max}`).toBeCloseTo(value, 6)
      }
    }
  })
})

describe('tolerance', () => {
  it('never asks for the pixel', () => {
    for (const max of Object.values(RANGES)) {
      expect(toleranceFor(max), String(max)).toBeGreaterThanOrEqual(0.5)
    }
  })

  it('stays small enough that a neighbouring number is still wrong', () => {
    for (const max of Object.values(RANGES)) {
      expect(toleranceFor(max), String(max)).toBeLessThan(max / 10)
    }
  })
})

describe('rounds', () => {
  it('never asks for a number the line does not reach', () => {
    for (const task of TASKS) {
      for (const range of Object.keys(RANGES)) {
        for (let run = 0; run < RUNS; run += 1) {
          const round = buildRound({ task, range })
          const where = `${task}/${range}`
          expect(round.target, where).toBeGreaterThanOrEqual(0)
          expect(round.target, where).toBeLessThanOrEqual(round.max)
        }
      }
    }
  })

  it('keeps a jump and its start on the line, and makes the arithmetic true', () => {
    for (const range of Object.keys(RANGES)) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildRound({ task: 'compute', range })
        expect(round.start, range).toBeGreaterThan(0)
        expect(round.start, range).toBeLessThan(round.max)
        expect(round.step, range).toBeGreaterThan(0)
        const expected = round.plus ? round.start + round.step : round.start - round.step
        expect(round.target, range).toBe(expected)
      }
    }
  })

  it('offers four distinct numbers to read, the right one among them', () => {
    for (const range of Object.keys(RANGES)) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildRound({ task: 'read', range })
        expect(round.options, range).toHaveLength(4)
        expect(new Set(round.options).size, range).toBe(4)
        expect(round.options, range).toContain(round.target)
        for (const option of round.options) {
          expect(option, range).toBeGreaterThan(0)
          expect(option, range).toBeLessThan(round.max)
        }
      }
    }
  })
})

describe('graduations', () => {
  it('draws the two ends whatever the setting, and nothing at all when asked', () => {
    expect(ticksFor(100, 'none')).toEqual([])
    expect(ticksFor(100, 'landmarks')).toEqual([0, 50, 100])
    expect(ticksFor(10, 'all')).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('stays readable on a hundred, by tens rather than by units', () => {
    expect(ticksFor(100, 'all')).toHaveLength(11)
  })
})
