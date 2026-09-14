/**
 * Fake `window.localStorage` for tests.
 *
 * Modules that persist data read `window.localStorage`. Rather than running a
 * full DOM for a handful of reads and writes, tests install this double: it
 * is faster, and it keeps one dependency out of continuous integration.
 */
export function installStorage({ failing = false } = {}) {
  const entries = new Map()

  const storage = {
    getItem: (key) => (entries.has(key) ? entries.get(key) : null),
    setItem: (key, value) => {
      if (failing) throw new Error('quota exceeded')
      entries.set(key, String(value))
    },
    removeItem: (key) => entries.delete(key),
    clear: () => entries.clear(),
  }

  globalThis.window = { localStorage: storage }
  return storage
}

export function removeStorage() {
  delete globalThis.window
}
