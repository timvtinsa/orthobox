/**
 * The board's geometry: adjacent tiles must share a full edge pixel for
 * pixel, in every direction the board can grow — not only rightward — and
 * a single placed tile must open exactly the three slots around it.
 */
import { describe, expect, it } from 'vitest'
import { isUp, key, neighbours, openSlots, tileSlot } from '../src/games/triomino-ten/grid.js'

function sortPoints(points) {
  return [...points].sort().join('|')
}

describe('triomino grid', () => {
  it('alternates orientation by row and column parity', () => {
    expect(isUp(0, 0)).toBe(true)
    expect(isUp(0, 1)).toBe(false)
    expect(isUp(1, 0)).toBe(false)
    expect(isUp(1, 1)).toBe(true)
  })

  it('shares a full edge with its right neighbour', () => {
    const tile = tileSlot(0, 0)
    const right = tileSlot(0, 1)
    // (0,0) is up: its right edge is apex-baseRight. (0,1) is down: its
    // left edge is apex-baseLeft. Both must be the very same two points.
    const tileRightEdge = sortPoints([tile.apex, tile.baseRight])
    const rightLeftEdge = sortPoints([right.apex, right.baseLeft])
    expect(tileRightEdge).toBe(rightLeftEdge)
  })

  it('shares a full edge with its left neighbour', () => {
    const tile = tileSlot(0, 1)
    const left = tileSlot(0, 0)
    const tileLeftEdge = sortPoints([tile.apex, tile.baseLeft])
    const leftRightEdge = sortPoints([left.apex, left.baseRight])
    expect(tileLeftEdge).toBe(leftRightEdge)
  })

  it('shares a full edge with its across neighbour, below for an up tile', () => {
    const tile = tileSlot(0, 0) // up
    const across = tileSlot(1, 0)
    const tileFreeEdge = sortPoints([tile.baseLeft, tile.baseRight])
    const acrossFreeEdge = sortPoints([across.baseLeft, across.baseRight])
    expect(tileFreeEdge).toBe(acrossFreeEdge)
  })

  it('shares a full edge with its across neighbour, above for a down tile', () => {
    const tile = tileSlot(0, 1) // down
    const across = tileSlot(-1, 1)
    const tileFreeEdge = sortPoints([tile.baseLeft, tile.baseRight])
    const acrossFreeEdge = sortPoints([across.baseLeft, across.baseRight])
    expect(tileFreeEdge).toBe(acrossFreeEdge)
  })

  it('opens exactly the three slots around a single tile', () => {
    const tiles = new Map([[key(0, 0), { left: 1, right: 2, free: 3 }]])
    const slots = openSlots(tiles)
    expect(slots).toHaveLength(3)
    const positions = new Set(slots.map((slot) => key(slot.row, slot.col)))
    expect(positions).toEqual(new Set([key(0, -1), key(0, 1), key(1, 0)]))
  })

  it('never re-offers a filled position', () => {
    const tiles = new Map([
      [key(0, 0), { left: 1, right: 2, free: 3 }],
      [key(0, 1), { left: 4, right: 5, free: 6 }],
    ])
    const slots = openSlots(tiles)
    for (const slot of slots) {
      expect(tiles.has(key(slot.row, slot.col))).toBe(false)
    }
  })

  it("each open slot's new-edge is the opposite of the neighbour's facing edge", () => {
    const tiles = new Map([[key(0, 0), { left: 1, right: 2, free: 3 }]])
    const slots = openSlots(tiles)
    const byEdge = Object.fromEntries(slots.map((slot) => [slot.neighbourEdge, slot]))
    expect(byEdge.left.newEdge).toBe('right')
    expect(byEdge.right.newEdge).toBe('left')
    expect(byEdge.free.newEdge).toBe('free')
  })

  it('excludes a slot bordered by more than one placed tile', () => {
    // (0,0) is left empty: both its left (0,-1) and right (0,1) neighbours
    // are placed, so (0,0) now borders two tiles at once.
    const tiles = new Map([
      [key(0, -1), { left: 1, right: 2, free: 3 }],
      [key(0, 1), { left: 1, right: 2, free: 3 }],
    ])
    const slots = openSlots(tiles)
    const positions = new Set(slots.map((slot) => key(slot.row, slot.col)))
    expect(positions.has(key(0, 0))).toBe(false)
  })

  it('every neighbour position maps back to this tile when queried from the other side', () => {
    for (const [row, col] of [
      [0, 0],
      [0, 1],
      [1, 0],
      [-1, 2],
      [3, -4],
    ]) {
      for (const n of neighbours(row, col)) {
        const back = neighbours(n.row, n.col).find((m) => m.row === row && m.col === col)
        expect(back).toBeTruthy()
        expect(back.neighbourEdge).toBe(n.newEdge)
        expect(back.newEdge).toBe(n.neighbourEdge)
      }
    }
  })
})

describe('triomino grid growth', () => {
  it('never runs out of open slots growing a random board up to 25 tiles', () => {
    for (let trial = 0; trial < 500; trial += 1) {
      let tiles = new Map([[key(0, 0), { left: 1, right: 2, free: 3 }]])
      for (let step = 0; step < 24; step += 1) {
        const slots = openSlots(tiles)
        expect(slots.length, `trial ${trial} step ${step}`).toBeGreaterThan(0)
        const chosen = slots[Math.floor(Math.random() * slots.length)]
        tiles = new Map(tiles).set(key(chosen.row, chosen.col), { left: 1, right: 2, free: 3 })
      }
    }
  })
})
