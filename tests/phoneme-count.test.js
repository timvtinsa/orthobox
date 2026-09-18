/**
 * Sanity checks on the phoneme bank: not whether a count is phonetically
 * right (that is a judgement call made once, by hand, when curating the
 * list), but that the structure itself cannot silently break a round — no
 * word doubles up under two different counts, no tier is left empty, and
 * every settings range actually has something to draw from.
 */
import { describe, expect, it } from 'vitest'
import { WORDS_BY_PHONEMES } from '../src/games/phoneme-count/data.js'

describe('phoneme bank', () => {
  it('never lists the same word under two different counts', () => {
    const seen = new Map()
    for (const [count, words] of Object.entries(WORDS_BY_PHONEMES)) {
      for (const word of words) {
        expect(seen.has(word), `« ${word} » listed under both ${seen.get(word)} and ${count}`).toBe(
          false,
        )
        seen.set(word, count)
      }
    }
  })

  it('holds no duplicate within a single count', () => {
    for (const [count, words] of Object.entries(WORDS_BY_PHONEMES)) {
      expect(new Set(words).size, `count ${count}`).toBe(words.length)
    }
  })

  it('gives every tier used by the settings at least a handful of words', () => {
    for (const count of [2, 3, 4, 5]) {
      expect(WORDS_BY_PHONEMES[count]?.length ?? 0, `count ${count}`).toBeGreaterThanOrEqual(5)
    }
  })
})
