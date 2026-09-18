/**
 * Local persistence (localStorage). Everything stays on the practitioner's
 * machine: no data ever leaves the browser.
 *
 * Every access is guarded: private browsing, blocked storage or a full quota
 * must never break the application.
 */
const PREFIX = 'orthobox:'

export function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJson(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
