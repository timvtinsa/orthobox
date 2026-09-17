/**
 * Correction state of one option on a board.
 *
 * Four states, and the distinction that matters: the expected answer revealed
 * after a miss is *not* credited as correct. It carries its own state, so the
 * patient sees what was expected without being told they found it.
 *
 *   ok       the answer given, and it was the expected one
 *   err      the answer given, and it was not
 *   expected the expected answer, revealed after a miss
 *   null     nothing to say yet, or an option that was not involved
 */
export function answerState(id, { picked, expected }) {
  if (picked === null || picked === undefined) return null
  if (id === picked) return id === expected ? 'ok' : 'err'
  if (id === expected) return 'expected'
  return null
}

/** Class names for a state, to append to an element's own class. */
export function stateClass(state) {
  return state ? ` is-state is-${state}` : ''
}
