/**
 * Building rounds of « Le domino des images ».
 *
 * A chain of picture dominoes grows one tile at a time: each round offers
 * one domino that continues the open end of the chain, among decoys whose
 * two pictures both differ from it.
 */
import { PICTOGRAMS } from '../../lib/pictograms.jsx'
import { pick, sample, shuffle } from '../../lib/random.js'

/** The first domino of a game, before any round is played. */
export function firstDomino() {
  const [left, right] = sample(PICTOGRAMS, 2)
  return { left, right }
}

/** One round: a domino that continues `openEnd`, among decoys that do not. */
export function buildRound(openEnd, optionCount) {
  const others = PICTOGRAMS.filter((picture) => picture.id !== openEnd.id)
  const newEnd = pick(others)
  const correct = { id: 'correct', left: openEnd, right: newEnd }

  const decoyPool = others.filter((picture) => picture.id !== newEnd.id)
  const decoys = []
  while (decoys.length < optionCount - 1) {
    const [a, b] = sample(decoyPool, 2)
    decoys.push({ id: `decoy-${decoys.length}`, left: a, right: b })
  }

  return { correct, options: shuffle([correct, ...decoys]) }
}
