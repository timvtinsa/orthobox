/**
 * Building the texts of « Les terminaisons »: reading the `{stem|ending|why}`
 * gaps of a text, drawing a series, and checking the endings picked.
 */
import { noRepeatSeries } from '../../lib/random.js'
import { TEXTS, TOPICS } from './data.js'

const GAP = /\{([^|}]*)\|([^|}]*)\|([^}]*)\}/g

/**
 * A text as an ordered list of parts: `{ type: 'text', value }` and
 * `{ type: 'gap', id, stem, answer, why }`.
 */
export function parseText(text) {
  const parts = []
  let last = 0
  let id = 0
  for (const match of text.matchAll(GAP)) {
    if (match.index > last) parts.push({ type: 'text', value: text.slice(last, match.index) })
    parts.push({ type: 'gap', id, stem: match[1], answer: match[2], why: match[3] })
    id += 1
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) })
  return parts
}

export function gapsOf(round) {
  return round.parts.filter((part) => part.type === 'gap')
}

/** The word as it is spelt once the right ending is on. */
export function correctWord(gap) {
  return `${gap.stem}${gap.answer}`
}

/** The text with every gap filled in, for reading aloud. */
export function completeText(round) {
  return round.parts.map((part) => (part.type === 'gap' ? correctWord(part) : part.value)).join('')
}

export function pool(topic) {
  return topic === 'mixed' || !TOPICS.includes(topic) ? TEXTS : TEXTS.filter((entry) => entry.topic === topic)
}

export function buildSeries(config) {
  return noRepeatSeries(pool(config.topic), config.rounds).map((entry) => ({
    topic: entry.topic,
    options: entry.options,
    parts: parseText(entry.text),
  }))
}

/** What each gap was filled with: `{ [gapId]: ending | undefined }`. */
export function isComplete(round, picks) {
  return gapsOf(round).every((gap) => picks[gap.id] !== undefined)
}

export function isRight(gap, picks) {
  return picks[gap.id] === gap.answer
}

/** How many gaps are right, among the gaps of the round. */
export function countRight(round, picks) {
  return gapsOf(round).filter((gap) => isRight(gap, picks)).length
}
