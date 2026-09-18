/**
 * Guarantees of the round generators.
 *
 * A generator that drops the right answer, or offers it twice, makes a game
 * silently unwinnable: nothing crashes, the patient simply cannot be right.
 * These runs are repeated because the generators draw at random.
 */
import { describe, expect, it } from 'vitest'
import { buildRound as buildClock, speak, STEPS } from '../src/games/clock-reading/clock.js'
import { buildRound as buildBond, TARGETS } from '../src/games/number-bonds/bonds.js'
import { buildRound as buildLetters, SETS } from '../src/games/letter-discrimination/letters.js'
import { FAMILIES } from '../src/games/word-category/data.js'
import { WORDS_BY_SYLLABLES } from '../src/games/syllable-count/data.js'

const RUNS = 300

describe('combien de syllabes', () => {
  it('fills every bucket the settings can draw from', () => {
    for (const count of [1, 2, 3, 4]) {
      expect(WORDS_BY_SYLLABLES[count].length, `${count} syllabes`).toBeGreaterThanOrEqual(8)
    }
  })

  it('never files the same word under two counts', () => {
    const all = Object.values(WORDS_BY_SYLLABLES).flat()
    expect(new Set(all).size).toBe(all.length)
  })
})

describe('l’intrus de la famille', () => {
  it('holds enough words to draw four without repeating', () => {
    for (const family of FAMILIES) {
      expect(family.words.length, family.id).toBeGreaterThanOrEqual(5)
      expect(family.label, family.id).toBeTruthy()
    }
  })

  it('never puts one word in two families, which would make the intruder arguable', () => {
    const all = FAMILIES.flatMap((family) => family.words)
    expect(new Set(all).size).toBe(all.length)
  })
})

describe('la bonne lettre', () => {
  it('shows the target exactly once, whatever the row size', () => {
    for (const family of ['mirrors', 'rotations', 'mixed']) {
      for (let size = 3; size <= 6; size += 1) {
        for (let run = 0; run < 40; run += 1) {
          const round = buildLetters({ family, size })
          const letters = round.cells.map((cell) => cell.letter)
          expect(letters.filter((letter) => letter === round.target), `${family}/${size}`).toHaveLength(1)
          expect(round.cells, `${family}/${size}`).toHaveLength(size)
        }
      }
    }
  })

  it('only offers lures from the target’s own confusion family', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const round = buildLetters({ family: 'mirrors', size: 4 })
      const family = SETS.mirrors.find((set) => set.includes(round.target))
      for (const cell of round.cells) expect(family).toContain(cell.letter)
    }
  })
})

describe('le compte est bon', () => {
  it('offers four distinct answers, the right one among them', () => {
    for (const target of Object.keys(TARGETS)) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildBond({ target })
        expect(round.options, target).toHaveLength(4)
        expect(new Set(round.options).size, target).toBe(4)
        expect(round.options, target).toContain(round.answer)
      }
    }
  })

  it('never proposes a negative number, nor one that misses the count', () => {
    for (const target of Object.keys(TARGETS)) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildBond({ target })
        expect(round.given + round.answer, target).toBe(round.target)
        for (const option of round.options) expect(option, target).toBeGreaterThan(0)
      }
    }
  })
})

describe('quelle heure est-il', () => {
  it('says the hour the way a practitioner says it', () => {
    expect(speak(3, 0)).toBe('3 h')
    expect(speak(3, 15)).toBe('3 h et quart')
    expect(speak(3, 30)).toBe('3 h et demie')
    expect(speak(3, 45)).toBe('3 h moins le quart')
    expect(speak(3, 20)).toBe('3 h 20')
  })

  it('offers four distinct wordings, the right one among them', () => {
    for (const precision of Object.keys(STEPS)) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildClock({ precision })
        expect(round.options, precision).toHaveLength(4)
        expect(new Set(round.options).size, precision).toBe(4)
        expect(round.options, precision).toContain(round.label)
      }
    }
  })

  it('keeps the hands on a readable hour', () => {
    for (const precision of Object.keys(STEPS)) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildClock({ precision })
        expect(round.hours, precision).toBeGreaterThanOrEqual(1)
        expect(round.hours, precision).toBeLessThanOrEqual(12)
        expect(STEPS[precision], precision).toContain(round.minutes)
      }
    }
  })
})
