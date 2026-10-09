import { describe, expect, it } from 'vitest'
import { createDrawer, drawSeries, noRepeatSeries, pick, randomInt, sample, sampleAvoiding, shuffle } from '../src/lib/random.js'

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

  it('never repeats an item before the whole pool has been drawn', () => {
    for (let attempt = 0; attempt < 50; attempt += 1) {
      const series = noRepeatSeries(SOURCE, SOURCE.length)
      expect([...series].sort()).toEqual([...SOURCE].sort())
    }
  })

  it('never repeats an item across a bag boundary either', () => {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const series = noRepeatSeries(SOURCE, SOURCE.length * 3)
      for (let i = 1; i < series.length; i += 1) {
        expect(series[i]).not.toBe(series[i - 1])
      }
    }
  })

  it('draws the requested count, beyond the pool size', () => {
    expect(noRepeatSeries(SOURCE, 20)).toHaveLength(20)
  })
})

describe('createDrawer', () => {
  const sum = () => {
    const a = randomInt(1, 9)
    const b = randomInt(1, 9)
    return { a, b, result: a + b }
  }

  it('never repeats a result within its memory when the pool allows it', () => {
    for (let run = 0; run < 200; run += 1) {
      const drawer = createDrawer(sum, { recent: (round) => [round.result], memory: 3 })
      const rounds = drawSeries(drawer, 20)
      rounds.forEach((round, index) => {
        for (let back = 1; back <= 3 && index - back >= 0; back += 1) {
          expect(round.result).not.toBe(rounds[index - back].result)
        }
      })
    }
  })

  it('never asks the same question twice in a session when the pool allows it', () => {
    for (let run = 0; run < 100; run += 1) {
      const drawer = createDrawer(sum, { series: (round) => [[round.a, round.b].sort().join('+')] })
      const keys = drawSeries(drawer, 20).map((round) => [round.a, round.b].sort().join('+'))
      expect(new Set(keys).size).toBe(keys.length)
    }
  })

  it('keeps going, spreading the repeats, when the pool is too small', () => {
    const drawer = createDrawer(() => ({ value: randomInt(1, 3) }), {
      recent: (round) => [round.value],
      series: (round) => [round.value],
      memory: 1,
    })
    const rounds = drawSeries(drawer, 12)
    expect(rounds).toHaveLength(12)
    rounds.forEach((round, index) => {
      if (index > 0) expect(round.value).not.toBe(rounds[index - 1].value)
    })
  })

  it('starts afresh after a reset', () => {
    const drawer = createDrawer(() => ({ value: 1 }), { series: (round) => [round.value] })
    drawer.next()
    drawer.reset()
    expect(drawer.next()).toEqual({ value: 1 })
  })
})
