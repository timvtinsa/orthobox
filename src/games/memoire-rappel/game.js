import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'memoire-rappel',
  title: 'Le rappel de liste',
  tagline: 'Mémoriser une liste de mots, puis la restituer de mémoire.',
  category: 'fonctions-executives',
  cover,
  ages: '7 ans et +',
  duration: '5 min',
  keywords: ['rappel libre', 'empan', 'mémoire verbale', 'stratégie'],
  objectives: [
    'Rappel libre et empan verbal',
    'Stratégies d’encodage et de récupération',
    'Repérage des intrusions et des persévérations',
  ],
  materials: [
    'Nombre de mots et temps de mémorisation réglables avant la partie.',
    'Le bilan sépare les mots retrouvés, les oublis et les mots ajoutés hors liste (intrusions).',
    'Variante : refaire un rappel différé en fin de séance, avec la même liste.',
  ],
  instructions:
    'La liste est affichée pendant le temps choisi, puis masquée. Le patient restitue les mots dont il se souvient, dans l’ordre qu’il veut ; le praticien les saisit au fur et à mesure.',
  settings: [
    {
      id: 'nombre',
      type: 'number',
      label: 'Nombre de mots',
      hint: 'Repère : l’empan verbal adulte se situe autour de 7 mots.',
      min: 3,
      max: 15,
      default: 7,
    },
    {
      id: 'duree',
      type: 'number',
      label: 'Temps de mémorisation',
      min: 5,
      max: 90,
      step: 5,
      default: 15,
      suffix: 's',
    },
  ],
  component: lazy(() => import('./MemoireRappel.jsx')),
}
