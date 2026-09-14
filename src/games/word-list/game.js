import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'word-list',
  title: 'La liste de mots',
  tagline: 'Mémoriser une liste, puis reconnaître les mots parmi des mots nouveaux.',
  category: 'executive-functions',
  cover,
  ages: '7 ans et plus',
  keywords: ['mémoire verbale', 'reconnaissance', 'empan', 'apprentissage'],
  objectives: [
    'Mémoire épisodique verbale',
    'Reconnaissance et rejet des mots nouveaux',
    'Stratégies d’encodage : répétition, catégorisation',
  ],
  materials: [
    'Le test propose autant de mots nouveaux que de mots de la liste.',
    'Le bilan distingue les mots non reconnus des mots nouveaux pris à tort pour des mots de la liste.',
    'Variante : demander quelle stratégie a été utilisée pour retenir la liste.',
  ],
  instructions:
    'La liste est affichée pendant le temps choisi, puis les mots défilent un par un, mélangés à des mots nouveaux. Pour chacun, le patient dit s’il figurait dans la liste.',
  settings: [
    {
      id: 'count',
      type: 'number',
      label: 'Nombre de mots',
      hint: 'Cinq à sept mots pour commencer.',
      min: 3,
      max: 12,
      default: 7,
    },
    {
      id: 'duration',
      type: 'number',
      label: 'Temps de mémorisation',
      hint: 'Le patient peut aussi passer au test dès qu’il se sent prêt.',
      min: 5,
      max: 60,
      step: 5,
      default: 10,
      unit: 'seconds',
    },

  ],
  component: lazy(() => import('./WordList.jsx')),
}
