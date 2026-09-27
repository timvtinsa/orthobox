/**
 * The guarantee « Le domino des images » needs: exactly one option
 * continues the chain's open end, and no decoy accidentally does too.
 */
import { describe, expect, it } from 'vitest'
import { buildRound, firstDomino } from '../src/games/domino-image/logic.js'

const RUNS = 200

describe('domino rounds', () => {
  it('offers exactly one domino that continues the open end', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const optionCount of [3, 4]) {
        const chain = firstDomino()
        const round = buildRound(chain.right, optionCount)
        expect(round.options, optionCount).toHaveLength(optionCount)
        const matching = round.options.filter((option) => option.left.id === chain.right.id)
        expect(matching, optionCount).toHaveLength(1)
        expect(matching[0].id).toBe(round.correct.id)
      }
    }
  })

  it('never lets a decoy also match the open end on its right side', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const chain = firstDomino()
      const round = buildRound(chain.right, 4)
      const decoys = round.options.filter((option) => option.id !== round.correct.id)
      for (const decoy of decoys) {
        expect(decoy.left.id).not.toBe(chain.right.id)
        expect(decoy.right.id).not.toBe(chain.right.id)
      }
    }
  })
})
