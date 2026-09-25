/**
 * Correction state of one option on a board.
 *
 * The one thing that must never happen: the expected answer revealed after a
 * miss reading as if it had been chosen correctly.
 */
import { describe, expect, it } from 'vitest'
import { answerState, stateClass } from '../src/lib/answer-state.js'

describe('answerState', () => {
  it('is null before anything is picked', () => {
    expect(answerState('a', { picked: null, expected: 'a' })).toBeNull()
    expect(answerState('a', { picked: undefined, expected: 'a' })).toBeNull()
  })

  it('marks the picked option ok when it matches what was expected', () => {
    expect(answerState('a', { picked: 'a', expected: 'a' })).toBe('ok')
  })

  it('marks the picked option err when it does not match', () => {
    expect(answerState('b', { picked: 'b', expected: 'a' })).toBe('err')
  })

  it('marks the expected option as expected, once a wrong pick was made', () => {
    expect(answerState('a', { picked: 'b', expected: 'a' })).toBe('expected')
  })

  it('never marks the expected option ok just because it was not picked', () => {
    // A miss reveals what should have been chosen: that reveal must read as
    // "expected", never as if the patient had found it.
    const state = answerState('a', { picked: 'b', expected: 'a' })
    expect(state).not.toBe('ok')
  })

  it('is null for an option uninvolved in the answer', () => {
    expect(answerState('c', { picked: 'b', expected: 'a' })).toBeNull()
  })
})

describe('stateClass', () => {
  it('builds a modifier class for a state', () => {
    expect(stateClass('ok')).toBe(' is-state is-ok')
    expect(stateClass('err')).toBe(' is-state is-err')
  })

  it('is empty for no state', () => {
    expect(stateClass(null)).toBe('')
  })
})
