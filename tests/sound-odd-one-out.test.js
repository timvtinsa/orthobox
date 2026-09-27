/**
 * Sound odd-one-out rounds: the intruder must never be ambiguous — exactly
 * one option outside the target family, and never duplicated among the
 * others.
 */
import { describe, expect, it } from 'vitest'
import { buildRoundFor, buildSeries } from '../src/games/sound-odd-one-out/logic.js'
import { ONSETS, RHYMES } from '../src/games/sound-odd-one-out/data.js'

const RUNS = 200

describe('buildSeries', () => {
  it('draws exactly as many rounds as asked', () => {
    const series = buildSeries({ criterion: 'onset', choices: 3, rounds: 10 })
    expect(series).toHaveLength(10)
  })

  it('offers exactly as many options as configured', () => {
    for (let run = 0; run < 20; run += 1) {
      const series = buildSeries({ criterion: 'rhyme', choices: 4, rounds: 6 })
      for (const round of series) {
        expect(round.options).toHaveLength(4)
      }
    }
  })

  it('picks the onset families for the onset criterion, rhymes for the rhyme one', () => {
    const onsetSounds = new Set(ONSETS.map((family) => family.sound))
    const rhymeSounds = new Set(RHYMES.map((family) => family.sound))

    const onsetSeries = buildSeries({ criterion: 'onset', choices: 3, rounds: 8 })
    for (const round of onsetSeries) expect(onsetSounds.has(round.sound)).toBe(true)

    const rhymeSeries = buildSeries({ criterion: 'rhyme', choices: 3, rounds: 8 })
    for (const round of rhymeSeries) expect(rhymeSounds.has(round.sound)).toBe(true)
  })
})

describe('buildRoundFor', () => {
  it('never lets the intruder be confused with a target-family option', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const targetFamily = ONSETS[run % ONSETS.length]
      const round = buildRoundFor({ criterion: 'onset', choices: 3 }, ONSETS, targetFamily)

      expect(round.options.filter((word) => word === round.oddOne)).toHaveLength(1)
      expect(round.oddSound).not.toBe(round.sound)
    }
  })

  it('never offers the same word twice among the options', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const targetFamily = RHYMES[run % RHYMES.length]
      const round = buildRoundFor({ criterion: 'rhyme', choices: 4 }, RHYMES, targetFamily)
      expect(new Set(round.options).size).toBe(round.options.length)
    }
  })
})
