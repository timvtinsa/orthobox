import { createContext, useContext } from 'react'

/**
 * What the end-of-game screen needs to propose a different difficulty: the
 * game, the settings it ran with, and a way to start again with others.
 *
 * Only the game page provides it. In session mode the plan is the
 * practitioner's, so there is no value and no proposal.
 */
const ProgressionContext = createContext(null)

export const ProgressionProvider = ProgressionContext.Provider

export function useProgression() {
  return useContext(ProgressionContext)
}
