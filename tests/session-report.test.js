import { describe, expect, it } from 'vitest'
import { reportDomains, reportRows, reportText, scoreLabel } from '../src/lib/session-report.js'

const steps = [
  { id: 'a', gameId: 'mental-math', config: { operation: 'addition', range: 'ten', rounds: 10 } },
  { id: 'b', gameId: 'week-days', config: { level: 'easy', support: 'strip', rounds: 10 } },
  { id: 'c', gameId: 'seasons', config: { level: 'easy', rounds: 10 } },
  { id: 'd', gameId: 'mental-math', config: { operation: 'mixed', range: 'twenty', rounds: 10 } },
  { id: 'e', gameId: 'no-such-game', config: {} },
]

const results = [
  { gameId: 'mental-math', correct: 7, attempts: 10, played: true, completed: true },
  { gameId: 'week-days', correct: 2, attempts: 5, played: true, completed: false },
  { gameId: 'seasons', correct: 0, attempts: 0, played: false },
  { gameId: 'mental-math', correct: 4, attempts: 4, played: true, completed: true },
  { gameId: 'no-such-game', correct: 0, attempts: 0, played: false },
]

describe('session report', () => {
  const rows = reportRows(steps, results)

  it('has one row per step, in order, with a state in words', () => {
    expect(rows.map((row) => row.state)).toEqual(['done', 'interrupted', 'unplayed', 'done', 'unplayed'])
    expect(rows.map((row) => row.rank)).toEqual([1, 2, 3, 4, 5])
    expect(rows[4].title).toBe('no-such-game')
    expect(rows[4].settings).toMatch(/retiré/)
  })

  it('writes the score, the interruption and the unplayed game differently', () => {
    expect(scoreLabel(rows[0])).toBe('7 / 10 (70 %)')
    expect(scoreLabel(rows[1])).toBe('interrompu (2 / 5)')
    expect(scoreLabel(rows[2])).toBe('non joué')
  })

  it('adds up the played games per domain, and leaves unplayed ones out', () => {
    const domains = reportDomains(rows)
    const math = domains.find((domain) => domain.category === 'math-cognition')
    expect(math).toMatchObject({ correct: 11, attempts: 14, rate: 79 })
    expect(domains.map((domain) => domain.category)).not.toContain('oral-language')
  })

  it('writes everything, note included, as plain text', () => {
    const text = reportText({
      rows,
      domains: reportDomains(rows),
      date: '8 octobre',
      patient: 'L.',
      note: '  Fatigue en fin de séance.  ',
    })
    expect(text).toContain('Séance du 8 octobre')
    expect(text).toContain('Patient : L.')
    expect(text).toContain('1. ')
    expect(text).not.toContain('À revoir')
    expect(text).toContain('Observations :\nFatigue en fin de séance.')
  })

  it('leaves the patient and the observations out when empty', () => {
    const text = reportText({ rows, domains: [], date: '8 octobre', patient: '', note: ' ' })
    expect(text).not.toContain('Patient')
    expect(text).not.toContain('Observations')
  })
})
