/**
 * Turning a game's settings into a link, and reading them back.
 *
 * Only the settings travel: a game id and a handful of field values, nothing
 * about a patient, a result or a session. A value that fails to parse or
 * falls outside what the game itself allows is dropped silently and the
 * game's own default takes over — a stale or hand-edited link can never
 * hand the board something the settings screen would have refused.
 */

/** The query string a game's current settings turn into. */
export function settingsToParams(settings, config) {
  const params = new URLSearchParams()
  for (const field of settings) {
    const value = config[field.id]
    if (value !== undefined && value !== null) params.set(field.id, String(value))
  }
  return params
}

/**
 * The settings a plain object of raw values carries, checked field by field
 * against the game's own definition. `null` when none of them could be read,
 * so the caller can tell « no link » apart from « a link with every field at
 * its default ». Shared by every source of untrusted settings — a query
 * string, a QR-encoded session — so a value is validated the same way
 * regardless of where it travelled in from.
 */
export function sanitizeConfig(settings, raw) {
  const config = {}
  let found = false

  for (const field of settings) {
    if (raw == null || !(field.id in raw)) continue
    const value = raw[field.id]

    if (field.type === 'number') {
      const num = Number(value)
      if (!Number.isFinite(num)) continue
      const min = field.min ?? -Infinity
      const max = field.max ?? Infinity
      const stepped = Number.isInteger(field.step ?? 1) ? Math.round(num) : num
      config[field.id] = Math.min(max, Math.max(min, stepped))
      found = true
    } else if (field.options?.some((option) => option.id === value)) {
      config[field.id] = value
      found = true
    }
  }

  return found ? config : null
}

/**
 * The settings a query string carries, checked field by field against the
 * game's own definition. `null` when none of them could be read, so the
 * caller can tell « no link » apart from « a link with every field at its
 * default ».
 */
export function settingsFromParams(settings, params) {
  const raw = {}
  for (const field of settings) {
    const value = params.get(field.id)
    if (value !== null) raw[field.id] = value
  }
  return sanitizeConfig(settings, raw)
}

/** The absolute link that reopens a game with a given set of settings. */
export function shareLink(gameId, settings, config) {
  const params = settingsToParams(settings, config).toString()
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}#/games/${gameId}${params ? `?${params}` : ''}`
}
