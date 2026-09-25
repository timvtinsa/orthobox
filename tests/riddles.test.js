/**
 * Riddle deck: a generator that lets a theme run dry, or hands back a riddle
 * from the wrong theme, would make the setting screen's choice a lie.
 */
import { describe, expect, it } from 'vitest'
import { buildDeck } from '../src/games/riddles/logic.js'
import { RIDDLES } from '../src/games/riddles/data.js'

describe('buildDeck', () => {
  it('draws exactly as many riddles as asked', () => {
    const deck = buildDeck({ theme: 'mixed', rounds: 8 })
    expect(deck).toHaveLength(8)
  })

  it('keeps every riddle within the chosen theme', () => {
    const deck = buildDeck({ theme: 'animals', rounds: 12 })
    for (const riddle of deck) {
      expect(riddle.theme).toBe('animals')
    }
  })

  it('mixes every theme when asked to', () => {
    const deck = buildDeck({ theme: 'mixed', rounds: 40 })
    const themes = new Set(deck.map((riddle) => riddle.theme))
    expect(themes.size).toBeGreaterThan(1)
  })

  it('falls back to the whole bank for a theme with no riddles', () => {
    const deck = buildDeck({ theme: 'no-such-theme', rounds: 5 })
    expect(deck).toHaveLength(5)
  })

  it('draws more rounds than a theme has riddles without erroring', () => {
    const smallestTheme = Object.entries(
      RIDDLES.reduce((counts, riddle) => {
        counts[riddle.theme] = (counts[riddle.theme] ?? 0) + 1
        return counts
      }, {}),
    ).sort((a, b) => a[1] - b[1])[0][0]

    const deck = buildDeck({ theme: smallestTheme, rounds: 30 })
    expect(deck).toHaveLength(30)
  })
})
