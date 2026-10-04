import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'week-days',
  title: 'Les jours de la semaine',
  tagline: 'Se repérer dans la semaine : hier, demain, après-demain, dans trois jours.',
  category: 'executive-functions',
  cover,
  ages: '6 ans et plus',
  keywords: ['jours', 'semaine', 'temps', 'repérage temporel', 'chaîne ordonnée'],
  objectives: [
    'Connaissance de la chaîne ordonnée des jours',
    'Repérage temporel : hier, demain, avant-hier, après-demain, dans quelques jours',
    'Calcul sur un cycle : demain d’un dimanche, c’est lundi',
  ],
  materials: [
    'La bande de la semaine montre le jour de départ : elle sert d’appui avant de calculer sans.',
    'Le niveau difficile compte plusieurs jours d’un coup, en passant d’une semaine à l’autre.',
    'Les mauvaises propositions reprennent l’erreur la plus fréquente : se tromper d’un jour.',
    'Variante : faire dire la réponse à voix haute avant de toucher, ou compter sur ses doigts.',
  ],
  instructions:
    'Une question porte sur les jours de la semaine. Le patient touche le bon jour parmi quatre propositions, avec ou sans la bande de la semaine pour l’aider.',
  settings: [
    {
      id: 'level',
      type: 'choice',
      label: 'Niveau',
      default: 'easy',
      options: [
        { id: 'easy', label: 'Facile', hint: 'Hier et demain.' },
        { id: 'medium', label: 'Moyen', hint: 'Avant-hier, après-demain, le jour entre deux jours.' },
        { id: 'hard', label: 'Difficile', hint: 'Dans plusieurs jours, il y a plusieurs jours, le rang dans la semaine.' },
      ],
    },
    {
      id: 'support',
      type: 'choice',
      label: 'Bande de la semaine',
      default: 'strip',
      options: [
        { id: 'strip', label: 'Affichée', hint: 'Appui visuel : la semaine et le jour de départ.' },
        { id: 'none', label: 'Masquée', hint: 'Sans appui.' },
      ],
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de questions',
      min: 4,
      max: 20,
      default: 10,
    },
  ],
  component: lazy(() => import('./WeekDays.jsx')),
}
