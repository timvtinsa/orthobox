import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'riddles',
  title: 'Qui suis-je ?',
  tagline: 'Retrouver un mot à partir d’indices de plus en plus précis.',
  category: 'oral-language',
  cover,
  ages: '5 ans et plus',
  keywords: ['évocation', 'lexique', 'définition', 'manque du mot'],
  objectives: [
    'Évocation lexicale et accès au mot',
    'Compréhension orale de définitions',
    'Catégorisation sémantique',
  ],
  materials: [
    'Le thème choisit le champ lexical : animaux, objets du quotidien, lieux et métiers, ou les trois mélangés.',
    'Moins il faut d’indices, plus l’accès lexical est efficace : c’est l’observation utile ici.',
    'Variante expressive : inverser les rôles, c’est l’enfant qui fait deviner le mot.',
  ],
  instructions:
    'Les indices se dévoilent un par un, du plus général au plus précis. L’enfant répond à l’oral, le praticien indique si le mot a été trouvé.',
  settings: [
    {
      id: 'theme',
      type: 'choice',
      label: 'Thème',
      default: 'animals',
      options: [
        { id: 'animals', label: 'Animaux', hint: 'Vocabulaire concret.' },
        { id: 'objects', label: 'Objets', hint: 'Objets du quotidien.' },
        { id: 'places', label: 'Lieux, métiers', hint: 'Vocabulaire plus abstrait.' },
        { id: 'mixed', label: 'Mélange', hint: 'Les trois thèmes ensemble.' },
      ],
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de devinettes',
      min: 3,
      max: 12,
      default: 8,
    },

  ],
  component: lazy(() => import('./Riddles.jsx')),
}
