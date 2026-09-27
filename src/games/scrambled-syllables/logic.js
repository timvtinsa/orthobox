import { noRepeatSeries, shuffle } from '../../lib/random.js'
import { WORDS } from './data.js'

export function buildRoundFor(syllables) {
  // One identifier per tile: two identical syllables may coexist.
  const tiles = syllables.map((text, index) => ({ id: `${index}-${text}`, text }))
  let shuffled = shuffle(tiles)
  // Never hand over the word already in the right order — except at two
  // syllables, where forcing a swap would always produce the same single
  // possible arrangement, turning the answer into a fixed gesture (always
  // tap the second tile first) rather than an actual read of the word.
  if (syllables.length > 2 && shuffled.every((tile, index) => tile.id === tiles[index].id)) {
    shuffled = [...shuffled.slice(1), shuffled[0]]
  }
  return { word: syllables.join(''), tiles: shuffled, size: syllables.length }
}

/** The whole session's words, drawn upfront so the same word cannot come
 * back twice within a series while the bucket has enough to avoid it. */
export function buildSeries(config) {
  const pool = WORDS[config.syllables] ?? WORDS[2]
  return noRepeatSeries(pool, config.rounds).map(buildRoundFor)
}
