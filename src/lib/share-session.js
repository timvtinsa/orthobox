/**
 * Turning a whole session plan into a link (and a QR code), and reading one
 * back — the session equivalent of `share-settings.js`.
 *
 * The full ordered list of games and their settings is packed into the `p`
 * query parameter as base64url-encoded JSON: compact enough for a scannable
 * QR code, and readable without a server, since the plan never leaves the
 * browser. Every step is re-validated against the game's own settings
 * definition on the way in — exactly as a single game's shared settings are —
 * so a hand-edited or stale link can never hand the board a value the
 * settings screen would have refused, and a game removed from the catalogue
 * since the link was made is simply skipped.
 */
import { getGame } from '../games/registry.js'
import { defaultConfig } from '../components/GameSetup.jsx'
import { sanitizeConfig } from './share-settings.js'
import { createStep } from './session-plan.js'

// A session shared by QR code is meant for a handful of exercises, not a
// whole afternoon's worth: capping the step count keeps the code scannable
// and stops a corrupted or hand-crafted link from building an absurd plan.
export const MAX_SHARED_STEPS = 20

function base64UrlEncode(text) {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(encoded) {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

/** The `p` parameter value a session plan turns into. */
export function encodeSessionSteps(steps) {
  const payload = steps.map((step) => [step.gameId, step.config ?? {}])
  return base64UrlEncode(JSON.stringify(payload))
}

/** The absolute link (and QR value) that reopens a whole session plan. */
export function sessionShareLink(steps) {
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}#/session/shared?p=${encodeSessionSteps(steps)}`
}

/**
 * The session steps a `p` parameter carries, or `null` when it is missing,
 * malformed, or names only games the catalogue no longer has.
 */
export function decodeSessionSteps(encoded) {
  if (!encoded) return null

  let payload
  try {
    payload = JSON.parse(base64UrlDecode(encoded))
  } catch {
    return null
  }
  if (!Array.isArray(payload)) return null

  const steps = []
  for (const entry of payload.slice(0, MAX_SHARED_STEPS)) {
    if (!Array.isArray(entry) || typeof entry[0] !== 'string') continue
    const [gameId, rawConfig] = entry
    const game = getGame(gameId)
    if (!game) continue

    const isPlainObject = rawConfig !== null && typeof rawConfig === 'object' && !Array.isArray(rawConfig)
    const config = (isPlainObject && sanitizeConfig(game.settings, rawConfig)) || defaultConfig(game.settings)
    steps.push(createStep(gameId, config))
  }

  return steps.length > 0 ? steps : null
}
