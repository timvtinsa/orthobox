import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'letter-discrimination',
  title: 'La bonne lettre',
  tagline: 'Retrouver une lettre au milieu de celles qu’on lui confond.',
  category: 'written-language',
  cover,
  ages: '5 ans et plus',
  keywords: ['lettres', 'discrimination visuelle', 'miroir', 'b d p q'],
  objectives: [
    'Discrimination visuelle des lettres en miroir',
    'Stabilisation de l’orientation gauche droite',
    'Balayage visuel d’une rangée',
  ],
  materials: [
    'Les miroirs b d p q sont ce qui retient un lecteur le plus longtemps.',
    'Les rotations n u et m w se travaillent séparément des miroirs.',
    'Variante : faire tracer la lettre en l’air avant de la chercher.',
  ],
  instructions:
    'Une lettre est affichée en grand, puis une rangée de lettres proches. Le patient touche celle qui correspond à la lettre affichée.',
  settings: [
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de lettres',
      min: 4,
      max: 24,
      default: 12,
    },
    {
      id: 'size',
      type: 'number',
      label: 'Lettres par rangée',
      hint: 'Quatre pour commencer, six pour un balayage plus large.',
      min: 3,
      max: 6,
      default: 4,
    },
    {
      id: 'family',
      type: 'choice',
      label: 'Confusions',
      default: 'mirrors',
      options: [
        { id: 'mirrors', label: 'Miroirs', hint: 'b, d, p et q.' },
        { id: 'rotations', label: 'Rotations', hint: 'n et u, m et w.' },
        { id: 'mixed', label: 'Les deux', hint: 'Miroirs et rotations mélangés.' },
      ],
    },
  ],
  component: lazy(() => import('./LetterDiscrimination.jsx')),
}
