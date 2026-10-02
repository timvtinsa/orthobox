/**
 * The guarantee « Le memory des calculs » needs: every operation in a deck
 * computes to a distinct result, so a number card never has more than one
 * operation card it could belong to — in every level and operation setting
 * the practitioner can pick.
 */
import { describe, expect, it } from 'vitest'
import { COLUMNS, PAIRS, buildOperations, deal } from '../src/games/math-memory/logic.js'

const LEVELS = ['easy', 'medium', 'hard']
const OPERATIONS = ['addition', 'subtraction', 'mixed', 'multiplication', 'all']
const RUNS = 50

function evaluate(label) {
  // "6 + 4", "12 − 5", "3 × 4" -> the actual result, recomputed from the
  // label rather than trusted, so the test does not just restate the code.
  const [a, sign, b] = label.split(' ')
  const x = Number(a)
  const y = Number(b)
  if (sign === '+') return x + y
  if (sign === '−') return x - y
  return x * y
}

describe('math-memory deck building', () => {
  it('never produces two operations with the same result', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const level of LEVELS) {
        for (const operation of OPERATIONS) {
          const pairs = PAIRS[level]
          const operations = buildOperations(pairs, operation, {
            max: level === 'easy' ? 10 : 20,
            tables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
          })
          expect(operations, `${level}/${operation}`).toHaveLength(pairs)
          const values = operations.map((op) => op.value)
          expect(new Set(values).size, `${level}/${operation}`).toBe(pairs)
        }
      }
    }
  })

  it('every operation label actually computes to its stated value', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const operation of OPERATIONS) {
        const operations = buildOperations(10, operation, {
          max: 20,
          tables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
        })
        for (const op of operations) {
          expect(evaluate(op.label)).toBe(op.value)
        }
      }
    }
  })

  it('deals a well-formed deck: two cards per pair, matching values, no duplicate results', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const level of LEVELS) {
        for (const operation of OPERATIONS) {
          const pairs = PAIRS[level]
          const cards = deal({ level, operation })
          expect(cards, `${level}/${operation}`).toHaveLength(pairs * 2)

          const byPair = new Map()
          for (const card of cards) {
            const group = byPair.get(card.pair) ?? []
            group.push(card)
            byPair.set(card.pair, group)
          }
          expect(byPair.size, `${level}/${operation}`).toBe(pairs)

          const results = new Set()
          for (const [, group] of byPair) {
            expect(group, `${level}/${operation}`).toHaveLength(2)
            const number = group.find((c) => c.kind === 'number')
            const op = group.find((c) => c.kind === 'operation')
            expect(number, `${level}/${operation}`).toBeTruthy()
            expect(op, `${level}/${operation}`).toBeTruthy()
            expect(evaluate(op.display), `${level}/${operation}`).toBe(Number(number.display))
            results.add(number.display)
          }
          expect(results.size, `${level}/${operation}`).toBe(pairs)
        }
      }
    }
  })

  it('keeps a column count for every level', () => {
    for (const level of LEVELS) {
      expect(COLUMNS[level]).toBeGreaterThan(0)
    }
  })
})
