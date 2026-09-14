/**
 * Session plan: an ordered list of games, each with its own settings.
 *
 * The plan being prepared is kept in the browser, so the practitioner finds
 * it again from one appointment to the next.
 */
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
