import { describe, expect, it } from 'vitest'
import { WORDS_BY_SYLLABLES } from '../src/games/syllable-count/data.js'
import { FAMILIES } from '../src/games/word-category/data.js'
import { PAIRS } from '../src/games/opposites/data.js'
import { ONSETS, RHYMES } from '../src/games/sound-odd-one-out/data.js'
import { RIDDLES } from '../src/games/riddles/data.js'

const dupes = (keys) => keys.filter((k, i) => keys.indexOf(k) !== i)

describe('oral-language content banks — integrity', () => {
  it('no word is listed twice within a bank', () => {
    expect(dupes(Object.values(WORDS_BY_SYLLABLES).flat())).toEqual([])
    expect(dupes(FAMILIES.flatMap((f) => f.words))).toEqual([])
    expect(dupes(PAIRS.flat())).toEqual([])
    for (const bank of [ONSETS, RHYMES]) {
      expect(dupes(bank.map((g) => g.sound))).toEqual([])
      for (const g of bank) expect(dupes(g.words), g.sound).toEqual([])
    }
  })

  it('riddles: unique answers, three clues each, answer not given away early', () => {
    expect(dupes(RIDDLES.map((r) => r.answer))).toEqual([])
    for (const r of RIDDLES) {
      expect(r.clues, r.answer).toHaveLength(3)
      const bare = r.answer.replace(/^(le|la|les|l’)\s*/, '').toLowerCase()
      for (const c of r.clues.slice(0, 2)) expect(c.toLowerCase(), r.answer).not.toContain(bare)
    }
  })
})
