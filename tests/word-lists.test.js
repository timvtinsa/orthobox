import { describe, expect, it } from 'vitest'
import {
  MAX_LISTS,
  MAX_WORDS,
  MAX_WORD_LENGTH,
  activeList,
  addList,
  parseWords,
  removeList,
  sanitise,
  setActive,
  updateList,
} from '../src/lib/word-lists.js'

const EMPTY = { lists: [], activeId: null }

describe('parseWords', () => {
  it('splits on lines, commas and semicolons', () => {
    expect(parseWords('chat\nchien, souris ; lapin')).toEqual(['chat', 'chien', 'souris', 'lapin'])
  })

  it('trims, collapses spaces and drops empty pieces', () => {
    expect(parseWords('  un   deux  \n\n , ,  trois ')).toEqual(['un deux', 'trois'])
  })

  it('drops doubles whatever their case, keeping the first spelling', () => {
    expect(parseWords('Chat\nchat\nCHAT\nchien')).toEqual(['Chat', 'chien'])
  })

  it('bounds the number of words and their length', () => {
    const many = Array.from({ length: MAX_WORDS + 20 }, (_, index) => `mot${index}`).join('\n')
    expect(parseWords(many)).toHaveLength(MAX_WORDS)
    expect(parseWords('x'.repeat(MAX_WORD_LENGTH + 30))[0]).toHaveLength(MAX_WORD_LENGTH)
  })

  it('copes with nothing', () => {
    expect(parseWords('')).toEqual([])
    expect(parseWords(undefined)).toEqual([])
  })
})

describe('word list state', () => {
  it('adds a list and makes it the active one', () => {
    const state = addList(EMPTY, '  Les mots de Léo ', 'chat\nchien')
    expect(state.lists).toHaveLength(1)
    expect(state.lists[0]).toMatchObject({ name: 'Les mots de Léo', words: ['chat', 'chien'] })
    expect(activeList(state).id).toBe(state.activeId)
  })

  it('names an unnamed list', () => {
    expect(addList(EMPTY, '  ', 'a').lists[0].name).toBe('Liste sans nom')
  })

  it('refuses a list beyond the limit', () => {
    let state = EMPTY
    for (let index = 0; index < MAX_LISTS + 3; index += 1) state = addList(state, `L${index}`, 'a')
    expect(state.lists).toHaveLength(MAX_LISTS)
  })

  it('edits a list in place, keeping its name when the new one is empty', () => {
    const state = addList(EMPTY, 'Animaux', 'chat')
    const edited = updateList(state, state.activeId, '', 'chat\nchien\nchat')
    expect(edited.lists[0]).toMatchObject({ name: 'Animaux', words: ['chat', 'chien'] })
  })

  it('switches the active list, and ignores one that does not exist', () => {
    let state = addList(EMPTY, 'A', 'a')
    const first = state.activeId
    state = addList(state, 'B', 'b')
    expect(state.activeId).not.toBe(first)
    expect(setActive(state, first).activeId).toBe(first)
    expect(setActive(state, 'nope').activeId).toBe(state.activeId)
  })

  it('moves the active list to another when the active one is removed', () => {
    let state = addList(EMPTY, 'A', 'a')
    const first = state.activeId
    state = addList(state, 'B', 'b')
    const removed = removeList(state, state.activeId)
    expect(removed.lists.map((list) => list.id)).toEqual([first])
    expect(removed.activeId).toBe(first)
    expect(removeList(removed, first)).toEqual({ lists: [], activeId: null })
  })
})

describe('sanitise', () => {
  it('survives anything storage may hold', () => {
    expect(sanitise(null)).toEqual(EMPTY)
    expect(sanitise('nonsense')).toEqual(EMPTY)
    expect(sanitise({ lists: 'x' })).toEqual(EMPTY)
  })

  it('drops malformed lists, cleans the words and repairs the active id', () => {
    const state = sanitise({
      lists: [{ id: 'a', name: ' A ', words: ['x', 'X', 3, ' y '] }, { id: 5 }, null, { id: 'b', words: 'no' }],
      activeId: 'gone',
    })
    expect(state.lists).toEqual([{ id: 'a', name: 'A', words: ['x', 'y'] }])
    expect(state.activeId).toBe('a')
  })
})
