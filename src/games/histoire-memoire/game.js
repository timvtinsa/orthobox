import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'histoire-memoire',
  title: 'L’histoire et les détails',
  tagline: 'Lire une petite histoire, puis répondre à des questions sur ses détails.',
  category: 'langage-ecrit',
  cover,
  ages: '8 ans et +',
  duration: '5 à 10 min',
  keywords: ['compréhension', 'lecture', 'mémoire de texte', 'QCM', 'détails'],
  objectives: [
    'Compréhension fine d’un texte narratif',
    'Mémorisation des détails (noms, nombres, lieux, moments)',
    'Repérage des informations explicites',
  ],
  materials: [
    'Six histoires, deux par longueur : le texte n’est plus visible pendant les questions.',
    'L’ordre des propositions change à chaque passation.',
    'Variante orale : lire le texte au patient, ou utiliser la lecture vocale, pour travailler la compréhension orale.',
    'Variante différée : poser les questions en fin de séance plutôt qu’immédiatement.',
  ],
  instructions:
    'Le patient lit l’histoire à son rythme, puis passe aux questions à choix multiple. Chaque réponse est corrigée immédiatement ; le texte reste masqué jusqu’au bilan.',
  levels: [
    { id: 'court', label: 'Texte court', hint: '~65 mots, 5 questions' },
    { id: 'moyen', label: 'Texte moyen', hint: '~120 mots, 6 questions' },
    { id: 'long', label: 'Texte long', hint: '~180 mots, 7 questions' },
  ],
  component: lazy(() => import('./HistoireMemoire.jsx')),
}
