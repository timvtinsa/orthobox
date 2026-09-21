import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'domino-image',
  title: 'Le domino des images',
  tagline: 'Prolonger une chaîne de dominos en retrouvant l’image qui continue la suite.',
  category: 'executive-functions',
  cover,
  ages: '4 ans et plus',
  keywords: ['discrimination visuelle', 'attention', 'appariement', 'images'],
  objectives: [
    'Discrimination visuelle et appariement d’images identiques',
    'Attention soutenue sur une chaîne qui s’allonge',
    'Nommer l’image à voix haute renforce l’évocation lexicale',
  ],
  materials: [
    'Chaque domino porte deux images ; seul celui qui reprend l’image ouverte de la chaîne peut être posé.',
    'Le nombre de dominos proposés fixe la difficulté : plus il y en a, plus le choix demande d’attention.',
    'Variante : faire nommer les deux images de chaque domino avant de répondre.',
  ],
  instructions:
    'Une chaîne de dominos illustrés est affichée. Parmi plusieurs dominos proposés, un seul porte une image identique à celle qui termine la chaîne : c’est celui-là qu’il faut toucher pour prolonger la suite.',
  settings: [
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de dominos',
      min: 4,
      max: 20,
      default: 10,
    },
    {
      id: 'options',
      type: 'choice',
      label: 'Dominos proposés',
      default: 'three',
      options: [
        { id: 'three', label: '3', hint: 'Deux intrus, un seul domino qui continue la chaîne.' },
        { id: 'four', label: '4', hint: 'Trois intrus, un seul domino qui continue la chaîne.' },
      ],
    },
  ],
  component: lazy(() => import('./DominoImage.jsx')),
}
