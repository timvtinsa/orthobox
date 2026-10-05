/**
 * The guarantee « Le triomino du 10 » needs: exactly one candidate
 * completes a neighbour's edge to ten, and no decoy accidentally does too
 * — whichever of the tile's three edges a round targets.
 */
import { describe, expect, it } from 'vitest'
import { buildRound, firstTile } from '../src/games/triomino-ten/logic.js'

const RUNS = 200
const EDGES = ['left', 'right', 'free']

describe('triomino rounds', () => {
  it('offers exactly one tile whose edge completes the neighbour to ten', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const optionCount of [3, 4]) {
        for (const edge of EDGES) {
          const start = firstTile()
          const neighbourValue = start.right
          const round = buildRound(neighbourValue, edge, optionCount)
          expect(round.options, optionCount).toHaveLength(optionCount)
          expect(round.target).toBe(10 - neighbourValue)

          const matching = round.options.filter((option) => option[edge] === round.target)
          expect(matching, optionCount).toHaveLength(1)
          expect(matching[0].id).toBe(round.correct.id)
          expect(round.correct[edge] + neighbourValue).toBe(10)
        }
      }
    }
  })

  it('never lets a decoy also make ten with the neighbour', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const edge of EDGES) {
        const start = firstTile()
        const neighbourValue = start.right
        const round = buildRound(neighbourValue, edge, 4)
        const decoys = round.options.filter((option) => option.id !== round.correct.id)
        for (const decoy of decoys) {
          expect(decoy[edge] + neighbourValue).not.toBe(10)
        }
      }
    }
  })

  it('draws every third of every tile from 1 to 9', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const start = firstTile()
      for (const value of [start.left, start.right, start.free]) {
        expect(value).toBeGreaterThanOrEqual(1)
        expect(value).toBeLessThanOrEqual(9)
      }
    }
  })
})
