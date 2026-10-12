/**
 * Building rounds of « Mes mots »: the games played on the practitioner's own
 * list (see `src/lib/word-lists.js`).
 *
 * Two modes. In `read`, a word is shown and the patient reads it aloud; the
 * practitioner says whether it went well. In `listen`, a word is spoken and
 * the patient picks it, written, among words of the same list.
 */
import { noRepeatSeries, sample, shuffle } from '../../lib/random.js'

/** Fewest words a list needs for each mode: choosing needs something to choose between. */
export const MIN_WORDS = { read: 1, listen: 2 }

/** The most proposals a `listen` round offers (the answer included). */
export const MAX_OPTIONS = 4

export function canPlay(words, mode) {
  return words.length >= (MIN_WORDS[mode] ?? MIN_WORDS.read)
}

export function buildRound(word, words, mode) {
  if (mode !== 'listen') return { word }
  const others = sample(
    words.filter((other) => other.toLowerCase() !== word.toLowerCase()),
    MAX_OPTIONS - 1,
  )
  return { word, options: shuffle([word, ...others]) }
}

/** The whole series, drawn upfront: every word of the list comes up before
 * any comes back, and never twice in a row. */
export function buildSeries(words, config) {
  return noRepeatSeries(words, config.rounds).map((word) => buildRound(word, words, config.mode))
}
