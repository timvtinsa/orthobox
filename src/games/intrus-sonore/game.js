import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'intrus-sonore',
  title: 'L’intrus sonore',
  tagline: 'Repérer le mot qui ne partage pas le son des autres.',
  category: 'langage-oral',
  cover,
  ages: '4 à 8 ans',
  duration: '5 min',
  keywords: ['phonologie', 'rime', 'attaque', 'discrimination auditive'],
  objectives: [
    'Conscience phonologique (attaque et rime)',
    'Discrimination auditive',
    'Attention sélective',
  ],
  materials: [
    'Faire répéter les mots à voix haute avant de répondre renforce le travail articulatoire.',
    'Le haut-parleur lit le mot si une voix française est installée sur le poste.',
  ],
  instructions:
    'Trois (ou quatre) mots partagent le même son de début ou la même rime : l’enfant désigne celui qui ne va pas avec les autres.',
  settings: [
    {
      id: 'critere',
      type: 'choice',
      label: 'Ce qu’on écoute',
      default: 'attaque',
      options: [
        { id: 'attaque', label: 'Son du début', hint: 'Le mot intrus ne commence pas comme les autres.' },
        { id: 'rime', label: 'Rime', hint: 'Le mot intrus ne rime pas avec les autres.' },
      ],
    },
    {
      id: 'propositions',
      type: 'number',
      label: 'Mots par question',
      hint: 'Trois pour commencer, davantage pour charger la comparaison.',
      min: 3,
      max: 5,
      default: 3,
    },
    { id: 'manches', type: 'number', label: 'Nombre de questions', min: 5, max: 20, default: 10 },
  ],
  component: lazy(() => import('./IntrusSonore.jsx')),
}
