/**
 * Building a game of « Le loto sonore ».
 *
 * A board of distinct pictures is dealt once; the call order is that same
 * board, shuffled, so every picture is called exactly once, as on a real
 * lotto card.
 */
import { PICTOGRAMS } from '../../lib/pictograms.jsx'
import { sample, shuffle } from '../../lib/random.js'

export function deal(size) {
  const board = sample(PICTOGRAMS, size)
  return { board, calls: shuffle(board) }
}
