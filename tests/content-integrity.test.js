import { describe, expect, it } from 'vitest'
import { PHRASES } from '../src/games/fill-the-gap/data.js'
import { SHORT_WORDS, LONG_WORDS } from '../src/games/flash-reading/data.js'
import { HOMOPHONES } from '../src/games/homophones/data.js'
import { WORDS } from '../src/games/scrambled-syllables/data.js'
import { SENTENCES } from '../src/games/sentence-order/data.js'

const dupes = (keys) => keys.filter((k, i) => keys.indexOf(k) !== i)

describe('content banks — integrity', () => {
  it('fill-the-gap: no duplicated item, answer never among distractors', () => {
    for (const [series, items] of Object.entries(PHRASES)) {
      expect(dupes(items.map((i) => `${i.before}|${i.after}`)), series).toEqual([])
      for (const i of items) {
        expect(i.distractors).toHaveLength(3)
        expect(i.distractors).not.toContain(i.answer)
        expect(new Set(i.distractors).size).toBe(3)
      }
    }
  })

  it('flash-reading: unique words, lures differ from the target and from each other', () => {
    for (const list of [SHORT_WORDS, LONG_WORDS]) {
      expect(dupes(list.map((i) => i.word))).toEqual([])
      for (const i of list) {
        expect(i.distractors).toHaveLength(3)
        expect(i.distractors).not.toContain(i.word)
        expect(new Set(i.distractors).size).toBe(3)
      }
    }
  })

  it('homophones: no duplicated sentence, answer is one of the pair', () => {
    for (const [id, pair] of Object.entries(HOMOPHONES)) {
      expect(dupes(pair.sentences.map((s) => `${s.before}|${s.after}`)), id).toEqual([])
      for (const s of pair.sentences) expect(pair.words).toContain(s.answer)
    }
  })

  it('scrambled-syllables: unique words, no repeated syllable tile', () => {
    for (const [n, list] of Object.entries(WORDS)) {
      expect(dupes(list.map((w) => w.join(''))), n).toEqual([])
      for (const w of list) {
        expect(w).toHaveLength(Number(n))
        expect(new Set(w).size, w.join('-')).toBe(w.length)
      }
    }
  })

  it('sentence-order: unique sentences of the announced length', () => {
    for (const [n, list] of Object.entries(SENTENCES)) {
      expect(dupes(list.map((s) => s.join(' '))), n).toEqual([])
      for (const s of list) expect(s).toHaveLength(Number(n))
    }
  })
})
