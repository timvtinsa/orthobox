import { useCallback, useEffect, useRef, useState } from 'react'

const THRESHOLD = 6 // pixels before a press becomes a drag

/**
 * Hand-rolled drag and drop, on Pointer Events: works with a mouse as well as
 * a finger (native HTML5 drag and drop ignores touch, and the application is
 * used on tablets).
 *
 * Two gestures are handled:
 *  - dropping a game from the catalogue into the session (`type: 'add'`);
 *  - moving a step that is already in the plan (`type: 'move'`).
 *
 * The gesture in flight is tracked in refs rather than in React state: a fast
 * drag can fire move and release within the same frame, before any re-render,
 * and the drop would then be lost. State only drives the display (the ghost
 * and the insertion marker).
 *
 * `onDrop({ type, gameId, from, to })` receives the insertion position.
 */
export function useDragSequence({ onDrop }) {
  const [drag, setDrag] = useState(null)
  const [target, setTarget] = useState(null)
  const zone = useRef(null)
  const items = useRef(new Map())
  const origin = useRef(null)
  const dragRef = useRef(null)
  const targetRef = useRef(null)

  const registerItem = useCallback((index, element) => {
    if (element) items.current.set(index, element)
    else items.current.delete(index)
  }, [])

  /** Insertion position derived from the pointer's vertical position. */
  const computeTarget = useCallback((y) => {
    const entries = [...items.current.entries()].sort((a, b) => a[0] - b[0])
    for (const [index, element] of entries) {
      const rect = element.getBoundingClientRect()
      if (y < rect.top + rect.height / 2) return index
    }
    return entries.length
  }, [])

  const start = (event, payload) => {
    // Primary button only, so the context menu keeps working.
    if (event.button !== undefined && event.button > 0) return
    origin.current = { x: event.clientX, y: event.clientY, payload }
  }

  useEffect(() => {
    const move = (event) => {
      if (!origin.current) return
      const distance = Math.hypot(
        event.clientX - origin.current.x,
        event.clientY - origin.current.y,
      )
      if (!dragRef.current && distance < THRESHOLD) return

      dragRef.current = { ...origin.current.payload, x: event.clientX, y: event.clientY }
      setDrag(dragRef.current)

      const rect = zone.current?.getBoundingClientRect()
      const margin = 40 // tolerance around the drop zone
      const insideZone =
        rect &&
        event.clientX >= rect.left - margin &&
        event.clientX <= rect.right + margin &&
        event.clientY >= rect.top - margin &&
        event.clientY <= rect.bottom + margin
      targetRef.current = insideZone ? computeTarget(event.clientY) : null
      setTarget(targetRef.current)
      event.preventDefault?.()
    }

    const release = () => {
      const current = dragRef.current
      const landing = targetRef.current
      if (current && landing !== null) {
        onDrop({
          type: current.type,
          gameId: current.gameId,
          from: current.from,
          // Removing the item shifts every position after it.
          to: current.type === 'move' && landing > current.from ? landing - 1 : landing,
        })
      }
      origin.current = null
      dragRef.current = null
      targetRef.current = null
      setDrag(null)
      setTarget(null)
    }

    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [computeTarget, onDrop])

  return { drag, target, zone, start, registerItem }
}
