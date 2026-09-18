import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'digit-span',
  title: 'La suite de chiffres',
  tagline: 'Retenir une suite de chiffres, puis la retaper à l’endroit ou à l’envers.',
  category: 'executive-functions',
  cover,
  ages: '6 ans et plus',
  keywords: ['empan de chiffres', 'mémoire de travail', 'ordre inverse', 'attention'],
  objectives: [
    'Empan numérique direct et inverse',
    'Mémoire de travail verbale',
    'Maintien et manipulation d’une information en mémoire',
  ],
  materials: [
    'Augmenter la longueur d’un chiffre à chaque réussite permet d’estimer l’empan.',
    'La restitution se fait au pavé numérique, chiffre par chiffre, et la comparaison est détaillée.',
    'Variante : faire répéter la suite à voix haute pendant la mémorisation.',
  ],
  instructions:
    'La suite s’affiche pendant le temps choisi, puis disparaît. Le patient la retape dans le même ordre, ou à l’envers selon le réglage.',
  settings: [
    {
      id: 'length',
      type: 'number',
      label: 'Nombre de chiffres',
      hint: 'L’empan direct adulte se situe autour de six à sept chiffres.',
      min: 3,
      max: 10,
      default: 5,
    },
    {
      id: 'duration',
      type: 'number',
      label: 'Temps d’affichage',
      min: 3,
      max: 30,
      default: 8,
      unit: 'seconds',
    },
    {
      id: 'direction',
      type: 'choice',
      label: 'Sens de restitution',
      default: 'forward',
      options: [
        { id: 'forward', label: 'À l’endroit', hint: 'Empan direct.' },
        { id: 'backward', label: 'À l’envers', hint: 'Sollicite davantage la mémoire de travail.' },
      ],
    },

  ],
  component: lazy(() => import('./DigitSpan.jsx')),
}
