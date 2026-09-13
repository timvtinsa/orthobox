import { useCallback, useEffect, useRef, useState } from 'react'

const SEUIL = 6 // pixels avant qu'un appui devienne un glissement

/**
 * Glisser-déposer maison, en Pointer Events : fonctionne à la souris comme au
 * doigt (le glisser-déposer HTML5 natif ignore le tactile, et l'application
 * est utilisée sur tablette).
 *
 * Deux gestes sont gérés :
 *  - déposer un jeu de la galerie dans la séance (`type: 'ajout'`) ;
 *  - déplacer une étape déjà présente (`type: 'deplacement'`).
 *
 * Le geste en cours est suivi dans des refs, et non dans l'état React : un
 * glissement rapide peut envoyer déplacement et relâchement dans la même
 * frame, avant tout nouveau rendu — le dépôt serait alors perdu. L'état ne
 * sert qu'à l'affichage (fantôme et repère d'insertion).
 *
 * `onDrop({ type, gameId, depuis, vers })` reçoit la position d'insertion.
 */
export function useDragSequence({ onDrop }) {
  const [drag, setDrag] = useState(null)
  const [cible, setCible] = useState(null)
  const zone = useRef(null)
  const elements = useRef(new Map())
  const depart = useRef(null)
  const dragRef = useRef(null)
  const cibleRef = useRef(null)

  const enregistrerElement = useCallback((index, element) => {
    if (element) elements.current.set(index, element)
    else elements.current.delete(index)
  }, [])

  /** Position d'insertion déduite de l'ordonnée du pointeur. */
  const calculerCible = useCallback((y) => {
    const entrees = [...elements.current.entries()].sort((a, b) => a[0] - b[0])
    for (const [index, element] of entrees) {
      const rect = element.getBoundingClientRect()
      if (y < rect.top + rect.height / 2) return index
    }
    return entrees.length
  }, [])

  const commencer = (event, charge) => {
    // Bouton principal uniquement, pour ne pas gêner le menu contextuel.
    if (event.button !== undefined && event.button > 0) return
    depart.current = { x: event.clientX, y: event.clientY, charge }
  }

  useEffect(() => {
    const bouger = (event) => {
      if (!depart.current) return
      const distance = Math.hypot(
        event.clientX - depart.current.x,
        event.clientY - depart.current.y,
      )
      if (!dragRef.current && distance < SEUIL) return

      dragRef.current = { ...depart.current.charge, x: event.clientX, y: event.clientY }
      setDrag(dragRef.current)

      const rect = zone.current?.getBoundingClientRect()
      const marge = 40 // tolérance autour de la zone de dépôt
      const dansLaZone =
        rect &&
        event.clientX >= rect.left - marge &&
        event.clientX <= rect.right + marge &&
        event.clientY >= rect.top - marge &&
        event.clientY <= rect.bottom + marge
      cibleRef.current = dansLaZone ? calculerCible(event.clientY) : null
      setCible(cibleRef.current)
      event.preventDefault?.()
    }

    const relacher = () => {
      const encours = dragRef.current
      const arrivee = cibleRef.current
      if (encours && arrivee !== null) {
        onDrop({
          type: encours.type,
          gameId: encours.gameId,
          depuis: encours.depuis,
          // Retirer l'élément décale les positions suivantes.
          vers:
            encours.type === 'deplacement' && arrivee > encours.depuis ? arrivee - 1 : arrivee,
        })
      }
      depart.current = null
      dragRef.current = null
      cibleRef.current = null
      setDrag(null)
      setCible(null)
    }

    window.addEventListener('pointermove', bouger, { passive: false })
    window.addEventListener('pointerup', relacher)
    window.addEventListener('pointercancel', relacher)
    return () => {
      window.removeEventListener('pointermove', bouger)
      window.removeEventListener('pointerup', relacher)
      window.removeEventListener('pointercancel', relacher)
    }
  }, [calculerCible, onDrop])

  return { drag, cible, zone, commencer, enregistrerElement }
}
