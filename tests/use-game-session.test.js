/**
 * The pure reducer behind `useGameSession`: the score, streak and per-answer
 * history a board bar and the child-mode companion read from.
 */
import { describe, expect, it } from 'vitest'
import { nextSessionState } from '../src/hooks/useGameSession.js'

const EMPTY = {
  correct: 0,
  attempts: 0,
  streak: 0,
  bestStreak: 0,
  lastAnswer: null,
  answerCount: 0,
  results: [],
  index: 0,
  total: null,
}

describe('nextSessionState', () => {
  it('counts a correct answer', () => {
    const state = nextSessionState(EMPTY, true)
    expect(state.correct).toBe(1)
    expect(state.attempts).toBe(1)
    expect(state.streak).toBe(1)
    expect(state.bestStreak).toBe(1)
    expect(state.lastAnswer).toBe('correct')
    expect(state.results).toEqual(['ok'])
  })

  it('counts a wrong answer without touching the streak', () => {
    const state = nextSessionState(EMPTY, false)
    expect(state.correct).toBe(0)
    expect(state.attempts).toBe(1)
    expect(state.streak).toBe(0)
    expect(state.lastAnswer).toBe('wrong')
    expect(state.results).toEqual(['err'])
  })

  it('resets the streak on a miss, but keeps the best one reached so far', () => {
    let state = EMPTY
    state = nextSessionState(state, true)
    state = nextSessionState(state, true)
    expect(state.streak).toBe(2)
    expect(state.bestStreak).toBe(2)

    state = nextSessionState(state, false)
    expect(state.streak).toBe(0)
    expect(state.bestStreak).toBe(2)
  })

  it('appends to the results history in order', () => {
    let state = EMPTY
    state = nextSessionState(state, true)
    state = nextSessionState(state, false)
    state = nextSessionState(state, true)
    expect(state.results).toEqual(['ok', 'err', 'ok'])
  })

  it('bumps answerCount on every call, even for two correct answers in a row', () => {
    let state = EMPTY
    state = nextSessionState(state, true)
    state = nextSessionState(state, true)
    expect(state.answerCount).toBe(2)
  })
})
