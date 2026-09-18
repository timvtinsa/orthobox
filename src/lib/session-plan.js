/**
 * Session plan: an ordered list of games, each with its own settings.
 *
 * The plan being prepared is kept in the browser, so the practitioner finds
 * it again from one appointment to the next.
 */
import { formatValue } from '../components/Stepper.jsx'
import { readJson, writeJson } from './storage.js'

const KEY = 'session-plan'

export function readSessionPlan() {
  const data = readJson(KEY, [])
  return Array.isArray(data) ? data : []
}

export function writeSessionPlan(steps) {
  writeJson(KEY, steps)
}

let counter = 0

/** Step identifier: the same game may appear several times in a plan. */
export function createStep(gameId, config) {
  counter += 1
  return { id: `${gameId}-${Date.now()}-${counter}`, gameId, config }
}

/** Moves an item from one position to another, without mutating the list. */
export function moveItem(list, from, to) {
  if (from === to || from < 0 || to < 0) return list
  const copy = [...list]
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}

/** Success rate as a percentage, or null when the game was not played. */
export function successRate(result) {
  if (!result || result.attempts === 0) return null
  return Math.round((result.correct / result.attempts) * 100)
}

/**
 * Readable summary of a step's settings.
 *
 * Shown on the plan card and on the printed recap, where the settings have to
 * be legible as plain text: a score means nothing without the setup it was
 * obtained with.
 */
export function summariseConfig(game, config) {
  if (!game.settings.length) return 'Aucun réglage'
  // A plan saved by an earlier version may carry settings a game no longer
  // declares: those are left out rather than printed as « undefined ».
  const parts = game.settings
    .map((field) => {
      const value = config?.[field.id]
      if (value === undefined || value === null) return null
      if (field.type === 'choice') {
        return field.options.find((option) => option.id === value)?.label ?? null
      }
      return `${field.label.toLowerCase()} : ${formatValue(value, field.unit, field.suffix)}`
    })
    .filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : 'Réglages par défaut'
}
