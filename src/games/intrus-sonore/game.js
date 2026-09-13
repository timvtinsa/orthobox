import { lazy } from 'react'

export default {
  id: 'intrus-sonore',
  title: 'L’intrus sonore',
  tagline: 'Repérer le mot qui ne partage pas le son des autres.',
  category: 'langage-oral',
  icon: '👂',
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
  levels: [
    { id: 'attaque-3', label: 'Son initial · 3 mots', hint: 'Entrée en matière' },
    { id: 'attaque-4', label: 'Son initial · 4 mots', hint: 'Plus de choix à comparer' },
    { id: 'rime-4', label: 'Rime · 4 mots', hint: 'Attention portée sur la fin du mot' },
  ],
  component: lazy(() => import('./IntrusSonore.jsx')),
}
