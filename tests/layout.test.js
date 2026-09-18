import { describe, expect, it } from 'vitest'
import { scatterOnGrid } from '../src/lib/layout.js'

describe('scatter on grid', () => {
  it('produces one position per item', () => {
    expect(scatterOnGrid(24).positions).toHaveLength(24)
    expect(scatterOnGrid(1).positions).toHaveLength(1)
  })

  it('keeps every position inside the frame', () => {
    const { positions } = scatterOnGrid(80)
    for (const position of positions) {
      expect(position.left).toBeGreaterThan(0)
      expect(position.left).toBeLessThan(100)
      expect(position.top).toBeGreaterThan(0)
      expect(position.top).toBeLessThan(100)
    }
  })

  it('provides enough cells for every item', () => {
    const { columns, rows } = scatterOnGrid(30)
    expect(columns * rows).toBeGreaterThanOrEqual(30)
  })

  it('never stacks two items on the same spot', () => {
    const { positions } = scatterOnGrid(40)
    const keys = positions.map((position) => `${Math.round(position.left)}-${Math.round(position.top)}`)
    expect(new Set(keys).size).toBe(positions.length)
  })
})
