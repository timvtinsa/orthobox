import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'scrambled-syllables',
  title: 'Le mot en morceaux',
  tagline: 'Reconstruire un mot à partir de ses syllabes mélangées.',
  category: 'written-language',
  cover,
  ages: '6 ans et plus',
  keywords: ['syllabe', 'lecture', 'assemblage', 'combinatoire'],
  objectives: [
    'Conscience syllabique écrite',
    'Assemblage et ordre des syllabes',
    'Mémoire de travail verbale',
  ],
  materials: [
    'Le nombre de syllabes par mot fixe la difficulté : deux pour les mots courts, quatre pour les mots longs.',
    'Un clic sur une syllabe déjà placée la retire.',
    'Variante : faire lire chaque syllabe à voix haute avant de la placer.',
  ],
  instructions:
    'Les syllabes du mot sont présentées dans le désordre. L’enfant les remet dans l’ordre pour reformer le mot.',
  settings: [
    {
      id: 'syllables',
      type: 'number',
      label: 'Syllabes par mot',
      hint: 'Deux syllabes pour les mots courts, quatre pour les mots longs.',
      min: 2,
      max: 4,
      default: 2,
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de mots',
      min: 4,
      max: 16,
      default: 8,
    },

  ],
  component: lazy(() => import('./ScrambledSyllables.jsx')),
}
