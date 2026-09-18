/**
 * The geometric shape of a domain: square, circle, triangle or diamond.
 *
 * The domain is carried twice, by its colour and by this shape, so it stays
 * readable in greyscale and on the printed summary. Every screen that names a
 * domain shows this shape next to it.
 */
const SHAPES = {
  square: <rect x="1" y="1" width="10" height="10" rx="2" />,
  circle: <circle cx="6" cy="6" r="5" />,
  triangle: <polygon points="6,1 11.2,10.6 0.8,10.6" />,
  diamond: <polygon points="6,0.6 11.4,6 6,11.4 0.6,6" />,
}

export default function CategoryShape({ shape, size = 12, className = '' }) {
  const drawing = SHAPES[shape]
  if (!drawing) return null

  return (
    <svg
      className={`category-shape ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {drawing}
    </svg>
  )
}
