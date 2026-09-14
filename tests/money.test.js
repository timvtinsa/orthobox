import { describe, expect, it } from 'vitest'
import { COINS, formatAmount } from '../src/games/counting-money/coins.jsx'

describe('euro amounts', () => {
  it('always shows two decimals, French style', () => {
    expect(formatAmount(100)).toBe('1,00 €')
    expect(formatAmount(250)).toBe('2,50 €')
    expect(formatAmount(5)).toBe('0,05 €')
  })
})

describe('coins and notes', () => {
  it('covers the usual values, in cents', () => {
    expect(COINS.map((coin) => coin.value)).toEqual([1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000])
  })

  it('can make up any multiple of five cents', () => {
    const values = COINS.map((coin) => coin.value)
    for (let amount = 5; amount <= 500; amount += 5) {
      let left = amount
      for (const value of [...values].reverse()) {
        while (left >= value) left -= value
      }
      expect(left, `amount ${amount}`).toBe(0)
    }
  })
})
