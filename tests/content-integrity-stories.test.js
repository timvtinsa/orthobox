import { describe, expect, it } from 'vitest'
import { STORIES } from '../src/games/story-details/data.js'
import { COMMON_WORDS, sameWord } from '../src/lib/lexicon.js'

describe('story bank — integrity', () => {
  it('has unique ids and a story for every length', () => {
    const ids = STORIES.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const length of ['short', 'medium', 'long']) {
      expect(STORIES.filter((s) => s.length === length).length, length).toBeGreaterThanOrEqual(3)
    }
  })

  it('every question has four distinct options and a valid answer index', () => {
    for (const story of STORIES) {
      expect(story.questions.length, story.id).toBeGreaterThanOrEqual(5)
      for (const q of story.questions) {
        expect(q.options, `${story.id}: ${q.question}`).toHaveLength(4)
        expect(new Set(q.options).size).toBe(4)
        expect(q.options[q.answer]).toBeTruthy()
      }
    }
  })
})

describe('lexicon — integrity', () => {
  it('has no two words that a typed answer could not tell apart', () => {
    const keys = COMMON_WORDS.map((w) => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase())
    expect(new Set(keys).size).toBe(keys.length)
    expect(sameWord('Éponge', 'eponge')).toBe(true)
  })
})
