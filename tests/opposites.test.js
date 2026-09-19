/**
 * The one guarantee the antonym bank needs: every word belongs to exactly
 * one pair. Otherwise the same word could stand as both the expected answer
 * and a distractor drawn from another pair, which would make a round
 * unwinnable or, worse, accept a wrong tap.
 */
import { describe, expect, it } from 'vitest'
import { PAIRS } from '../src/games/opposites/data.js'

describe('antonym bank', () => {
  it('gives every pair exactly two distinct words', () => {
    for (const pair of PAIRS) {
      expect(pair, pair.join('/')).toHaveLength(2)
      expect(pair[0]).not.toBe(pair[1])
    }
  })

  it('never lets a word appear in more than one pair', () => {
    const words = PAIRS.flat()
    expect(new Set(words).size).toBe(words.length)
  })

  it('holds enough pairs to draw three distractors from other pairs', () => {
    expect(PAIRS.length).toBeGreaterThanOrEqual(4)
  })
})
