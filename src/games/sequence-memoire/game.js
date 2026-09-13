import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'sequence-memoire',
  title: 'La suite lumineuse',
  tagline: 'Mémoriser une suite de cases, puis la reproduire — à l’endroit ou à l’envers.',
  category: 'fonctions-executives',
  cover,
  ages: '5 ans et +',
  duration: '5 min',
  keywords: ['empan', 'mémoire de travail', 'séquence', 'attention visuelle'],
  objectives: [
    'Mémoire de travail visuo-spatiale',
    'Empan direct et empan inverse',
    'Attention visuelle soutenue',
  ],
  materials: [
    'La suite s’allonge d’un élément à chaque réussite : l’empan atteint est affiché en fin de partie.',
    'Variante : faire verbaliser la suite (« en haut, à gauche… ») pour soutenir la mémorisation.',
  ],
  instructions:
    'Les cases s’allument l’une après l’autre. L’enfant reproduit la suite en cliquant dans le même ordre — ou dans l’ordre inverse au niveau correspondant, ce qui sollicite davantage la mémoire de travail.',
  levels: [
    { id: 'direct-4', label: '4 cases', hint: 'Ordre direct' },
    { id: 'direct-9', label: '9 cases', hint: 'Grille plus grande' },
    { id: 'inverse-4', label: 'Ordre inverse', hint: 'Empan inverse, 4 cases' },
  ],
  component: lazy(() => import('./SequenceMemoire.jsx')),
}
