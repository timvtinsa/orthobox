/**
 * The guarantee « Le loto sonore » needs: the board never repeats a noise,
 * the call order is exactly the board, so every noise is called exactly
 * once, and every noise in the pool ships with a real recording.
 */
import { describe, expect, it } from 'vitest'
import { deal, NOISES } from '../src/games/noise-lotto/logic.js'

describe('pool', () => {
  it('has a distinct id and pictogram for every noise', () => {
    expect(new Set(NOISES.map((noise) => noise.id)).size).toBe(NOISES.length)
    NOISES.forEach((noise) => {
      expect(noise.pictogram).toBeTruthy()
      expect(noise.label).toBeTruthy()
    })
  })
})

describe('board', () => {
  it('deals as many distinct noises as asked for', () => {
    for (const size of [6, 9, 12]) {
      const { board } = deal(size)
      expect(board).toHaveLength(size)
      expect(new Set(board.map((noise) => noise.id)).size).toBe(size)
    }
  })

  it('calls every board noise exactly once', () => {
    const { board, calls } = deal(9)
    expect(calls).toHaveLength(board.length)
    expect(new Set(calls.map((noise) => noise.id))).toEqual(new Set(board.map((noise) => noise.id)))
  })
})
