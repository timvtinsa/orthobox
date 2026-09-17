import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'number-bonds',
  title: 'Le compte est bon',
  tagline: 'Trouver ce qu’il manque pour atteindre le nombre visé.',
  category: 'math-cognition',
  cover,
  ages: '6 ans et plus',
  keywords: ['complément', 'décomposition', 'calcul', 'dizaine'],
  objectives: [
    'Compléments à dix, à vingt et à cent',
    'Décomposition additive d’un nombre',
    'Passage du comptage au fait numérique',
  ],
  materials: [
    'La grille de dix donne à voir le complément avant de le calculer.',
    'Le terme manquant est l’inconnue : ce n’est pas la même tâche qu’une addition posée.',
    'Variante : faire dire la décomposition à voix haute avant de choisir.',
  ],
  instructions:
    'Un nombre est donné, et le total à atteindre. Le patient choisit, parmi quatre propositions, le nombre qui complète exactement le compte.',
  settings: [
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de calculs',
      min: 4,
      max: 20,
      default: 10,
    },
    {
      id: 'target',
      type: 'choice',
      label: 'Compte à atteindre',
      default: 'ten',
      options: [
        { id: 'ten', label: '10', hint: 'Les compléments à dix.' },
        { id: 'twenty', label: '20', hint: 'Franchissement de la dizaine.' },
        { id: 'hundred', label: '100', hint: 'Compléments à cent, de cinq en cinq.' },
      ],
    },
    {
      id: 'support',
      type: 'choice',
      label: 'Grille de dix',
      default: 'frame',
      options: [
        { id: 'frame', label: 'Affichée', hint: 'Appui visuel, pour le compte à dix.' },
        { id: 'none', label: 'Masquée', hint: 'Calcul sans appui.' },
      ],
    },
  ],
  component: lazy(() => import('./NumberBonds.jsx')),
}
