/**
 * Sanity checks on the homophone bank: every sentence's answer must be one
 * of its own pair's two words, and never both at once — otherwise a round
 * could ask for a spelling that isn't actually offered as an option.
 */
import { describe, expect, it } from 'vitest'
import { HOMOPHONES } from '../src/games/homophones/data.js'

describe('homophone bank', () => {
  it('gives every pair exactly two distinct spellings', () => {
    for (const [key, { words }] of Object.entries(HOMOPHONES)) {
      expect(words, key).toHaveLength(2)
      expect(words[0]).not.toBe(words[1])
    }
  })

  it('answers every sentence with one of its own pair’s two words', () => {
    for (const [key, { words, sentences }] of Object.entries(HOMOPHONES)) {
      for (const sentence of sentences) {
        expect(words, `${key}: ${sentence.before}…${sentence.after}`).toContain(sentence.answer)
      }
    }
  })

  it('never places the gap at the very start of a sentence', () => {
    for (const { sentences } of Object.values(HOMOPHONES)) {
      for (const sentence of sentences) {
        expect(sentence.before.trim().length, sentence.after).toBeGreaterThan(0)
      }
    }
  })

  it('gives every pair enough sentences for a full session', () => {
    for (const [key, { sentences }] of Object.entries(HOMOPHONES)) {
      expect(sentences.length, key).toBeGreaterThanOrEqual(6)
    }
  })
})
