import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'homophones',
  title: 'Les homophones',
  tagline: 'Choisir la bonne orthographe entre deux mots qui se prononcent pareil.',
  category: 'written-language',
  cover,
  ages: '7 ans et plus',
  keywords: ['homophones', 'orthographe', 'grammaire', 'a/à', 'et/est', 'on/ont'],
  objectives: [
    'Discrimination orthographique entre deux mots homophones',
    'Identification de la fonction grammaticale du mot dans la phrase',
    'Automatisation d’une règle plutôt que d’un mot par mot',
  ],
  materials: [
    'Six couples travaillés : a/à, et/est, on/ont, son/sont, ce/se, ces/ses.',
    'Le seul distracteur proposé est l’autre orthographe du couple : le choix porte sur la règle, jamais sur le vocabulaire.',
    'Cibler un seul couple à la fois pour une rééducation ciblée, ou les mélanger une fois chacun posé.',
  ],
  instructions:
    'Une phrase est affichée avec un mot manquant. Le patient choisit entre les deux orthographes possibles celle qui convient ici, puis la phrase se complète sous ses yeux.',
  settings: [
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de phrases',
      min: 4,
      max: 20,
      default: 10,
    },
    {
      id: 'pair',
      type: 'choice',
      label: 'Couple travaillé',
      default: 'mixed',
      options: [
        { id: 'mixed', label: 'Tous mélangés', hint: 'Les six couples, au hasard.' },
        { id: 'a-à', label: 'a / à' },
        { id: 'et-est', label: 'et / est' },
        { id: 'on-ont', label: 'on / ont' },
        { id: 'son-sont', label: 'son / sont' },
        { id: 'ce-se', label: 'ce / se' },
        { id: 'ces-ses', label: 'ces / ses' },
      ],
    },
  ],
  component: lazy(() => import('./Homophones.jsx')),
}
