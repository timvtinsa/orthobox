/**
 * The guarantee « Le triomino du 10 » needs: exactly one candidate
 * completes the open end to ten, and no decoy accidentally does too.
 */
import { describe, expect, it } from 'vitest'
import { buildRound, firstTile } from '../src/games/triomino-ten/logic.js'

const RUNS = 200

describe('triomino rounds', () => {
  it('offers exactly one tile whose left third completes the open end to ten', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const optionCount of [3, 4]) {
        const start = firstTile()
        const round = buildRound(start.right, optionCount)
        expect(round.options, optionCount).toHaveLength(optionCount)
        expect(round.target).toBe(10 - start.right)

        const matching = round.options.filter((option) => option.left === round.target)
        expect(matching, optionCount).toHaveLength(1)
        expect(matching[0].id).toBe(round.correct.id)
        expect(round.correct.left + start.right).toBe(10)
      }
    }
  })

  it('never lets a decoy also make ten with the open end', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const start = firstTile()
      const round = buildRound(start.right, 4)
      const decoys = round.options.filter((option) => option.id !== round.correct.id)
      for (const decoy of decoys) {
        expect(decoy.left + start.right).not.toBe(10)
      }
    }
  })

  it('draws every third of every tile from 1 to 9', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const start = firstTile()
      for (const value of [start.left, start.right, start.top]) {
        expect(value).toBeGreaterThanOrEqual(1)
        expect(value).toBeLessThanOrEqual(9)
      }
    }
  })
})
