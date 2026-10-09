/**
 * Variety of the questions: whatever the game, a series must not hand the same
 * answer (or the same question) back right away. Each drawer is exercised over
 * many series, since a random draw can only be judged by volume.
 */
import { describe, expect, it } from 'vitest'
import { createBondDrawer, TARGETS } from '../src/games/number-bonds/bonds.js'
import { createClockDrawer, STEPS } from '../src/games/clock-reading/clock.js'
import { createRollDrawer, sumOf } from '../src/games/dice-sum/logic.js'
import { createInstructionDrawer } from '../src/games/follow-instructions/logic.js'
import { createLetterDrawer, SETS } from '../src/games/letter-discrimination/letters.js'
import { createLineDrawer } from '../src/games/number-line/line.js'
import { createOrderDrawer } from '../src/games/market-basket/logic.js'
import { createSequenceDrawer } from '../src/games/shape-sequence/logic.js'
import { buildSeries as buildSeasons, KINDS_BY_LEVEL as SEASON_KINDS } from '../src/games/seasons/logic.js'
import { buildSeries as buildDays, KINDS_BY_LEVEL as DAY_KINDS } from '../src/games/week-days/logic.js'
import { drawSeries } from '../src/lib/random.js'

const RUNS = 150

/** Asserts that `keyOf` of a round never equals that of any of the `window` rounds before it. */
function expectNoRepeat(rounds, keyOf, window, label) {
  rounds.forEach((round, index) => {
    for (let back = 1; back <= window && index - back >= 0; back += 1) {
      expect(keyOf(round), label).not.toEqual(keyOf(rounds[index - back]))
    }
  })
}

describe('number bonds', () => {
  it('does not give a bond and its mirror within three problems', () => {
    for (const target of Object.keys(TARGETS)) {
      for (let run = 0; run < RUNS; run += 1) {
        const rounds = drawSeries(createBondDrawer({ target }), 20)
        const pair = (round) => `${Math.min(round.given, round.answer)}-${Math.max(round.given, round.answer)}`
        expectNoRepeat(rounds, pair, target === 'ten' ? 2 : 3, target)
      }
    }
  })

  it('does not give the same number twice in the first ten problems', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const rounds = drawSeries(createBondDrawer({ target: 'twenty' }), 10)
      expect(new Set(rounds.map((round) => round.given)).size).toBe(10)
    }
  })
})

describe('clock reading', () => {
  it('does not give the same time within two questions, nor the same hour', () => {
    for (const precision of Object.keys(STEPS)) {
      for (let run = 0; run < RUNS; run += 1) {
        const rounds = drawSeries(createClockDrawer({ precision }), 20)
        expectNoRepeat(rounds, (round) => round.label, 2, precision)
        expectNoRepeat(rounds, (round) => round.hours, 2, precision)
      }
    }
  })
})

describe('dice sum', () => {
  it('does not give the same total within three throws', () => {
    for (const dice of [2, 3, 4]) {
      for (let run = 0; run < RUNS; run += 1) {
        const rounds = drawSeries(createRollDrawer({ dice }), 20)
        expectNoRepeat(rounds, sumOf, 3, `${dice} dice`)
      }
    }
  })
})

describe('instructions and sequences', () => {
  it('does not give the same instruction twice in a series', () => {
    for (const length of ['one', 'two', 'three']) {
      for (let run = 0; run < 40; run += 1) {
        const rounds = drawSeries(createInstructionDrawer({ length }), 20)
        const keys = rounds.map((round) => round.target.map((token) => token.id).join('>'))
        expect(new Set(keys).size, length).toBe(keys.length)
      }
    }
  })

  it('does not start two sequences in a row with the same item', () => {
    for (const material of ['colors', 'shapes']) {
      for (let run = 0; run < RUNS; run += 1) {
        const rounds = drawSeries(createSequenceDrawer({ material, length: 'three' }), 20)
        expectNoRepeat(rounds, (round) => round.target[0].id, 1, material)
      }
    }
  })
})

describe('letters', () => {
  it('does not ask for the same letter within two rounds', () => {
    for (const family of Object.keys(SETS)) {
      for (let run = 0; run < RUNS; run += 1) {
        const rounds = drawSeries(createLetterDrawer({ family, size: 6 }), 20)
        expectNoRepeat(rounds, (round) => round.target, 1, family)
      }
    }
  })
})

describe('number line', () => {
  it('does not ask for the same number within three rounds', () => {
    for (const task of ['place', 'read', 'compute']) {
      for (const range of ['twenty', 'hundred']) {
        for (let run = 0; run < RUNS; run += 1) {
          const rounds = drawSeries(createLineDrawer({ task, range }), 20)
          expectNoRepeat(rounds, (round) => round.target, 3, `${task} ${range}`)
        }
      }
    }
  })
})

describe('market basket', () => {
  it('never gives the same order twice', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const rounds = drawSeries(createOrderDrawer({ kinds: 3 }), 20)
      const keys = rounds.map((order) => order.map((item) => `${item.id}${item.count}`).join(','))
      expect(new Set(keys).size).toBe(keys.length)
    }
  })
})

describe('days and seasons', () => {
  it('never give the same answer twice in a row', () => {
    for (const level of Object.keys(DAY_KINDS)) {
      for (let run = 0; run < RUNS; run += 1) {
        expectNoRepeat(buildDays({ level, rounds: 20 }), (round) => round.answer, 1, `days ${level}`)
      }
    }
    for (const level of Object.keys(SEASON_KINDS)) {
      for (let run = 0; run < RUNS; run += 1) {
        expectNoRepeat(buildSeasons({ level, rounds: 20 }), (round) => round.answer, 1, `seasons ${level}`)
      }
    }
  })
})
