import { describe, expect, it } from 'vitest'
import { COMMON_WORDS, digitSequence, sameWord } from '../src/lib/lexicon.js'

describe('word comparison', () => {
  it('ignores case, accents and surrounding spaces', () => {
    expect(sameWord('Gateau', 'gâteau')).toBe(true)
    expect(sameWord('  ÉCHELLE ', 'echelle')).toBe(true)
    expect(sameWord('clé', 'cle')).toBe(true)
  })

  it('tells two different words apart', () => {
    expect(sameWord('lapin', 'sapin')).toBe(false)
    expect(sameWord('', 'lapin')).toBe(false)
  })
})

describe('lexicon', () => {
  it('holds no duplicate', () => {
    expect(new Set(COMMON_WORDS).size).toBe(COMMON_WORDS.length)
  })
})

describe('digit sequence', () => {
  it('has the requested length', () => {
    expect(digitSequence(7)).toHaveLength(7)
  })

  it('never repeats the same digit twice in a row', () => {
    for (let attempt = 0; attempt < 50; attempt += 1) {
      const sequence = digitSequence(10)
      for (let i = 1; i < sequence.length; i += 1) {
        expect(sequence[i]).not.toBe(sequence[i - 1])
      }
    }
  })
})
