import { describe, expect, it } from 'vitest'
import { createStep, moveItem, successRate } from '../src/lib/session-plan.js'

describe('step ordering', () => {
  const list = ['a', 'b', 'c', 'd']

  it('moves an item down', () => {
    expect(moveItem(list, 0, 2)).toEqual(['b', 'c', 'a', 'd'])
  })

  it('moves an item up', () => {
    expect(moveItem(list, 3, 1)).toEqual(['a', 'd', 'b', 'c'])
  })

  it('changes nothing for an identical or invalid position', () => {
    expect(moveItem(list, 1, 1)).toEqual(list)
    expect(moveItem(list, -1, 2)).toEqual(list)
  })

  it('does not mutate the source list', () => {
    const copy = [...list]
    moveItem(list, 0, 3)
    expect(list).toEqual(copy)
  })
})

describe('steps', () => {
  it('gives every step its own id', () => {
    const first = createStep('stroop', {})
    const second = createStep('stroop', {})
    expect(first.id).not.toBe(second.id)
    expect(first.gameId).toBe('stroop')
  })
})

describe('success rate', () => {
  it('rounds the percentage', () => {
    expect(successRate({ correct: 1, attempts: 3 })).toBe(33)
    expect(successRate({ correct: 3, attempts: 3 })).toBe(100)
  })

  it('stays undefined without any attempt', () => {
    expect(successRate({ correct: 0, attempts: 0 })).toBeNull()
    expect(successRate(null)).toBeNull()
  })
})
