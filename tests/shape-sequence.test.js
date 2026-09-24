/**
 * The guarantee « La suite de formes » needs: the sequence to reconstitute
 * is always a subset of what is actually on screen, it never repeats an
 * item, and it never asks for more than the pool actually holds.
 */
import { describe, expect, it } from 'vitest'
import { buildRound, lengthFor, POOL_SIZE } from '../src/games/shape-sequence/logic.js'

const LENGTHS = ['two', 'three', 'four', 'five']
const RUNS = 100

describe('rounds', () => {
  it('gives every length the pool and target size it promises, for both materials', () => {
    for (const material of ['colors', 'shapes']) {
      for (const length of LENGTHS) {
        for (let run = 0; run < RUNS; run += 1) {
          const round = buildRound({ material, length })
          expect(round.pool, `${material}/${length}`).toHaveLength(POOL_SIZE)
          expect(round.target, `${material}/${length}`).toHaveLength(lengthFor({ length }))
        }
      }
    }
  })

  it('only ever asks for items actually shown in the pool', () => {
    for (const material of ['colors', 'shapes']) {
      for (const length of LENGTHS) {
        for (let run = 0; run < RUNS; run += 1) {
          const round = buildRound({ material, length })
          const poolIds = new Set(round.pool.map((item) => item.id))
          for (const item of round.target) {
            expect(poolIds.has(item.id), item.id).toBe(true)
          }
        }
      }
    }
  })

  it('never asks for the same item twice in one sequence', () => {
    for (const material of ['colors', 'shapes']) {
      for (const length of LENGTHS) {
        for (let run = 0; run < RUNS; run += 1) {
          const round = buildRound({ material, length })
          const ids = round.target.map((item) => item.id)
          expect(new Set(ids).size).toBe(ids.length)
        }
      }
    }
  })

  it('never repeats an item within the pool itself', () => {
    for (const material of ['colors', 'shapes']) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildRound({ material, length: 'two' })
        const ids = round.pool.map((item) => item.id)
        expect(new Set(ids).size).toBe(ids.length)
      }
    }
  })

  it('gives colour-only items no shape, and shape items a shape', () => {
    for (let run = 0; run < RUNS; run += 1) {
      expect(buildRound({ material: 'colors', length: 'two' }).pool.every((item) => item.shapeId === null)).toBe(true)
      expect(buildRound({ material: 'shapes', length: 'two' }).pool.every((item) => item.shapeId !== null)).toBe(true)
    }
  })
})
