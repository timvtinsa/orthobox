import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'intrus-sonore',
  title: 'L’intrus sonore',
  tagline: 'Repérer le mot qui ne partage pas le son des autres.',
  category: 'langage-oral',
  cover,
  ages: '4 ans et plus',
  keywords: ['phonologie', 'rime', 'attaque', 'discrimination auditive'],
  objectives: [
    'Conscience phonologique, sur le début du mot ou sur la rime',
    'Discrimination auditive',
    'Attention sélective',
  ],
  materials: [
    'Le réglage « ce qu’on écoute » change la cible : le son du début, ou la rime.',
    'Augmenter le nombre de mots par question allonge la comparaison à tenir en mémoire.',
    'Le haut-parleur lit le mot si une voix française est installée sur le poste.',
  ],
  instructions:
    'Plusieurs mots partagent le même son de début, ou la même rime. Le patient désigne celui qui ne va pas avec les autres.',
  settings: [
    {
      id: 'critere',
      type: 'choice',
      label: 'Ce qu’on écoute',
      default: 'attaque',
      options: [
        { id: 'attaque', label: 'Son du début', hint: 'L’intrus ne commence pas comme les autres.' },
        { id: 'rime', label: 'Rime', hint: 'L’intrus ne rime pas avec les autres.' },
      ],
    },
    {
      id: 'propositions',
      type: 'number',
      label: 'Mots par question',
      hint: 'Trois mots pour commencer, davantage pour charger la comparaison.',
      min: 3,
      max: 5,
      default: 3,
    },
    {
      id: 'manches',
      type: 'number',
      label: 'Nombre de questions',
      min: 5,
      max: 20,
      default: 10,
    },

  ],
  component: lazy(() => import('./IntrusSonore.jsx')),
}
