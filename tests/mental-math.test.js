import { describe, expect, it } from 'vitest'
import { buildRound, createProblemDrawer } from '../src/games/mental-math/logic.js'
import { drawSeries } from '../src/lib/random.js'

const OPERATIONS = ['addition', 'subtraction', 'mixed', 'multiplication']
const RANGES = ['ten', 'twenty', 'hundred']
const RUNS = 60

describe('mental math problems', () => {
  it('offers the result exactly once among four distinct options', () => {
    for (const operation of OPERATIONS) {
      for (const range of RANGES) {
        for (let run = 0; run < 100; run += 1) {
          const round = buildRound({ operation, range })
          expect(round.options).toHaveLength(4)
          expect(new Set(round.options).size).toBe(4)
          expect(round.options.filter((option) => option === round.result)).toHaveLength(1)
        }
      }
    }
  })

  it('never gives the same result twice in a row, whatever the setting', () => {
    for (const operation of OPERATIONS) {
      for (const range of RANGES) {
        for (let run = 0; run < RUNS; run += 1) {
          const rounds = drawSeries(createProblemDrawer({ operation, range }), 20)
          rounds.forEach((round, index) => {
            if (index > 0) expect(round.result, `${operation} ${range}`).not.toBe(rounds[index - 1].result)
          })
        }
      }
    }
  })

  it('keeps three problems between two identical results when the range is wide', () => {
    for (const operation of ['addition', 'mixed', 'multiplication']) {
      for (let run = 0; run < RUNS; run += 1) {
        const rounds = drawSeries(createProblemDrawer({ operation, range: 'hundred' }), 20)
        rounds.forEach((round, index) => {
          for (let back = 1; back <= 3 && index - back >= 0; back += 1) {
            expect(round.result, operation).not.toBe(rounds[index - back].result)
          }
        })
      }
    }
  })

  it('does not ask the same calculation twice, 3 + 4 and 4 + 3 being one', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const rounds = drawSeries(createProblemDrawer({ operation: 'mixed', range: 'hundred' }), 20)
      const keys = rounds.map((round) => round.key)
      expect(new Set(keys).size).toBe(keys.length)
    }
  })
})
