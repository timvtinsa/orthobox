/**
 * Saved sessions: named session plans kept in the browser, so a practitioner
 * can prepare « Séance langage écrit, CE1 » once and reopen it at every
 * appointment, next to the single plan being worked on (`session-plan.js`).
 *
 * Only the list of games and their settings is stored: never a result, never
 * a patient name. Everything stays in localStorage, on this device — which
 * also means it is lost with the browser data, hence the export/import pair.
 *
 * Whatever comes out of storage (or out of an imported file) is untrusted: a
 * hand-edited, truncated or older entry is repaired or skipped, never handed
 * to the builder as is.
 */
import { defaultConfig } from '../components/GameSetup.jsx'
import { getGame } from '../games/registry.js'
import { readJson, writeJson } from './storage.js'
import { sanitizeConfig } from './share-settings.js'
import { createStep } from './session-plan.js'

const KEY = 'saved-sessions'

export const MAX_SAVED = 50
export const MAX_NAME_LENGTH = 60
export const MAX_STEPS = 40

/** A name made of whitespace only, or nothing, is not a name. */
export function cleanName(name) {
  return String(name ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME_LENGTH)
}

/** Keeps the steps whose game still exists, with settings checked against it. */
function cleanSteps(raw) {
  if (!Array.isArray(raw)) return []
  const steps = []
  for (const entry of raw.slice(0, MAX_STEPS)) {
    if (!entry || typeof entry.gameId !== 'string' || !getGame(entry.gameId)) continue
    const game = getGame(entry.gameId)
    const config = entry.config && typeof entry.config === 'object' && !Array.isArray(entry.config)
      ? sanitizeConfig(game.settings, entry.config)
      : null
    steps.push({ gameId: entry.gameId, config: config ?? defaultConfig(game.settings) })
  }
  return steps
}

/**
 * Keeps the games of a saved session that no longer exist in the catalogue:
 * they are only dropped when the session is opened, not when the list is read,
 * so a game temporarily missing does not erase a practitioner's preparation.
 */
function cleanEntry(raw) {
  if (!raw || typeof raw !== 'object') return null
  const name = cleanName(raw.name)
  if (!name || typeof raw.id !== 'string' || !raw.id) return null
  if (!Array.isArray(raw.steps)) return null
  const steps = raw.steps
    .slice(0, MAX_STEPS)
    .filter((step) => step && typeof step.gameId === 'string')
    .map((step) => ({
      gameId: step.gameId,
      config: step.config && typeof step.config === 'object' && !Array.isArray(step.config) ? step.config : {},
    }))
  if (steps.length === 0) return null
  const savedAt = Number.isFinite(raw.savedAt) ? raw.savedAt : 0
  return { id: raw.id, name, savedAt, steps }
}

/** Every saved session, most recently saved first. */
export function readSavedSessions() {
  const data = readJson(KEY, [])
  if (!Array.isArray(data)) return []
  const seen = new Set()
  return data
    .map(cleanEntry)
    .filter((entry) => {
      if (!entry || seen.has(entry.id)) return false
      seen.add(entry.id)
      return true
    })
    .sort((a, b) => b.savedAt - a.savedAt)
    .slice(0, MAX_SAVED)
}

function persist(list) {
  return writeJson(KEY, list)
}

let counter = 0
function newId() {
  counter += 1
  return `s-${Date.now().toString(36)}-${counter}`
}

/** Plan steps reduced to what is worth keeping: the game and its settings. */
function planOf(steps) {
  return steps.map((step) => ({ gameId: step.gameId, config: step.config ?? {} }))
}

/**
 * Saves a plan under a name. With an `id`, that entry is overwritten (keeping
 * its id); otherwise a new entry is added. Returns `{ ok, entry, list }`, or
 * `{ ok: false, reason }` when the name or the plan is unusable, the list is
 * full, or the browser refuses to store it.
 */
export function saveSession(name, steps, id = null) {
  const cleaned = cleanName(name)
  if (!cleaned) return { ok: false, reason: 'name' }
  const plan = planOf(cleanSteps(steps))
  if (plan.length === 0) return { ok: false, reason: 'empty' }

  const list = readSavedSessions()
  const existing = id ? list.find((entry) => entry.id === id) : null
  if (!existing && list.length >= MAX_SAVED) return { ok: false, reason: 'full' }

  const entry = { id: existing ? existing.id : newId(), name: cleaned, savedAt: Date.now(), steps: plan }
  const next = [entry, ...list.filter((item) => item.id !== entry.id)]
  if (!persist(next)) return { ok: false, reason: 'storage' }
  return { ok: true, entry, list: next }
}

export function renameSession(id, name) {
  const cleaned = cleanName(name)
  if (!cleaned) return { ok: false, reason: 'name' }
  const list = readSavedSessions()
  if (!list.some((entry) => entry.id === id)) return { ok: false, reason: 'missing' }
  const next = list.map((entry) => (entry.id === id ? { ...entry, name: cleaned } : entry))
  return persist(next) ? { ok: true, list: next } : { ok: false, reason: 'storage' }
}

export function deleteSession(id) {
  const next = readSavedSessions().filter((entry) => entry.id !== id)
  persist(next)
  return next
}

/**
 * The editable plan a saved session turns into: fresh step ids, settings
 * validated against the games as they are today, vanished games left out.
 */
export function openSession(entry) {
  return cleanSteps(entry.steps).map((step) => createStep(step.gameId, step.config))
}

/** How many of a saved session's games the catalogue no longer has. */
export function missingGames(entry) {
  return entry.steps.filter((step) => !getGame(step.gameId)).length
}

/* ---- Backup file ------------------------------------------------------ */

const FILE_FORMAT = 'orthobox-sessions'

/** The JSON text of a backup file holding the given sessions. */
export function exportSessions(list = readSavedSessions()) {
  return JSON.stringify({ format: FILE_FORMAT, version: 1, sessions: list }, null, 2)
}

/**
 * Merges the sessions of a backup file into the saved list. Sessions already
 * present (same name and same games and settings) are skipped; a name already
 * taken by a different session gets a « (2) » suffix so nothing is lost.
 * Returns `{ ok, added, skipped }`, or `{ ok: false, reason }`.
 */
export function importSessions(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, reason: 'format' }
  }
  if (!data || data.format !== FILE_FORMAT || !Array.isArray(data.sessions)) {
    return { ok: false, reason: 'format' }
  }

  const list = readSavedSessions()
  const signature = (entry) => JSON.stringify([entry.name, entry.steps])
  const known = new Set(list.map(signature))
  const names = new Set(list.map((entry) => entry.name))
  let added = 0
  let skipped = 0
  const merged = [...list]

  for (const raw of data.sessions) {
    const entry = cleanEntry({ ...raw, id: newId() })
    if (!entry || known.has(signature(entry))) {
      skipped += 1
      continue
    }
    if (merged.length >= MAX_SAVED) {
      skipped += 1
      continue
    }
    let name = entry.name
    for (let n = 2; names.has(name); n += 1) {
      const suffix = ` (${n})`
      name = `${entry.name.slice(0, MAX_NAME_LENGTH - suffix.length)}${suffix}`
    }
    names.add(name)
    entry.name = name
    known.add(signature(entry))
    merged.push(entry)
    added += 1
  }

  if (added > 0 && !persist(merged)) return { ok: false, reason: 'storage' }
  return { ok: true, added, skipped, list: readSavedSessions() }
}
