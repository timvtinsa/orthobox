import { describe, expect, it } from 'vitest'
import { GAMES, getGame } from '../src/games/registry.js'
import { defaultConfig } from '../src/components/GameSetup.jsx'
import { LOWER_UNTIL, MIN_ATTEMPTS, RAISE_FROM, progressionSteps, suggestProgression } from '../src/lib/progression.js'

const withProgression = GAMES.filter((game) => game.progression)

describe('progression manifests', () => {
  it('is declared by several games', () => {
    expect(withProgression.length).toBeGreaterThanOrEqual(8)
  })

  it('points every declaration at a choice or number setting of the game', () => {
    for (const game of withProgression) {
      const field = game.settings.find((setting) => setting.id === game.progression.setting)
      expect(field, game.id).toBeDefined()
      expect(['choice', 'number'], game.id).toContain(field.type)
      expect(progressionSteps(game).length, game.id).toBeGreaterThanOrEqual(2)
    }
  })

  it('starts every game from a default that is one of its steps', () => {
    for (const game of withProgression) {
      const values = progressionSteps(game).map((step) => step.value)
      expect(values, game.id).toContain(defaultConfig(game.settings)[game.progression.setting])
    }
  })
})

describe('suggestProgression', () => {
  const days = getGame('week-days')
  const easy = { ...defaultConfig(days.settings), level: 'easy' }
  const medium = { ...easy, level: 'medium' }
  const hard = { ...easy, level: 'hard' }

  it('proposes the next level after a very good series, keeping the other settings', () => {
    const suggestion = suggestProgression(days, medium, { correct: 9, attempts: 10 })
    expect(suggestion).toMatchObject({ direction: 'up', label: 'Difficile' })
    expect(suggestion.config).toEqual({ ...medium, level: 'hard' })
  })

  it('proposes the previous level after a poor series', () => {
    const suggestion = suggestProgression(days, medium, { correct: 3, attempts: 10 })
    expect(suggestion).toMatchObject({ direction: 'down', label: 'Facile' })
    expect(suggestion.config.level).toBe('easy')
  })

  it('proposes nothing in between', () => {
    expect(suggestProgression(days, medium, { correct: 6, attempts: 10 })).toBeNull()
  })

  it('draws the lines at the documented rates', () => {
    const at = (rate) => suggestProgression(days, medium, { correct: rate * 100, attempts: 100 })
    expect(at(RAISE_FROM)?.direction).toBe('up')
    expect(at(RAISE_FROM - 0.01)).toBeNull()
    expect(at(LOWER_UNTIL)?.direction).toBe('down')
    expect(at(LOWER_UNTIL + 0.01)).toBeNull()
  })

  it('proposes nothing at the ends of the scale', () => {
    expect(suggestProgression(days, hard, { correct: 10, attempts: 10 })).toBeNull()
    expect(suggestProgression(days, easy, { correct: 0, attempts: 10 })).toBeNull()
  })

  it('says nothing about a series too short to judge', () => {
    expect(suggestProgression(days, medium, { correct: MIN_ATTEMPTS - 1, attempts: MIN_ATTEMPTS - 1 })).toBeNull()
  })

  it('moves a number setting by one step, up as it grows', () => {
    const digits = getGame('digit-span')
    const config = { ...defaultConfig(digits.settings), length: 5 }
    expect(suggestProgression(digits, config, { correct: 10, attempts: 10 }).config.length).toBe(6)
    expect(suggestProgression(digits, config, { correct: 1, attempts: 10 }).config.length).toBe(4)
    const top = { ...config, length: 10 }
    expect(suggestProgression(digits, top, { correct: 10, attempts: 10 })).toBeNull()
  })

  it('ignores a game without progression, and a config it does not recognise', () => {
    const plain = GAMES.find((game) => !game.progression)
    expect(suggestProgression(plain, {}, { correct: 10, attempts: 10 })).toBeNull()
    expect(suggestProgression(days, { level: 'nonsense' }, { correct: 10, attempts: 10 })).toBeNull()
  })
})
