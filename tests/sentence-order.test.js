/**
 * Sanity checks on the sentence bank: every entry actually has the word
 * count its own tier promises, no sentence repeats, and no tile identity
 * could collide within a single sentence.
 */
import { describe, expect, it } from 'vitest'
import { SENTENCES } from '../src/games/sentence-order/data.js'

describe('sentence bank', () => {
  it('gives every sentence exactly the word count of its own tier', () => {
    for (const [count, sentences] of Object.entries(SENTENCES)) {
      for (const words of sentences) {
        expect(words, words.join(' ')).toHaveLength(Number(count))
      }
    }
  })

  it('holds no duplicate sentence within a tier', () => {
    for (const [count, sentences] of Object.entries(SENTENCES)) {
      const joined = sentences.map((words) => words.join(' '))
      expect(new Set(joined).size, `count ${count}`).toBe(joined.length)
    }
  })

  it('never writes a word with a capital letter or trailing punctuation', () => {
    for (const sentences of Object.values(SENTENCES)) {
      for (const words of sentences) {
        for (const word of words) {
          expect(word, word).toBe(word.toLowerCase())
          expect(word, word).not.toMatch(/[.,!?]/)
        }
      }
    }
  })

  it('gives every settings tier at least a handful of sentences', () => {
    for (const count of [4, 5, 6]) {
      expect(SENTENCES[count]?.length ?? 0, `count ${count}`).toBeGreaterThanOrEqual(5)
    }
  })
})
