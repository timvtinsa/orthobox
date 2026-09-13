import { useCallback, useRef } from 'react'

/**
 * Verrou synchrone pour les réponses.
 *
 * L'état React n'est mis à jour qu'au rendu suivant : deux clics très
 * rapprochés (un enfant qui tape deux fois sur la tablette) pourraient sinon
 * enregistrer deux réponses pour la même manche. `take()` ne réussit qu'une
 * fois, jusqu'au `release()` de la manche suivante.
 */
export function useAnswerLock() {
  const locked = useRef(false)

  const take = useCallback(() => {
    if (locked.current) return false
    locked.current = true
    return true
  }, [])

  const release = useCallback(() => {
    locked.current = false
  }, [])

  return { take, release }
}
