import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'free-recall',
  title: 'Le rappel de liste',
  tagline: 'Mémoriser une liste de mots, puis la restituer de mémoire.',
  category: 'executive-functions',
  cover,
  ages: '7 ans et plus',
  keywords: ['rappel libre', 'empan', 'mémoire verbale', 'stratégie'],
  objectives: [
    'Rappel libre et empan verbal',
    'Stratégies d’encodage et de récupération',
    'Repérage des intrusions et des persévérations',
  ],
  materials: [
    'Le bilan sépare les mots retrouvés, les oublis et les mots ajoutés hors liste.',
    'L’orthographe et les accents ne sont pas pris en compte dans la comparaison.',
    'Trois modes de rappel : la saisie au clavier, un nuage de mots où le patient retrouve les bons parmi des leurres, ou l’oral, où le praticien valide au fur et à mesure sans rien taper.',
    'Variante : refaire un rappel différé en fin de séance, avec la même liste.',
  ],
  instructions:
    'La liste est affichée pendant le temps choisi, puis masquée. Le patient restitue les mots dont il se souvient, dans l’ordre qu’il veut, selon le mode de rappel choisi.',
  settings: [
    {
      id: 'count',
      type: 'number',
      label: 'Nombre de mots',
      hint: 'L’empan verbal adulte se situe autour de sept mots.',
      min: 3,
      max: 15,
      default: 7,
    },
    {
      id: 'duration',
      type: 'number',
      label: 'Temps de mémorisation',
      min: 5,
      max: 90,
      step: 5,
      default: 15,
      unit: 'seconds',
    },
    {
      id: 'mode',
      type: 'choice',
      label: 'Mode de rappel',
      default: 'text',
      options: [
        { id: 'text', label: 'Saisie', hint: 'Le praticien tape les mots dictés par le patient.' },
        { id: 'cloud', label: 'Nuage de mots', hint: 'Le patient retrouve les bons mots parmi des leurres.' },
        { id: 'oral', label: 'Oral', hint: 'Le praticien valide chaque mot entendu, sans rien saisir.' },
      ],
    },
  ],
  component: lazy(() => import('./FreeRecall.jsx')),
}
