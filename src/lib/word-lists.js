/**
 * The practitioner's own word lists: the vocabulary of the moment (a
 * patient's words, a theme, a sound being worked on), typed once and used by
 * the games that play « Mes mots ».
 *
 * Kept in the browser like the session plan: nothing leaves it. One list at a
 * time is the *active* one, the one the games read.
 */
import { readJson, writeJson } from './storage.js'

const KEY = 'word-lists'

export const MAX_LISTS = 12
export const MAX_WORDS = 60
export const MAX_WORD_LENGTH = 40
export const MAX_NAME_LENGTH = 40

/**
 * Words from free text: one per line, or separated by commas or semicolons.
 * Trimmed, empty ones dropped, doubles dropped whatever their case, and the
 * list and each word kept within bounds.
 */
export function parseWords(text) {
  const seen = new Set()
  const words = []
  for (const piece of String(text ?? '').split(/[\n,;]+/)) {
    const word = piece.trim().replace(/\s+/g, ' ').slice(0, MAX_WORD_LENGTH)
    const key = word.toLowerCase()
    if (word === '' || seen.has(key)) continue
    seen.add(key)
    words.push(word)
    if (words.length === MAX_WORDS) break
  }
  return words
}

export function wordsToText(words) {
  return words.join('\n')
}

function cleanName(name) {
  return String(name ?? '').trim().replace(/\s+/g, ' ').slice(0, MAX_NAME_LENGTH)
}

/** What is read back from storage, whatever state it was left in. */
export function sanitise(data) {
  const lists = (Array.isArray(data?.lists) ? data.lists : [])
    .filter((list) => list && typeof list.id === 'string' && Array.isArray(list.words))
    .slice(0, MAX_LISTS)
    .map((list) => ({
      id: list.id,
      name: cleanName(list.name) || 'Liste sans nom',
      words: parseWords(list.words.filter((word) => typeof word === 'string').join('\n')),
    }))
  const activeId = lists.some((list) => list.id === data?.activeId) ? data.activeId : (lists[0]?.id ?? null)
  return { lists, activeId }
}

export function readWordLists() {
  return sanitise(readJson(KEY, null))
}

export function writeWordLists(state) {
  return writeJson(KEY, state)
}

let counter = 0

/** A state with one more list, which becomes the active one. */
export function addList(state, name, text) {
  if (state.lists.length >= MAX_LISTS) return state
  counter += 1
  const list = { id: `list-${Date.now()}-${counter}`, name: cleanName(name) || 'Liste sans nom', words: parseWords(text) }
  return { lists: [...state.lists, list], activeId: list.id }
}

export function updateList(state, id, name, text) {
  return {
    ...state,
    lists: state.lists.map((list) =>
      list.id === id ? { ...list, name: cleanName(name) || list.name, words: parseWords(text) } : list,
    ),
  }
}

export function removeList(state, id) {
  const lists = state.lists.filter((list) => list.id !== id)
  return { lists, activeId: state.activeId === id ? (lists[0]?.id ?? null) : state.activeId }
}

export function setActive(state, id) {
  return state.lists.some((list) => list.id === id) ? { ...state, activeId: id } : state
}

export function activeList(state) {
  return state.lists.find((list) => list.id === state.activeId) ?? null
}
