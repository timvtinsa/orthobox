import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'syllabes-melangees',
  title: 'Le mot en morceaux',
  tagline: 'Reconstruire un mot à partir de ses syllabes mélangées.',
  category: 'langage-ecrit',
  cover,
  ages: '6 ans et +',
  duration: '5 min',
  keywords: ['syllabe', 'lecture', 'assemblage', 'combinatoire'],
  objectives: [
    'Conscience syllabique écrite',
    'Assemblage et ordre des syllabes',
    'Mémoire de travail verbale',
  ],
  materials: [
    'Variante : faire lire chaque syllabe à voix haute avant de la placer.',
    'Variante écrite : recopier le mot reconstruit sur l’ardoise.',
  ],
  instructions:
    'Les syllabes du mot sont présentées dans le désordre. L’enfant les remet dans l’ordre ; un clic sur une syllabe déjà placée la retire.',
  settings: [
    {
      id: 'syllabes',
      type: 'number',
      label: 'Syllabes par mot',
      hint: 'Deux syllabes pour les mots courts, quatre pour les mots longs.',
      min: 2,
      max: 4,
      default: 2,
    },
    { id: 'manches', type: 'number', label: 'Nombre de mots', min: 4, max: 16, default: 8 },
  ],
  component: lazy(() => import('./SyllabesMelangees.jsx')),
}
