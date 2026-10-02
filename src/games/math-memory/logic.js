/**
 * Building a deck for « Le memory des calculs ».
 *
 * Every pair is a number card and an operation card that computes to it.
 * No two operations ever share a result: a number card would otherwise
 * match more than one operation, breaking the point of a memory game,
 * which is to remember a specific position, not just any card that works.
 */
import { pick, randomInt, shuffle } from '../../lib/random.js'

/** Operand bounds per level: kept modest even at « hard », since a bigger
 * grid is already the harder part of a memory game — the arithmetic does
 * not also need to escalate. */
const RANGES = {
  easy: { max: 10, tables: [2, 3, 4, 5] },
  medium: { max: 20, tables: [2, 3, 4, 5, 6, 10] },
  hard: { max: 20, tables: [2, 3, 4, 5, 6, 7, 8, 9, 10] },
}

/** Pairs (and the grid's columns) per level, the same shape the plain
 * image memory game uses. */
export const PAIRS = { easy: 3, medium: 6, hard: 10 }
export const COLUMNS = { easy: 3, medium: 4, hard: 5 }

function buildOperation(operationType, range) {
  const operation = operationType === 'mixed' ? pick(['addition', 'subtraction']) : operationType

  if (operation === 'multiplication') {
    const a = pick(range.tables)
    const b = randomInt(2, 10)
    return { label: `${a} × ${b}`, value: a * b }
  }
  if (operation === 'subtraction') {
    const a = randomInt(Math.ceil(range.max / 2), range.max)
    const b = randomInt(1, a)
    return { label: `${a} − ${b}`, value: a - b }
  }
  const a = randomInt(1, range.max)
  const b = randomInt(1, Math.max(1, range.max - a))
  return { label: `${a} + ${b}`, value: a + b }
}

/** `count` operations, no two sharing a result. */
export function buildOperations(count, operationType, range) {
  const seen = new Set()
  const operations = []
  let guard = 0
  while (operations.length < count && guard < count * 100) {
    guard += 1
    const operation = buildOperation(operationType, range)
    if (seen.has(operation.value)) continue
    seen.add(operation.value)
    operations.push(operation)
  }
  return operations
}

/** The full, shuffled deck: one number card and one operation card per
 * pair, in a random order. */
export function deal(config) {
  const range = RANGES[config.level] ?? RANGES.easy
  const pairs = PAIRS[config.level] ?? PAIRS.easy
  const operations = buildOperations(pairs, config.operation, range)
  return shuffle(
    operations.flatMap((operation, index) => [
      { key: `number-${index}`, pair: index, kind: 'number', display: String(operation.value) },
      { key: `operation-${index}`, pair: index, kind: 'operation', display: operation.label },
    ]),
  )
}
