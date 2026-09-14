import { describe, expect, it } from 'vitest'
import { pick, randomInt, sample, sampleAvoiding, shuffle } from '../src/lib/random.js'

const SOURCE = ['a', 'b', 'c', 'd', 'e', 'f']

describe('random helpers', () => {
  it('shuffles without losing or mutating items', () => {
    const copy = [...SOURCE]
    expect(shuffle(SOURCE).sort()).toEqual([...SOURCE].sort())
    expect(SOURCE).toEqual(copy)
  })

  it('draws distinct items', () => {
    const drawn = sample(SOURCE, 4)
    expect(drawn).toHaveLength(4)
    expect(new Set(drawn).size).toBe(4)
  })

  it('never exceeds the size of the source', () => {
    expect(sample(SOURCE, 99)).toHaveLength(SOURCE.length)
  })

  it('stays within the requested bounds', () => {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const value = randomInt(3, 6)
      expect(value).toBeGreaterThanOrEqual(3)
      expect(value).toBeLessThanOrEqual(6)
    }
  })

  it('always picks an item from the list', () => {
    expect(SOURCE).toContain(pick(SOURCE))
  })

  it('avoids already seen items while it can', () => {
    const seen = ['a', 'b', 'c']
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const drawn = sampleAvoiding(SOURCE, 3, seen)
      expect(drawn.some((item) => seen.includes(item))).toBe(false)
    }
  })

  it('falls back to the whole list when fresh items run out', () => {
    expect(sampleAvoiding(SOURCE, 5, ['a', 'b', 'c', 'd'])).toHaveLength(5)
  })
})
