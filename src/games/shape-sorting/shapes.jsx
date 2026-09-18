/** Coloured geometric shapes to sort: four shapes, four colours. */
export const SHAPES = [
  { id: 'circle', label: 'rond', plural: 'les ronds' },
  { id: 'square', label: 'carré', plural: 'les carrés' },
  { id: 'triangle', label: 'triangle', plural: 'les triangles' },
  { id: 'diamond', label: 'losange', plural: 'les losanges' },
]

export const COLORS = [
  { id: 'orange', label: 'orange', plural: 'les oranges', hex: '#f3a98f' },
  { id: 'green', label: 'vert', plural: 'les verts', hex: '#9ecbaf' },
  { id: 'purple', label: 'violet', plural: 'les violets', hex: '#b8aae4' },
  { id: 'blue', label: 'bleu', plural: 'les bleus', hex: '#94bce8' },
]

const PATHS = {
  circle: <circle cx="32" cy="32" r="24" />,
  square: <rect x="10" y="10" width="44" height="44" rx="6" />,
  triangle: <path d="M32 7l26 48H6z" />,
  diamond: <path d="M32 5l25 27-25 27L7 32z" />,
}

export function ColoredShape({ shape, color, size = 56 }) {
  const tint = COLORS.find((item) => item.id === color)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <g fill={tint?.hex ?? '#ccc'} stroke="#5c5566" strokeWidth="3" strokeLinejoin="round">
        {PATHS[shape]}
      </g>
    </svg>
  )
}
