import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { installStorage, removeStorage } from './fake-storage.js'
import {
  MAX_NAME_LENGTH,
  MAX_SAVED,
  cleanName,
  deleteSession,
  exportSessions,
  importSessions,
  missingGames,
  openSession,
  readSavedSessions,
  renameSession,
  saveSession,
} from '../src/lib/saved-sessions.js'
import { GAMES } from '../src/games/registry.js'

const plan = (...ids) => ids.map((gameId) => ({ id: `x-${gameId}`, gameId, config: {} }))
const [A, B, C] = GAMES.map((game) => game.id)

describe('saved sessions', () => {
  let storage
  beforeEach(() => {
    storage = installStorage()
  })
  afterEach(removeStorage)

  it('starts empty and keeps what is saved, newest first', () => {
    expect(readSavedSessions()).toEqual([])
    saveSession('Première', plan(A))
    saveSession('Seconde', plan(B, C))
    const list = readSavedSessions()
    expect(list.map((entry) => entry.name).sort()).toEqual(['Première', 'Seconde'])
    expect(list[0].savedAt).toBeGreaterThanOrEqual(list[1].savedAt)
    expect(list.find((entry) => entry.name === 'Seconde').steps.map((step) => step.gameId)).toEqual([B, C])
  })

  it('stores only games and settings: no step ids, no extra field', () => {
    saveSession('Épurée', [{ id: 'x', gameId: A, config: {}, secret: 'patient' }])
    const raw = JSON.parse(storage.getItem('orthobox:saved-sessions'))
    expect(Object.keys(raw[0].steps[0]).sort()).toEqual(['config', 'gameId'])
  })

  it('refuses an empty name, an empty plan and unknown games', () => {
    expect(saveSession('   ', plan(A))).toMatchObject({ ok: false, reason: 'name' })
    expect(saveSession('Vide', [])).toMatchObject({ ok: false, reason: 'empty' })
    expect(saveSession('Fantôme', plan('no-such-game'))).toMatchObject({ ok: false, reason: 'empty' })
    expect(readSavedSessions()).toEqual([])
  })

  it('tidies and caps the name', () => {
    expect(cleanName('  Séance   du\n lundi ')).toBe('Séance du lundi')
    expect(cleanName('x'.repeat(200))).toHaveLength(MAX_NAME_LENGTH)
    expect(cleanName(null)).toBe('')
  })

  it('overwrites an entry when given its id, keeping a single copy', () => {
    const first = saveSession('Séance', plan(A))
    const again = saveSession('Séance', plan(A, B), first.entry.id)
    expect(again.entry.id).toBe(first.entry.id)
    expect(readSavedSessions()).toHaveLength(1)
    expect(readSavedSessions()[0].steps).toHaveLength(2)
  })

  it('renames and deletes', () => {
    const { entry } = saveSession('Ancien nom', plan(A))
    expect(renameSession(entry.id, 'Nouveau nom').ok).toBe(true)
    expect(readSavedSessions()[0].name).toBe('Nouveau nom')
    expect(renameSession(entry.id, '  ')).toMatchObject({ ok: false, reason: 'name' })
    expect(renameSession('missing', 'x')).toMatchObject({ ok: false, reason: 'missing' })
    expect(deleteSession(entry.id)).toEqual([])
    expect(readSavedSessions()).toEqual([])
  })

  it('stops at the maximum number of sessions', () => {
    for (let i = 0; i < MAX_SAVED; i += 1) expect(saveSession(`S${i}`, plan(A)).ok).toBe(true)
    expect(saveSession('Une de trop', plan(A))).toMatchObject({ ok: false, reason: 'full' })
  })

  it('reports a browser that refuses to store', () => {
    removeStorage()
    installStorage({ failing: true })
    expect(saveSession('Refusée', plan(A))).toMatchObject({ ok: false, reason: 'storage' })
  })

  it('opens a session as a fresh plan with new step ids and valid settings', () => {
    const { entry } = saveSession('À rouvrir', plan(A, A))
    const opened = openSession(entry)
    expect(opened.map((step) => step.gameId)).toEqual([A, A])
    expect(new Set(opened.map((step) => step.id)).size).toBe(2)
    expect(opened[0].config).toBeTypeOf('object')
  })

  it('repairs settings that a game no longer accepts', () => {
    const entry = { id: 'e', name: 'Vieille', savedAt: 1, steps: [{ gameId: A, config: { nope: 1, rounds: 'x'.repeat(5) } }] }
    const [step] = openSession(entry)
    expect(step.config).not.toHaveProperty('nope')
  })

  it('keeps a vanished game in storage but leaves it out when opening', () => {
    storage.setItem('orthobox:saved-sessions', JSON.stringify([
      { id: 'e', name: 'Mixte', savedAt: 5, steps: [{ gameId: 'gone', config: {} }, { gameId: A, config: {} }] },
    ]))
    const [entry] = readSavedSessions()
    expect(entry.steps).toHaveLength(2)
    expect(missingGames(entry)).toBe(1)
    expect(openSession(entry).map((step) => step.gameId)).toEqual([A])
  })

  it('survives corrupted storage and discards malformed entries', () => {
    storage.setItem('orthobox:saved-sessions', '{not json')
    expect(readSavedSessions()).toEqual([])
    storage.setItem('orthobox:saved-sessions', JSON.stringify([
      null, 'x', { id: 'a' }, { id: 'b', name: '', steps: [{ gameId: A }] },
      { id: 'c', name: 'Sans jeux', steps: [] }, { id: 'd', name: 'Bonne', savedAt: 1, steps: [{ gameId: A }] },
      { id: 'd', name: 'Doublon', savedAt: 2, steps: [{ gameId: A }] },
    ]))
    expect(readSavedSessions().map((entry) => entry.name)).toEqual(['Bonne'])
  })
})

describe('backup file', () => {
  beforeEach(() => installStorage())
  afterEach(removeStorage)

  it('exports then imports into an empty list', () => {
    saveSession('Séance 1', plan(A))
    saveSession('Séance 2', plan(B))
    const file = exportSessions()
    removeStorage()
    installStorage()
    const result = importSessions(file)
    expect(result).toMatchObject({ ok: true, added: 2, skipped: 0 })
    expect(readSavedSessions().map((entry) => entry.name).sort()).toEqual(['Séance 1', 'Séance 2'])
  })

  it('skips what is already there and renames a clashing name instead of losing it', () => {
    saveSession('Séance', plan(A))
    const same = exportSessions()
    expect(importSessions(same)).toMatchObject({ ok: true, added: 0, skipped: 1 })

    const other = JSON.stringify({
      format: 'orthobox-sessions', version: 1,
      sessions: [{ id: 'z', name: 'Séance', savedAt: 9, steps: [{ gameId: B, config: {} }] }],
    })
    expect(importSessions(other)).toMatchObject({ ok: true, added: 1 })
    expect(readSavedSessions().map((entry) => entry.name).sort()).toEqual(['Séance', 'Séance (2)'])
  })

  it('rejects anything that is not a backup, and writes nothing', () => {
    expect(importSessions('not json')).toMatchObject({ ok: false, reason: 'format' })
    expect(importSessions('{"format":"other","sessions":[]}')).toMatchObject({ ok: false, reason: 'format' })
    expect(importSessions('[]')).toMatchObject({ ok: false, reason: 'format' })
    expect(readSavedSessions()).toEqual([])
  })

  it('ignores malformed sessions inside an otherwise valid file', () => {
    const file = JSON.stringify({
      format: 'orthobox-sessions', version: 1,
      sessions: [null, 3, { name: 'Sans jeux', steps: [] }, { name: 'Bonne', steps: [{ gameId: A }] }],
    })
    expect(importSessions(file)).toMatchObject({ ok: true, added: 1, skipped: 3 })
  })
})
