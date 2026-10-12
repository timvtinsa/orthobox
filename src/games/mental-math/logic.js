/**
 * Building the problems of « Le calcul éclair ».
 *
 * Kept apart from the component so the guarantees can be tested: the right
 * result is offered exactly once, and the series does not ask for the same
 * result twice in a row, nor the same calculation twice.
 */
import { createDrawer, pick, randomInt, shuffle } from '../../lib/random.js'

/** Operand bounds for each range setting. */
const RANGES = {
  ten: { max: 10, tables: [2, 3, 4, 5] },
  twenty: { max: 20, tables: [2, 3, 4, 5, 6, 10] },
  hundred: { max: 100, tables: [2, 3, 4, 5, 6, 7, 8, 9, 10] },
}

/**
 * Plausible lures: the usual mistakes are the immediate neighbour, the
 * forgotten carry (a gap of 10) and the reverse operation.
 */
function distractors(result, gaps) {
  const candidates = new Set()
  for (const gap of shuffle(gaps)) {
    const value = result + gap
    if (value >= 0 && value !== result) candidates.add(value)
    if (candidates.size >= 3) break
  }
  let neighbour = result + 1
  while (candidates.size < 3) {
    if (neighbour !== result && neighbour >= 0) candidates.add(neighbour)
    neighbour += 1
  }
  return [...candidates].slice(0, 3)
}

function buildOperation(config) {
  const range = RANGES[config.range] ?? RANGES.ten
  const operation =
    config.operation === 'mixed'
      ? pick(['addition', 'subtraction'])
      : config.operation

  if (operation === 'multiplication') {
    const a = pick(range.tables)
    const b = randomInt(2, 10)
    return { key: `×${Math.min(a, b)}×${Math.max(a, b)}`, equation: `${a} × ${b}`, result: a * b, gaps: [a, -a, b, -b, 1, -1, 10, -10] }
  }
  if (operation === 'subtraction') {
    const a = randomInt(Math.ceil(range.max / 2), range.max)
    const b = randomInt(1, a)
    return { key: `−${a}−${b}`, equation: `${a} − ${b}`, result: a - b, gaps: [1, -1, 2, -2, 10, -10] }
  }
  const a = randomInt(1, range.max)
  const b = randomInt(1, Math.max(1, range.max - a))
  return { key: `+${Math.min(a, b)}+${Math.max(a, b)}`, equation: `${a} + ${b}`, result: a + b, gaps: [1, -1, 2, -2, 10, -10] }
}

export function buildRound(config) {
  const operation = buildOperation(config)
  return {
    ...operation,
    options: shuffle([operation.result, ...distractors(operation.result, operation.gaps)]),
  }
}

/**
 * The source of problems for one game: no result again within the last
 * three problems (« 7 + 3 » then « 6 + 4 » would be one answer twice), and
 * no calculation twice, « 3 + 4 » and « 4 + 3 » counting as the same one.
 */
export function createProblemDrawer(config) {
  return createDrawer(() => buildRound(config), {
    recent: (round) => [round.result],
    series: (round) => [round.key],
    memory: 3,
  })
}
