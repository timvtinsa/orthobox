/**
 * Game manifest contract.
 *
 * The registry discovers games at build time: nothing re-reads their manifest
 * before runtime. These checks act as the guard rail, so that a game added
 * later breaks neither the gallery, nor the settings screen, nor session mode.
 */
import { describe, expect, it } from 'vitest'
import { GAMES, getGame, getGamesByCategory, searchGames } from '../src/games/registry.js'
import { CATEGORY_IDS } from '../src/lib/categories.js'

describe('game registry', () => {
  it('discovers the games present in src/games', () => {
    expect(GAMES.length).toBeGreaterThanOrEqual(20)
  })

  it('gives every game a unique id', () => {
    const ids = GAMES.map((game) => game.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('looks a game up by id', () => {
    expect(getGame(GAMES[0].id)).toBe(GAMES[0])
    expect(getGame('no-such-game')).toBeNull()
  })

  it('files every game under a known domain', () => {
    for (const game of GAMES) {
      expect(CATEGORY_IDS).toContain(game.category)
    }
    const total = CATEGORY_IDS.reduce(
      (sum, domain) => sum + getGamesByCategory(domain).length,
      0,
    )
    expect(total).toBe(GAMES.length)
  })

  it('fills in every field the gallery displays', () => {
    for (const game of GAMES) {
      expect(game.title, game.id).toBeTruthy()
      expect(game.tagline, game.id).toBeTruthy()
      expect(game.cover, game.id).toBeTruthy()
      expect(game.ages, game.id).toBeTruthy()
      expect(game.objectives.length, game.id).toBeGreaterThan(0)
      expect(game.instructions, game.id).toBeTruthy()
    }
  })

  it('advertises no duration, since it depends on the patient', () => {
    for (const game of GAMES) {
      expect(game.duration, game.id).toBeUndefined()
    }
  })

  it('uses no em dash in patient-facing text', () => {
    for (const game of GAMES) {
      const texts = [game.title, game.tagline, game.instructions, ...game.objectives, ...game.materials]
      expect(texts.join(' '), game.id).not.toContain('—')
    }
  })
})

describe('declared settings', () => {
  it('describes fields the settings screen can render', () => {
    for (const game of GAMES) {
      for (const field of game.settings) {
        expect(field.id, `${game.id}/${field.label}`).toBeTruthy()
        expect(field.label, `${game.id}/${field.id}`).toBeTruthy()
        expect(['choice', 'number'], `${game.id}/${field.id}`).toContain(field.type)
        expect(field.default, `${game.id}/${field.id}`).toBeDefined()
      }
    }
  })

  it('keeps a numeric default within bounds and on the declared step', () => {
    for (const game of GAMES) {
      for (const field of game.settings.filter((item) => item.type === 'number')) {
        const where = `${game.id}/${field.id}`
        expect(field.min, where).toBeLessThanOrEqual(field.default)
        expect(field.max, where).toBeGreaterThanOrEqual(field.default)
        expect((field.default - field.min) % (field.step ?? 1), where).toBe(0)
      }
    }
  })

  it('offers at least two options for a choice, including the default', () => {
    for (const game of GAMES) {
      for (const field of game.settings.filter((item) => item.type === 'choice')) {
        const where = `${game.id}/${field.id}`
        expect(field.options.length, where).toBeGreaterThanOrEqual(2)
        expect(field.options.map((option) => option.id), where).toContain(field.default)
      }
    }
  })

  it('never reuses a setting id within a game', () => {
    for (const game of GAMES) {
      const ids = game.settings.map((field) => field.id)
      expect(new Set(ids).size, game.id).toBe(ids.length)
    }
  })
})

describe('search', () => {
  it('ignores case and accents', () => {
    const results = searchGames(GAMES, 'MEMOIRE')
    expect(results.length).toBeGreaterThan(0)
    expect(searchGames(GAMES, 'mémoire').length).toBe(results.length)
  })

  it('returns everything for an empty query', () => {
    expect(searchGames(GAMES, '   ').length).toBe(GAMES.length)
  })

  it('returns nothing for an absent term', () => {
    expect(searchGames(GAMES, 'zzzzz')).toHaveLength(0)
  })
})
