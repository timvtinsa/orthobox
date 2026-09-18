import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'sentence-order',
  title: 'La phrase mélangée',
  tagline: 'Remettre les mots d’une phrase dans le bon ordre.',
  category: 'written-language',
  cover,
  ages: '6 ans et plus',
  keywords: ['syntaxe', 'ordre des mots', 'construction de phrase', 'lecture'],
  objectives: [
    'Conscience syntaxique et ordre des mots',
    'Construction de la phrase simple',
    'Mémoire de travail verbale',
  ],
  materials: [
    'Le nombre de mots par phrase fixe la difficulté : quatre pour commencer, six pour charger la mémoire de travail.',
    'Un clic sur un mot déjà placé le retire, comme pour « Le mot en morceaux ».',
    'Variante : faire lire la phrase reconstituée à voix haute avant de valider.',
  ],
  instructions:
    'Les mots d’une phrase sont présentés dans le désordre, sans majuscule ni ponctuation pour ne rien laisser deviner. Le patient les remet dans l’ordre pour reformer une phrase qui a du sens.',
  settings: [
    {
      id: 'words',
      type: 'choice',
      label: 'Mots par phrase',
      default: 'four',
      options: [
        { id: 'four', label: '4', hint: 'Phrases courtes, sujet-verbe-complément.' },
        { id: 'five', label: '5', hint: 'Une expansion de plus à replacer.' },
        { id: 'six', label: '6', hint: 'Phrases plus longues, avec un adjectif ou un groupe prépositionnel.' },
      ],
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de phrases',
      min: 4,
      max: 20,
      default: 8,
    },
  ],
  component: lazy(() => import('./SentenceOrder.jsx')),
}
