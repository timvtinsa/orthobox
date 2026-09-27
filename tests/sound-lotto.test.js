/**
 * The guarantee « Le loto sonore » needs: the board never repeats a
 * picture, and the call order is exactly the board, so every picture is
 * called exactly once.
 */
import { describe, expect, it } from 'vitest'
import { deal } from '../src/games/sound-lotto/logic.js'

describe('board', () => {
  it('deals as many distinct pictures as asked for', () => {
    for (const size of [6, 9, 12]) {
      const { board } = deal(size)
      expect(board).toHaveLength(size)
      expect(new Set(board.map((picture) => picture.id)).size).toBe(size)
    }
  })

  it('calls every board picture exactly once', () => {
    const { board, calls } = deal(9)
    expect(calls).toHaveLength(board.length)
    expect(new Set(calls.map((picture) => picture.id))).toEqual(new Set(board.map((picture) => picture.id)))
  })
})
