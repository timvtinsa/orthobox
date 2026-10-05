/**
 * Building a game of « Le loto sonore ».
 *
 * The pool combines the everyday sounds and the animal cries of the sound
 * bank (`src/lib/audio.js`): every entry there already carries a real
 * recording in `public/sounds/`, so this is the one game that always plays
 * an actual noise, never a synthesised effect or a spoken word. A board of
 * distinct noises is dealt once; the call order is that same board,
 * shuffled, so every noise is called exactly once, as on a real lotto card.
 */
import { ANIMALS, SOUNDS } from '../../lib/audio.js'
import { sample, shuffle } from '../../lib/random.js'

export const NOISES = [...SOUNDS, ...ANIMALS]

export function deal(size) {
  const board = sample(NOISES, size)
  return { board, calls: shuffle(board) }
}
