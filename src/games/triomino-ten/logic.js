/**
 * Building rounds of « Le triomino du 10 ».
 *
 * The board grows one tile at a time, in whichever direction a round picks:
 * each round offers a tile whose edge facing the board completes that
 * edge's neighbour to ten, among decoys whose facing edge does not.
 */
import { randomInt, sample, shuffle } from '../../lib/random.js'

const DIGITS = Array.from({ length: 9 }, (_, index) => index + 1)

function randomDigit() {
  return randomInt(1, 9)
}

/** A tile: three independent thirds, `left`, `right` and `free`. Only one
 * of them is constrained to a given value at a time — whichever edge a
 * round needs to face the board — the other two are free. */
function makeTile(id, edge, value) {
  const tile = { id, left: randomDigit(), right: randomDigit(), free: randomDigit() }
  tile[edge] = value
  return tile
}

/** The board's first tile, before any round is played: all three thirds
 * free, since nothing yet neighbours it. */
export function firstTile() {
  return makeTile('start', 'left', randomDigit())
}

/** One round: a tile whose `edge` completes `neighbourValue` to ten, among
 * decoys whose `edge` does not. */
export function buildRound(neighbourValue, edge, optionCount) {
  const target = 10 - neighbourValue
  const correct = makeTile('correct', edge, target)

  const decoyValues = sample(DIGITS.filter((value) => value !== target), optionCount - 1)
  const decoys = decoyValues.map((value, index) => makeTile(`decoy-${index}`, edge, value))

  return { correct, target, options: shuffle([correct, ...decoys]) }
}
