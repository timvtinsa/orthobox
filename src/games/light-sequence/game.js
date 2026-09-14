import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'light-sequence',
  title: 'La suite lumineuse',
  tagline: 'Mémoriser une suite de cases, puis la reproduire à l’endroit ou à l’envers.',
  category: 'executive-functions',
  cover,
  ages: '5 ans et plus',
  keywords: ['empan', 'mémoire de travail', 'séquence', 'attention visuelle'],
  objectives: [
    'Mémoire de travail visuo-spatiale',
    'Empan direct et empan inverse',
    'Attention visuelle soutenue',
  ],
  materials: [
    'La suite s’allonge d’un élément à chaque réussite, et l’empan atteint est affiché en fin de partie.',
    'La taille de la grille et la longueur de départ se règlent séparément.',
    'Variante : faire verbaliser la suite, « en haut, à gauche », pour soutenir la mémorisation.',
  ],
  instructions:
    'Les cases s’allument l’une après l’autre. L’enfant reproduit la suite en cliquant dans le même ordre, ou dans l’ordre inverse selon le réglage.',
  settings: [
    {
      id: 'cells',
      type: 'choice',
      label: 'Grille',
      default: '4',
      options: [
        { id: '4', label: '4 cases', hint: 'Grille de 2 sur 2.' },
        { id: '6', label: '6 cases', hint: 'Grille de 3 sur 2.' },
        { id: '9', label: '9 cases', hint: 'Grille de 3 sur 3.' },
      ],
    },
    {
      id: 'direction',
      type: 'choice',
      label: 'Sens de restitution',
      default: 'forward',
      options: [
        { id: 'forward', label: 'À l’endroit', hint: 'Empan direct.' },
        { id: 'backward', label: 'À l’envers', hint: 'Empan inverse, plus exigeant.' },
      ],
    },
    {
      id: 'start',
      type: 'number',
      label: 'Longueur de départ',
      hint: 'La suite s’allonge ensuite à chaque réussite.',
      min: 2,
      max: 6,
      default: 2,
    },

  ],
  component: lazy(() => import('./LightSequence.jsx')),
}
