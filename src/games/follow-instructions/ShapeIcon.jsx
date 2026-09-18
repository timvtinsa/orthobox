/**
 * The four shapes of the token bank, drawn flat with a constant dark
 * outline: colour names the token, the outline keeps it legible without it.
 */
const FEATURE = '#33303a'

const SHAPES = {
  carre: <rect x="7" y="7" width="26" height="26" rx="4" />,
  rond: <circle cx="20" cy="20" r="14" />,
  triangle: <path d="M20 6 L34 32 L6 32 Z" strokeLinejoin="round" />,
  losange: <path d="M20 5 L35 20 L20 35 L5 20 Z" strokeLinejoin="round" />,
}

export default function ShapeIcon({ shapeId, hex, size = 30 }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <g fill={hex} stroke={FEATURE} strokeWidth="3">
        {SHAPES[shapeId]}
      </g>
    </svg>
  )
}
