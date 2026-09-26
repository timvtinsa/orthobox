/**
 * The guarantees « Le panier du marché » needs: an order never asks for more
 * kinds than the stall holds, never asks for a kind twice, respects the
 * quantity setting, and the correction credits a basket only when it holds
 * exactly the order.
 */
import { describe, expect, it } from 'vitest'
import { PRODUCE, quantityLabel } from '../src/games/market-basket/data.js'
import {
  basketMatches,
  buildOrder,
  kindState,
  MAX_PER_KIND,
  orderCounts,
  orderSize,
} from '../src/games/market-basket/logic.js'

const RUNS = 100
const KINDS = [2, 3, 4, 5]

describe('orders', () => {
  it('asks for exactly the number of kinds requested', () => {
    for (const quantities of ['single', 'multiple']) {
      for (const kinds of KINDS) {
        for (let run = 0; run < RUNS; run += 1) {
          expect(buildOrder({ kinds, quantities }), `${quantities}/${kinds}`).toHaveLength(kinds)
        }
      }
    }
  })

  it('never asks for the same kind twice in one order', () => {
    for (const kinds of KINDS) {
      for (let run = 0; run < RUNS; run += 1) {
        const ids = buildOrder({ kinds, quantities: 'multiple' }).map((item) => item.id)
        expect(new Set(ids).size).toBe(ids.length)
      }
    }
  })

  it('only ever asks for produce actually on the stall', () => {
    const stall = new Set(PRODUCE.map((item) => item.id))
    for (let run = 0; run < RUNS; run += 1) {
      for (const item of buildOrder({ kinds: 5, quantities: 'multiple' })) {
        expect(stall.has(item.id), item.id).toBe(true)
      }
    }
  })

  it('takes exactly one of each kind when quantities are off', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const order = buildOrder({ kinds: 4, quantities: 'single' })
      expect(order.every((item) => item.count === 1)).toBe(true)
      expect(orderSize(order)).toBe(4)
    }
  })

  it('stays within one and three of each kind when quantities are on', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const item of buildOrder({ kinds: 5, quantities: 'multiple' })) {
        expect(item.count).toBeGreaterThanOrEqual(1)
        expect(item.count).toBeLessThanOrEqual(MAX_PER_KIND)
      }
    }
  })

  it('never asks for more kinds than the stall holds', () => {
    const order = buildOrder({ kinds: 99, quantities: 'single' })
    expect(order).toHaveLength(PRODUCE.length)
  })
})

describe('correction', () => {
  const order = [
    { id: 'apple', one: 'pomme', many: 'pommes', count: 2 },
    { id: 'leek', one: 'poireau', many: 'poireaux', count: 1 },
  ]

  it('credits a basket that holds exactly the order', () => {
    expect(basketMatches(order, { apple: 2, leek: 1 })).toBe(true)
  })

  it('rejects a basket missing an article, or one too many', () => {
    expect(basketMatches(order, { apple: 2 })).toBe(false)
    expect(basketMatches(order, { apple: 1, leek: 1 })).toBe(false)
    expect(basketMatches(order, { apple: 3, leek: 1 })).toBe(false)
  })

  it('rejects a basket holding a kind the order never asked for', () => {
    expect(basketMatches(order, { apple: 2, leek: 1, lemon: 1 })).toBe(false)
  })

  it('ignores a kind taken then put back entirely', () => {
    expect(basketMatches(order, { apple: 2, leek: 1, lemon: 0 })).toBe(true)
  })

  it('marks each kind with what the patient should see', () => {
    const basket = { apple: 2, lemon: 1 }
    expect(kindState('apple', order, basket)).toBe('ok')
    expect(kindState('leek', order, basket)).toBe('expected')
    expect(kindState('lemon', order, basket)).toBe('err')
  })

  it('marks a miscounted kind as wrong, not as missing', () => {
    expect(kindState('apple', order, { apple: 1 })).toBe('err')
  })

  it('says nothing about a kind that is in neither the order nor the basket', () => {
    expect(kindState('carrot', order, { apple: 2 })).toBe(null)
  })

  it('counts the whole order, quantities included', () => {
    expect(orderSize(order)).toBe(3)
    expect(orderCounts(order)).toEqual({ apple: 2, leek: 1 })
  })
})

describe('labels', () => {
  it('uses the French plural, including the irregular one', () => {
    const leek = PRODUCE.find((item) => item.id === 'leek')
    expect(quantityLabel(leek, 1)).toBe('1 poireau')
    expect(quantityLabel(leek, 3)).toBe('3 poireaux')
  })

  it('gives every kind on the stall both a singular and a plural', () => {
    for (const item of PRODUCE) {
      expect(item.one, item.id).toBeTruthy()
      expect(item.many, item.id).toBeTruthy()
    }
  })
})
