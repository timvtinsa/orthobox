import { describe, expect, it } from 'vitest'
import { CLUES, KINDS_BY_LEVEL, MONTHS, SEASONS, buildRound, buildSeries, seasonOfMonth, wrap } from '../src/games/seasons/logic.js'

const RUNS = 300
const NAMES = { 'le printemps': 0, 'l’été': 1, 'l’automne': 2, 'l’hiver': 3 }
const COUNTS = { deux: 2, trois: 3 }

/** Names mentioned in a prompt, in order of appearance. */
function mentioned(prompt) {
  return Object.keys(NAMES)
    .map((name) => ({ name, at: prompt.indexOf(name) }))
    .filter((hit) => hit.at >= 0)
    .sort((a, b) => a.at - b.at)
    .map((hit) => NAMES[hit.name])
}

function expectedAnswer(round) {
  const [from, to] = mentioned(round.prompt)
  switch (round.kind) {
    case 'next':
      return wrap(from + 1)
    case 'previous':
      return wrap(from - 1)
    case 'between':
      return wrap(to - 1)
    case 'later':
      return wrap(from + COUNTS[round.prompt.match(/(deux|trois) saisons/)[1]])
    case 'earlier':
      return wrap(from - COUNTS[round.prompt.match(/(deux|trois) saisons/)[1]])
    case 'month': {
      const month = MONTHS.findIndex((name) => round.prompt.includes(`en ${name} `))
      return [2, 3, 4].includes(month) ? 0 : [5, 6, 7].includes(month) ? 1 : [8, 9, 10].includes(month) ? 2 : 3
    }
    default: {
      const season = CLUES.findIndex((clues) => clues.some((clue) => round.prompt.includes(clue)))
      return season
    }
  }
}

describe('seasons', () => {
  it('wraps around the year in both directions', () => {
    expect(wrap(4)).toBe(0)
    expect(wrap(-1)).toBe(3)
    expect(wrap(-6)).toBe(2)
  })

  it('places each month in its meteorological season', () => {
    expect(MONTHS.map((_, month) => SEASONS[seasonOfMonth(month)])).toEqual([
      'hiver', 'hiver', 'printemps', 'printemps', 'printemps', 'été',
      'été', 'été', 'automne', 'automne', 'automne', 'hiver',
    ])
  })

  it('offers each season once and the right one among them', () => {
    for (const kind of new Set(Object.values(KINDS_BY_LEVEL).flat())) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildRound(kind)
        expect([...round.options].sort()).toEqual([...SEASONS].sort())
        expect(round.answer).toBe(SEASONS[expectedAnswer(round)])
      }
    }
  })

  it('explains the answer', () => {
    for (const kind of new Set(Object.values(KINDS_BY_LEVEL).flat())) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildRound(kind)
        expect(round.explanation.length).toBeGreaterThan(10)
        expect(round.explanation).not.toContain('undefined')
      }
    }
  })

  it('draws a series of the right length, in the level’s kinds, without immediate repeats', () => {
    for (const level of Object.keys(KINDS_BY_LEVEL)) {
      for (let run = 0; run < RUNS / 10; run += 1) {
        const series = buildSeries({ level, rounds: 12 })
        expect(series).toHaveLength(12)
        series.forEach((round, index) => {
          expect(KINDS_BY_LEVEL[level]).toContain(round.kind)
          if (index > 0) expect(round.prompt).not.toBe(series[index - 1].prompt)
        })
      }
    }
  })
})
