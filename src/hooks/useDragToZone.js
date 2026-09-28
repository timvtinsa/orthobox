import { useEffect, useRef, useState } from 'react'

const THRESHOLD = 6 // pixels before a press becomes a drag
const TOUCH_HOLD_MS = 200 // a finger must hold still this long before a drag arms
const TOUCH_MOVE_TOLERANCE = 10 // pixels a finger may wander before the hold is cancelled

/**
 * Hand-rolled drag and drop onto a single zone, on Pointer Events: works
 * with a mouse as well as a finger (native HTML5 drag and drop ignores
 * touch). Same touch-hold-to-arm rule as `useDragSequence`, so a normal
 * scrolling swipe is left to the browser instead of being captured as a
 * drag — see that hook for the reasoning.
 *
 * Unlike `useDragSequence`, there is only one drop target: `onDrop(payload)`
 * fires once, when the pointer is released over `zone`, and nowhere among
 * several insertion points.
 */
export function useDragToZone({ onDrop }) {
  const [drag, setDrag] = useState(null)
  const [over, setOver] = useState(false)
  const zone = useRef(null)
  const origin = useRef(null)
  const dragRef = useRef(null)
  const overRef = useRef(false)
  const armedRef = useRef(false)
  const holdTimer = useRef(null)

  const start = (event, payload) => {
    // Primary button only, so the context menu keeps working.
    if (event.button !== undefined && event.button > 0) return
    origin.current = { x: event.clientX, y: event.clientY, payload, pointerType: event.pointerType }
    clearTimeout(holdTimer.current)
    if (event.pointerType === 'touch') {
      armedRef.current = false
      holdTimer.current = setTimeout(() => {
        if (origin.current) armedRef.current = true
      }, TOUCH_HOLD_MS)
    } else {
      armedRef.current = true
    }
  }

  useEffect(() => {
    const move = (event) => {
      if (!origin.current) return
      const distance = Math.hypot(
        event.clientX - origin.current.x,
        event.clientY - origin.current.y,
      )

      if (!dragRef.current) {
        if (!armedRef.current) {
          if (origin.current.pointerType === 'touch' && distance > TOUCH_MOVE_TOLERANCE) {
            clearTimeout(holdTimer.current)
            origin.current = null
          }
          return
        }
        if (distance < THRESHOLD) return
      }

      dragRef.current = { ...origin.current.payload, x: event.clientX, y: event.clientY }
      setDrag(dragRef.current)

      const rect = zone.current?.getBoundingClientRect()
      const margin = 30 // tolerance around the drop zone
      const inside =
        rect &&
        event.clientX >= rect.left - margin &&
        event.clientX <= rect.right + margin &&
        event.clientY >= rect.top - margin &&
        event.clientY <= rect.bottom + margin
      overRef.current = Boolean(inside)
      setOver(overRef.current)
      event.preventDefault?.()
    }

    const release = () => {
      if (dragRef.current && overRef.current) onDrop(origin.current.payload)
      clearTimeout(holdTimer.current)
      origin.current = null
      dragRef.current = null
      overRef.current = false
      armedRef.current = false
      setDrag(null)
      setOver(false)
    }

    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [onDrop])

  return { drag, over, zone, start }
}
