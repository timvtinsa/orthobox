import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'clock-reading',
  title: 'Quelle heure est-il ?',
  tagline: 'Lire une horloge à aiguilles, puis choisir l’heure qu’elle indique.',
  category: 'math-cognition',
  cover,
  ages: '6 ans et plus',
  keywords: ['heure', 'horloge', 'temps', 'transcodage'],
  objectives: [
    'Lecture d’une horloge à aiguilles',
    'Distinction de la petite et de la grande aiguille',
    'Mise en mots d’une heure lue',
  ],
  materials: [
    'Les leurres reprennent les vraies erreurs : aiguilles inversées, heure voisine.',
    'Commencer aux heures pile, puis aux demies avant les quarts.',
    'Variante : faire montrer la petite aiguille avant de répondre.',
  ],
  instructions:
    'Une horloge à aiguilles est affichée. Le patient lit l’heure, puis touche la proposition qui correspond parmi quatre.',
  settings: [
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre d’horloges',
      min: 4,
      max: 20,
      default: 10,
    },
    {
      id: 'precision',
      type: 'choice',
      label: 'Précision',
      default: 'hour',
      options: [
        { id: 'hour', label: 'Heures', hint: 'Uniquement des heures pile.' },
        { id: 'half', label: 'Demies', hint: 'Heures pile et demies.' },
        { id: 'quarter', label: 'Quarts', hint: 'Quarts d’heure.' },
        { id: 'five', label: '5 min', hint: 'De cinq en cinq minutes.' },
      ],
    },
  ],
  component: lazy(() => import('./ClockReading.jsx')),
}
