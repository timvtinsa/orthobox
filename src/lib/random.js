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

/**
 * `count` draws from `items`, going through a shuffled copy of the whole
 * pool before any item repeats, and never repeating the item a bag boundary
 * would otherwise hand back twice in a row. This is what a round series
 * needs when `count` can exceed the pool: nothing can prevent every item
 * from eventually reappearing, but nothing has to appear twice before the
 * rest have had their turn, and the seam between two passes never reads as
 * an immediate repeat.
 */
export function noRepeatSeries(items, count) {
  const series = []
  let bag = []
  let last = null
  while (series.length < count) {
    if (bag.length === 0) {
      bag = shuffle(items)
      if (items.length > 1 && bag[0] === last) {
        [bag[0], bag[1]] = [bag[1], bag[0]]
      }
    }
    last = bag.shift()
    series.push(last)
  }
  return series
}

/**
 * A source of rounds that remembers what it has just asked.
 *
 * `make()` builds one round at random. Two lists of keys say what must not
 * come back:
 *  - `recent(round)`: keys that must not repeat within the last `memory`
 *    rounds, typically the *result* (« 7 + 3 » then « 6 + 4 » is the same
 *    answer twice in a row);
 *  - `series(round)`: keys that should not repeat at all during the session,
 *    typically the question itself.
 *
 * A round that breaks neither is drawn again as many times as `attempts`
 * allows. When the pool is too small for that (a range of ten only holds so
 * many sums), the least repetitive round found is kept, recent repeats
 * counting far worse than session ones, so the session never stalls and
 * what is unavoidable is at least spread out.
 */
export function createDrawer(make, { recent = () => [], series = () => [], memory = 3, attempts = 60 } = {}) {
  let window = []
  let seen = new Set()

  const penalty = (round) => {
    const recentKeys = new Set(window.flat())
    return (
      recent(round).filter((key) => recentKeys.has(key)).length * 100 +
      series(round).filter((key) => seen.has(key)).length
    )
  }

  return {
    next() {
      let best = null
      let bestPenalty = Infinity
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        const round = make()
        const cost = penalty(round)
        if (cost < bestPenalty) {
          best = round
          bestPenalty = cost
          if (cost === 0) break
        }
      }
      window = [...window, recent(best)].slice(-memory)
      for (const key of series(best)) seen.add(key)
      return best
    },
    reset() {
      window = []
      seen = new Set()
    },
  }
}

/** `count` rounds from a drawer, for the games that draw their whole series upfront. */
export function drawSeries(drawer, count) {
  drawer.reset()
  return Array.from({ length: count }, () => drawer.next())
}
