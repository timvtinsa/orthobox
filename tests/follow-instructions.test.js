/**
 * The guarantee « La bonne consigne » needs: the instruction can always be
 * carried out by what is actually on screen, and it never asks twice for
 * the same shape, which would make the round unwinnable.
 */
import { describe, expect, it } from 'vitest'
import { buildRound, instructionText, lengthFor, POOL_SIZE } from '../src/games/follow-instructions/logic.js'

const LEVELS = ['two', 'three', 'four']
const RUNS = 100

describe('rounds', () => {
  it('gives every level the pool and target size it promises', () => {
    for (const length of LEVELS) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildRound({ length })
        expect(round.pool, length).toHaveLength(POOL_SIZE)
        expect(round.target, length).toHaveLength(lengthFor({ length }))
      }
    }
  })

  it('only ever asks for shapes actually shown in the pool', () => {
    for (const length of LEVELS) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildRound({ length })
        const poolIds = new Set(round.pool.map((token) => token.id))
        for (const token of round.target) {
          expect(poolIds.has(token.id), token.id).toBe(true)
        }
      }
    }
  })

  it('never asks for the same shape twice in one instruction', () => {
    for (const length of LEVELS) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildRound({ length })
        const ids = round.target.map((token) => token.id)
        expect(new Set(ids).size).toBe(ids.length)
      }
    }
  })

  it('never repeats a shape within the pool itself', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const round = buildRound({ length: 'two' })
      const ids = round.pool.map((token) => token.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
})

describe('instruction text', () => {
  it('never needs a feminine article: every noun is masculine', () => {
    const round = buildRound({ length: 'four' })
    expect(instructionText(round.target)).not.toMatch(/\bla\b|\bl’(?!e)/)
  })

  it('joins every step but the last with «, puis »', () => {
    const target = [
      { shapeLabel: 'rond', colorLabel: 'bleu' },
      { shapeLabel: 'carré', colorLabel: 'rouge' },
      { shapeLabel: 'triangle', colorLabel: 'jaune' },
    ]
    expect(instructionText(target)).toBe(
      'Touche le rond bleu, puis le carré rouge, puis le triangle jaune.',
    )
  })
})
