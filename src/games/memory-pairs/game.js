import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'memory-pairs',
  title: 'Le jeu des paires',
  tagline: 'Retrouver les paires d’images cachées, en retenant leur position.',
  category: 'executive-functions',
  cover,
  ages: '4 ans et plus',
  keywords: ['memory', 'paires', 'mémoire visuo-spatiale', 'attention'],
  objectives: [
    'Mémoire visuo-spatiale',
    'Attention soutenue et repérage dans l’espace',
    'Stratégie d’exploration, retourner méthodiquement plutôt qu’au hasard',
  ],
  materials: [
    'Trois niveaux : 3, 6 ou 10 paires, soit 6 à 20 cartes.',
    'Le temps d’observation d’une paire ratée se règle, l’allonger soutient l’encodage.',
    'Le bilan donne le nombre d’essais, à comparer au minimum théorique.',
  ],
  instructions:
    'Les cartes sont face cachée. Le patient en retourne deux : si elles vont ensemble elles restent visibles, sinon elles se retournent après le temps d’observation choisi.',
  settings: [
    {
      id: 'level',
      type: 'choice',
      label: 'Niveau',
      default: 'easy',
      options: [
        { id: 'easy', label: 'Facile', hint: '3 paires, soit 6 cartes.' },
        { id: 'medium', label: 'Moyen', hint: '6 paires, soit 12 cartes.' },
        { id: 'hard', label: 'Difficile', hint: '10 paires, soit 20 cartes.' },
      ],
    },
    {
      id: 'reveal',
      type: 'number',
      label: 'Temps d’observation',
      hint: 'Durée d’affichage d’une paire ratée avant qu’elle se retourne.',
      min: 5,
      max: 40,
      step: 5,
      default: 15,
      unit: 'tenths',
    },

  ],
  component: lazy(() => import('./MemoryPairs.jsx')),
}
