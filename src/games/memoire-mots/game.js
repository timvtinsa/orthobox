import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'memoire-mots',
  title: 'La liste de mots',
  tagline: 'Mémoriser une liste, puis reconnaître les mots parmi des mots nouveaux.',
  category: 'fonctions-executives',
  cover,
  ages: '7 ans et +',
  duration: '5 min',
  keywords: ['mémoire verbale', 'reconnaissance', 'empan', 'apprentissage'],
  objectives: [
    'Mémoire épisodique verbale',
    'Reconnaissance et discrimination des faux souvenirs',
    'Stratégies d’encodage (répétition, catégorisation)',
  ],
  materials: [
    'Le nombre de mots et le temps de mémorisation se règlent avant de lancer la partie.',
    'Le bilan distingue les mots non reconnus des mots nouveaux pris à tort pour des mots de la liste.',
    'Variante : demander quelle stratégie a été utilisée pour retenir la liste.',
  ],
  instructions:
    'Une liste de mots est affichée pendant le temps choisi. Ensuite, les mots défilent un par un, mélangés à autant de mots nouveaux : pour chacun, le patient dit s’il figurait dans la liste.',
  levels: [],
  component: lazy(() => import('./MemoireMots.jsx')),
}
