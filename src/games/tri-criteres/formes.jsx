/** Formes géométriques colorées à trier : quatre formes, quatre couleurs. */
export const FORMES = [
  { id: 'rond', label: 'rond', pluriel: 'les ronds' },
  { id: 'carre', label: 'carré', pluriel: 'les carrés' },
  { id: 'triangle', label: 'triangle', pluriel: 'les triangles' },
  { id: 'losange', label: 'losange', pluriel: 'les losanges' },
]

export const COULEURS = [
  { id: 'orange', label: 'orange', pluriel: 'les oranges', hex: '#f3a98f' },
  { id: 'vert', label: 'vert', pluriel: 'les verts', hex: '#9ecbaf' },
  { id: 'violet', label: 'violet', pluriel: 'les violets', hex: '#b8aae4' },
  { id: 'bleu', label: 'bleu', pluriel: 'les bleus', hex: '#94bce8' },
]

const TRACES = {
  rond: <circle cx="32" cy="32" r="24" />,
  carre: <rect x="10" y="10" width="44" height="44" rx="6" />,
  triangle: <path d="M32 7l26 48H6z" />,
  losange: <path d="M32 5l25 27-25 27L7 32z" />,
}

export function FormeColoree({ forme, couleur, size = 56 }) {
  const teinte = COULEURS.find((item) => item.id === couleur)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <g fill={teinte?.hex ?? '#ccc'} stroke="#5c5566" strokeWidth="3" strokeLinejoin="round">
        {TRACES[forme]}
      </g>
    </svg>
  )
}
