/**
 * Building rounds of « Le triomino du 10 ».
 *
 * Tiles chain like domino images do: one tile at a time, each round offers
 * a tile that completes the open end to ten, among decoys whose facing third
 * does not.
 */
import { randomInt, sample, shuffle } from '../../lib/random.js'

const DIGITS = Array.from({ length: 9 }, (_, index) => index + 1)

function randomDigit() {
  return randomInt(1, 9)
}

/** A tile: three independent thirds. Only `left` and `right` ever face a
 * neighbour in a left-to-right chain; `top` is still a real third, just one
 * this chain never puts up against another tile. */
function makeTile(id, left) {
  return { id, left, right: randomDigit(), top: randomDigit() }
}

/** The chain's first tile, before any round is played. */
export function firstTile() {
  return makeTile('start', randomDigit())
}

/** One round: a tile whose `left` completes `openRight` to ten, among
 * decoys whose `left` does not. */
export function buildRound(openRight, optionCount) {
  const target = 10 - openRight
  const correct = makeTile('correct', target)

  const decoyValues = sample(DIGITS.filter((value) => value !== target), optionCount - 1)
  const decoys = decoyValues.map((left, index) => makeTile(`decoy-${index}`, left))

  return { correct, target, options: shuffle([correct, ...decoys]) }
}
