/**
 * The guarantees « Les jours de la semaine » needs: whatever the question,
 * the right day is offered exactly once, it really is the day the question
 * asks for (recomputed here from the prompt, not trusted from the code), and
 * the week wraps around: after Sunday comes Monday.
 */
import { describe, expect, it } from 'vitest'
import { DAYS, KINDS_BY_LEVEL, buildRound, buildSeries, wrap } from '../src/games/week-days/logic.js'

const RUNS = 300
const KINDS = [...new Set(Object.values(KINDS_BY_LEVEL).flat())]

/** The day a prompt asks for, rebuilt from its wording alone. */
function expectedAnswer(round) {
  const named = DAYS.filter((day) => round.prompt.includes(day))
  const first = DAYS.indexOf(named.sort((a, b) => round.prompt.indexOf(a) - round.prompt.indexOf(b))[0])
  const gap = Number(round.prompt.match(/(?:dans|il y a) (\d) jours/)?.[1])
  switch (round.kind) {
    case 'tomorrow':
      return DAYS[wrap(first + 1)]
    case 'yesterday':
      return DAYS[wrap(first - 1)]
    case 'afterTomorrow':
      return DAYS[wrap(first + 2)]
    case 'beforeYesterday':
      return DAYS[wrap(first - 2)]
    case 'between':
      return DAYS[wrap(first + 1)]
    case 'later':
      return DAYS[wrap(first + gap)]
    case 'earlier':
      return DAYS[wrap(first - gap)]
    default:
      return null
  }
}

describe('week days', () => {
  it('wraps around the week in both directions', () => {
    expect(wrap(7)).toBe(0)
    expect(wrap(-1)).toBe(6)
    expect(wrap(-8)).toBe(6)
    expect(DAYS[wrap(DAYS.indexOf('dimanche') + 1)]).toBe('lundi')
    expect(DAYS[wrap(DAYS.indexOf('lundi') - 1)]).toBe('dimanche')
  })

  it('offers the right day exactly once, among four distinct days', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const kind of KINDS) {
        const round = buildRound(kind)
        expect(round.options, kind).toHaveLength(4)
        expect(new Set(round.options).size, kind).toBe(4)
        expect(round.options.filter((day) => day === round.answer), kind).toHaveLength(1)
        expect(round.options.every((day) => DAYS.includes(day)), kind).toBe(true)
      }
    }
  })

  it('asks for the day its own prompt describes', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const kind of KINDS.filter((k) => k !== 'position')) {
        const round = buildRound(kind)
        expect(round.answer, round.prompt).toBe(expectedAnswer(round))
      }
    }
  })

  it('counts the rank of a day from Monday', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const round = buildRound('position')
      const rank = ['premier', 'deuxième', 'troisième', 'quatrième', 'cinquième', 'sixième', 'septième'].findIndex(
        (word) => round.prompt.includes(`le ${word} jour`),
      )
      expect(round.answer).toBe(DAYS[rank])
    }
  })

  it('explains a miss with the right answer in it', () => {
    for (const kind of KINDS) {
      const round = buildRound(kind)
      expect(round.explanation).toContain(round.answer)
    }
  })

  it('draws every level for the requested number of rounds, never repeating a question twice in a row', () => {
    for (const level of Object.keys(KINDS_BY_LEVEL)) {
      for (let run = 0; run < 50; run += 1) {
        const series = buildSeries({ level, rounds: 20 })
        expect(series).toHaveLength(20)
        for (let i = 1; i < series.length; i += 1) {
          expect(series[i].prompt, level).not.toBe(series[i - 1].prompt)
        }
        for (const round of series) expect(KINDS_BY_LEVEL[level]).toContain(round.kind)
      }
    }
  })
})
