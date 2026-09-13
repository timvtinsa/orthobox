import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'devinettes',
  title: 'Qui suis-je ?',
  tagline: 'Retrouver un mot à partir d’indices de plus en plus précis.',
  category: 'langage-oral',
  cover,
  ages: '5 ans et +',
  duration: '5 à 10 min',
  keywords: ['évocation', 'lexique', 'définition', 'manque du mot'],
  objectives: [
    'Évocation lexicale et accès au mot',
    'Compréhension orale de définitions',
    'Catégorisation sémantique',
  ],
  materials: [
    'Variante expressive : inverser les rôles, c’est l’enfant qui fait deviner le mot.',
    'Variante écrite : faire écrire le mot trouvé avant de passer au suivant.',
  ],
  instructions:
    'Les indices se dévoilent un par un. L’enfant répond à l’oral ; le praticien indique si le mot a été trouvé. Moins il faut d’indices, plus l’accès lexical est efficace.',
  levels: [
    { id: 'animaux', label: 'Animaux', hint: 'Vocabulaire concret' },
    { id: 'objets', label: 'Objets', hint: 'Objets du quotidien' },
    { id: 'monde', label: 'Lieux et métiers', hint: 'Vocabulaire plus abstrait' },
    { id: 'melange', label: 'Mélange', hint: 'Tous les thèmes' },
  ],
  component: lazy(() => import('./Devinettes.jsx')),
}
