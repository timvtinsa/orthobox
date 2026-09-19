import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'story-details',
  title: 'L’histoire et les détails',
  tagline: 'Lire une petite histoire, puis répondre à des questions sur ses détails.',
  category: 'written-language',
  cover,
  ages: '8 ans et plus',
  keywords: ['compréhension', 'lecture', 'mémoire de texte', 'questions', 'détails'],
  objectives: [
    'Compréhension fine d’un texte narratif',
    'Mémorisation des détails : noms, nombres, lieux, moments',
    'Repérage des informations explicites',
  ],
  materials: [
    'Neuf histoires, trois par longueur. Le texte n’est plus visible pendant les questions.',
    'L’ordre des propositions change à chaque passation.',
    'Variante orale : lire le texte au patient, ou utiliser la lecture vocale, pour travailler la compréhension orale.',
    'Variante différée : poser les questions en fin de séance plutôt qu’immédiatement.',
  ],
  instructions:
    'Le patient lit l’histoire à son rythme, puis répond aux questions à choix multiple. Chaque réponse est corrigée immédiatement.',
  settings: [
    {
      id: 'length',
      type: 'choice',
      label: 'Longueur du texte',
      default: 'short',
      options: [
        { id: 'short', label: 'Court', hint: 'Environ 65 mots, 5 questions.' },
        { id: 'medium', label: 'Moyen', hint: 'Environ 120 mots, 6 questions.' },
        { id: 'long', label: 'Long', hint: 'Environ 180 mots, 7 questions.' },
      ],
    },

  ],
  component: lazy(() => import('./StoryDetails.jsx')),
}
