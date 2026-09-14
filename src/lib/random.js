/** Small random helpers shared by every game. */

export function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function pick(items) {
  return items[Math.floor(Math.random() * items.length)]
}

/** Fisher-Yates shuffle, without mutating the source array. */
export function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** n distinct items drawn at random (at most items.length). */
export function sample(items, n) {
  return shuffle(items).slice(0, Math.min(n, items.length))
}

/**
 * Like `sample`, but avoids already seen items when possible, so the same
 * material is not proposed twice in a row.
 */
export function sampleAvoiding(items, n, avoid = []) {
  const avoidSet = new Set(avoid)
  const fresh = items.filter((item) => !avoidSet.has(item))
  const pool = fresh.length >= n ? fresh : items
  return sample(pool, n)
}
