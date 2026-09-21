/**
 * The guarantee « La suite de formes » needs: the board never hands out two
 * identical cells (which would make two positions indistinguishable), and
 * the sequence never asks to repeat the same cell twice in a row.
 */
import { describe, expect, it } from 'vitest'
import { buildBoard, makeSequence } from '../src/games/shape-sequence/logic.js'

const RUNS = 100

describe('board', () => {
  it('gives every cell a distinct colour, in colour-only material', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const cells of [4, 6]) {
        const board = buildBoard('colors', cells)
        expect(board).toHaveLength(cells)
        expect(board.every((cell) => cell.shapeId === null)).toBe(true)
        expect(new Set(board.map((cell) => cell.colorId)).size).toBe(cells)
      }
    }
  })

  it('gives every cell a distinct shape+colour pair, in shapes material', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const cells of [4, 6]) {
        const board = buildBoard('shapes', cells)
        expect(board).toHaveLength(cells)
        expect(board.every((cell) => cell.shapeId !== null)).toBe(true)
        const ids = board.map((cell) => `${cell.shapeId}-${cell.colorId}`)
        expect(new Set(ids).size).toBe(cells)
      }
    }
  })
})

describe('sequence', () => {
  it('never lights the same cell twice in a row', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const sequence = makeSequence(4, 20)
      expect(sequence).toHaveLength(20)
      for (let i = 1; i < sequence.length; i += 1) {
        expect(sequence[i]).not.toBe(sequence[i - 1])
      }
    }
  })

  it('only ever points at a cell on the board', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const sequence = makeSequence(6, 15)
      for (const index of sequence) {
        expect(index).toBeGreaterThanOrEqual(0)
        expect(index).toBeLessThan(6)
      }
    }
  })
})
