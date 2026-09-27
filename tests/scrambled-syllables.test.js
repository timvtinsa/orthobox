/**
 * Scrambled-syllables rounds: the one guarantee that matters is that the
 * tiles are not already handed over in reading order, which would turn the
 * game into a single tap.
 */
import { describe, expect, it } from 'vitest'
import { buildRoundFor, buildSeries } from '../src/games/scrambled-syllables/logic.js'
import { WORDS } from '../src/games/scrambled-syllables/data.js'

const RUNS = 200

describe('buildSeries', () => {
  it('draws exactly as many words as asked', () => {
    const series = buildSeries({ syllables: 2, rounds: 10 })
    expect(series).toHaveLength(10)
  })

  it('falls back to two-syllable words for an unknown bucket', () => {
    const series = buildSeries({ syllables: 99, rounds: 4 })
    for (const round of series) {
      expect(round.size).toBe(2)
    }
  })

  it('lets the tiles, put back in their original position, reconstruct the word', () => {
    const series = buildSeries({ syllables: 2, rounds: 5 })
    for (const round of series) {
      const ordered = [...round.tiles].sort(
        (a, b) => Number(a.id.split('-')[0]) - Number(b.id.split('-')[0]),
      )
      expect(ordered.map((tile) => tile.text).join('')).toBe(round.word)
    }
  })
})

describe('buildRoundFor', () => {
  it('gives every tile its own id, even with a repeated syllable', () => {
    const round = buildRoundFor(['pa', 'pa'])
    const ids = round.tiles.map((tile) => tile.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('never hands over a word of three or more syllables already in order', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const syllables of WORDS[3] ?? []) {
        const round = buildRoundFor(syllables)
        const inOrder = round.tiles.every((tile, index) => tile.text === syllables[index])
        expect(inOrder, syllables.join('')).toBe(false)
      }
    }
  })
})
