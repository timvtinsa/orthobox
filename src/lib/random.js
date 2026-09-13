/** Petites aides de tirage aléatoire, partagées par tous les jeux. */

export function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function pick(items) {
  return items[Math.floor(Math.random() * items.length)]
}

/** Mélange (Fisher-Yates) sans muter le tableau source. */
export function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** n éléments distincts tirés au hasard (au plus items.length). */
export function sample(items, n) {
  return shuffle(items).slice(0, Math.min(n, items.length))
}

/**
 * Comme `sample`, mais en évitant autant que possible les éléments déjà vus.
 * Utile pour ne pas reproposer le même item deux manches de suite.
 */
export function sampleAvoiding(items, n, avoid = []) {
  const avoidSet = new Set(avoid)
  const fresh = items.filter((item) => !avoidSet.has(item))
  const pool = fresh.length >= n ? fresh : items
  return sample(pool, n)
}
