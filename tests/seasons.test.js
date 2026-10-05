/**
 * The guarantees « Les quatre saisons » needs: whatever the question, the
 * right season is offered exactly once, it really is the season the question
 * asks for (recomputed here from the picture, the clue or the month, not
 * trusted from the code), and every object belongs to one season only.
 */
import { describe, expect, it } from 'vitest'
import { OBJECT_SEASONS } from '../src/games/seasons/drawings.jsx'
import { CLUES, KINDS_BY_LEVEL, MONTHS, SEASONS, buildRound, buildSeries, seasonOfMonth } from '../src/games/seasons/logic.js'

const RUNS = 300
const KINDS = [...new Set(Object.values(KINDS_BY_LEVEL).flat())]

function expectedAnswer(round) {
  switch (round.kind) {
    case 'object':
      return OBJECT_SEASONS.findIndex((ids) => ids.includes(round.picture.id))
    case 'landscape':
      return round.picture.season
    case 'month': {
      const month = MONTHS.findIndex((name) => round.prompt.includes(`en ${name} `))
      return [2, 3, 4].includes(month) ? 0 : [5, 6, 7].includes(month) ? 1 : [8, 9, 10].includes(month) ? 2 : 3
    }
    default:
      return CLUES.findIndex((clues) => clues.some((clue) => round.prompt.includes(clue)))
  }
}

describe('seasons', () => {
  it('asks no before/after question', () => {
    expect(KINDS).toEqual(expect.arrayContaining(['object', 'landscape', 'clue', 'month']))
    expect(KINDS).toHaveLength(4)
  })

  it('places each month in its meteorological season', () => {
    expect(MONTHS.map((_, month) => SEASONS[seasonOfMonth(month)])).toEqual([
      'hiver', 'hiver', 'printemps', 'printemps', 'printemps', 'été',
      'été', 'été', 'automne', 'automne', 'automne', 'hiver',
    ])
  })

  it('gives every season several objects, none shared between seasons', () => {
    OBJECT_SEASONS.forEach((ids) => expect(ids.length).toBeGreaterThanOrEqual(3))
    const all = OBJECT_SEASONS.flat()
    expect(new Set(all).size).toBe(all.length)
  })

  it('offers each season once and the right one among them', () => {
    for (const kind of KINDS) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildRound(kind)
        expect([...round.options].sort()).toEqual([...SEASONS].sort())
        expect(round.answer).toBe(SEASONS[expectedAnswer(round)])
      }
    }
  })

  it('shows a picture for objects and landscapes only', () => {
    for (const kind of KINDS) {
      const round = buildRound(kind)
      expect(Boolean(round.picture)).toBe(kind === 'object' || kind === 'landscape')
    }
  })

  it('explains the answer', () => {
    for (const kind of KINDS) {
      for (let run = 0; run < RUNS; run += 1) {
        const round = buildRound(kind)
        expect(round.explanation).not.toContain('undefined')
        expect(round.explanation.length).toBeGreaterThan(10)
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
          if (index > 0) expect(round.prompt === series[index - 1].prompt && round.picture?.id === series[index - 1].picture?.id && round.picture?.season === series[index - 1].picture?.season).toBe(false)
        })
      }
    }
  })
})
