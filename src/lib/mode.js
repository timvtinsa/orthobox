/**
 * Display mode: `adult` or `child`.
 *
 * Adult mode is the plain default interface. Child mode adds an animated
 * companion reacting to answers, plus success animations. It changes neither
 * colours, nor layout, nor game content, so the same exercise stays
 * comparable across modes.
 *
 * The choice is kept in the browser, so the practitioner finds the mode used
 * during the previous appointment.
 */
import { readJson, writeJson } from './storage.js'

const KEY = 'mode'

export const MODES = [
  { id: 'adult', label: 'Adulte' },
  { id: 'child', label: 'Enfant' },
]

export function readMode() {
  const value = readJson(KEY, 'adult')
  return MODES.some((mode) => mode.id === value) ? value : 'adult'
}

export function writeMode(mode) {
  writeJson(KEY, mode)
}
