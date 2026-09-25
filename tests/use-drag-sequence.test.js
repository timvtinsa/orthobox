/**
 * The one piece of `useDragSequence` that is pure arithmetic: where a moved
 * item actually lands once its old slot is removed from the list first.
 */
import { describe, expect, it } from 'vitest'
import { resolveDropIndex } from '../src/hooks/useDragSequence.js'

describe('resolveDropIndex', () => {
  it('leaves an added game exactly where it was dropped', () => {
    expect(resolveDropIndex({ type: 'add', from: undefined }, 3)).toBe(3)
  })

  it('leaves a moved item alone when it lands before its old position', () => {
    expect(resolveDropIndex({ type: 'move', from: 4 }, 1)).toBe(1)
  })

  it('corrects a moved item landing after its old position, down by one', () => {
    // Position 4 is removed first, so everything after it shifts up by one:
    // a landing spot of 6 is really slot 5 once the gap closes.
    expect(resolveDropIndex({ type: 'move', from: 4 }, 6)).toBe(5)
  })

  it('leaves a moved item alone when it lands on its own old position', () => {
    expect(resolveDropIndex({ type: 'move', from: 4 }, 4)).toBe(4)
  })
})
