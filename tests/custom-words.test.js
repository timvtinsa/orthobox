import { describe, expect, it } from 'vitest'
import { MAX_OPTIONS, buildRound, buildSeries, canPlay } from '../src/games/custom-words/logic.js'

const WORDS = ['chat', 'chien', 'souris', 'lapin', 'cheval', 'vache', 'mouton']

describe('custom words', () => {
  it('needs one word to read and two to choose between', () => {
    expect(canPlay([], 'read')).toBe(false)
    expect(canPlay(['a'], 'read')).toBe(true)
    expect(canPlay(['a'], 'listen')).toBe(false)
    expect(canPlay(['a', 'b'], 'listen')).toBe(true)
  })

  it('offers the word among others of the list, once each, in listen mode', () => {
    for (let run = 0; run < 200; run += 1) {
      for (const word of WORDS) {
        const round = buildRound(word, WORDS, 'listen')
        expect(round.options).toHaveLength(MAX_OPTIONS)
        expect(new Set(round.options.map((option) => option.toLowerCase())).size).toBe(MAX_OPTIONS)
        expect(round.options.filter((option) => option === word)).toHaveLength(1)
        for (const option of round.options) expect(WORDS).toContain(option)
      }
    }
  })

  it('offers fewer proposals when the list is short, never the word twice', () => {
    const round = buildRound('chat', ['chat', 'Chat', 'chien'], 'listen')
    expect(round.options).toEqual(expect.arrayContaining(['chat', 'chien']))
    expect(round.options.filter((option) => option.toLowerCase() === 'chat')).toHaveLength(1)
  })

  it('shows only the word in read mode', () => {
    expect(buildRound('chat', WORDS, 'read')).toEqual({ word: 'chat' })
  })

  it('goes through the whole list before a word comes back, never twice in a row', () => {
    for (let run = 0; run < 100; run += 1) {
      const series = buildSeries(WORDS, { mode: 'read', rounds: 14 })
      expect(series).toHaveLength(14)
      expect(new Set(series.slice(0, WORDS.length).map((round) => round.word)).size).toBe(WORDS.length)
      series.forEach((round, index) => {
        if (index > 0) expect(round.word).not.toBe(series[index - 1].word)
      })
    }
  })

  it('plays a list of a single word in read mode', () => {
    expect(buildSeries(['chat'], { mode: 'read', rounds: 4 }).map((round) => round.word)).toEqual(['chat', 'chat', 'chat', 'chat'])
  })
})
