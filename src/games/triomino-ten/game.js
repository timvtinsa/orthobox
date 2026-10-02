import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'triomino-ten',
  title: 'Le triomino du 10',
  tagline: 'Coller deux triangles dont les chiffres qui se touchent font dix.',
  category: 'math-cognition',
  cover,
  ages: '6 ans et plus',
  keywords: ['complément à dix', 'calcul', 'triomino', 'appariement'],
  objectives: [
    'Compléments à dix',
    'Fait numérique : reconnaître d’un coup d’œil ce qui fait dix',
    'Attention soutenue sur une mosaïque qui s’étend dans toutes les directions',
  ],
  materials: [
    'Chaque triangle est divisé en trois, un chiffre par tiers ; seul le tiers qui touche la mosaïque compte à chaque pose.',
    'Un seul des triangles proposés complète correctement l’emplacement en pointillé : les autres font un total différent de dix.',
    'La mosaïque peut grandir d’un côté, de l’autre ou au-dessus et en dessous : le prochain emplacement n’est jamais toujours au même endroit.',
    'Variante : faire annoncer le calcul à voix haute avant de faire glisser le triangle.',
  ],
  instructions:
    'Une mosaïque de triangles grandit peu à peu, dans toutes les directions. Un emplacement en pointillé montre où poser le prochain : il faut faire glisser, parmi plusieurs triangles proposés, celui dont le chiffre complète le tiers du voisin pour faire dix.',
  settings: [
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de triangles',
      min: 4,
      max: 20,
      default: 10,
    },
    {
      id: 'options',
      type: 'choice',
      label: 'Triangles proposés',
      default: 'three',
      options: [
        { id: 'three', label: '3', hint: 'Deux intrus, un seul triangle qui fait dix.' },
        { id: 'four', label: '4', hint: 'Trois intrus, un seul triangle qui fait dix.' },
      ],
    },
  ],
  component: lazy(() => import('./TriominoTen.jsx')),
}
