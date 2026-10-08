import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'seasons',
  title: 'Les quatre saisons',
  tagline: 'Printemps, été, automne, hiver : paysages, objets, mois et indices.',
  category: 'oral-language',
  cover,
  ages: '5 ans et plus',
  keywords: ['saisons', 'mois', 'temps', 'lexique', 'compréhension', 'chaîne ordonnée'],
  objectives: [
    'Associer un paysage ou un objet à la saison où on le rencontre',
    'Lexique des saisons : comprendre un indice et nommer la saison qui lui correspond',
    'Lien entre les mois de l’année et les saisons',
  ],
  materials: [
    'Les saisons suivent le calendrier de l’école : le printemps commence en mars, l’été en juin, l’automne en septembre, l’hiver en décembre.',
    'Les quatre saisons sont toujours proposées. Les images ne portent aucun mot : le patient peut nommer l’objet ou décrire le paysage avant de répondre.',
    'Variante : faire décrire à voix haute un paysage, un vêtement ou une activité de la saison trouvée.',
  ],
  instructions:
    'Une image, un indice ou un mois est présenté. Le patient touche la saison qui lui correspond parmi les quatre.',
  // The setting the end screen moves one notch when the series was very well
  // or poorly answered (see src/lib/progression.js).
  progression: { setting: 'level' },
  settings: [
    {
      id: 'level',
      type: 'choice',
      label: 'Niveau',
      default: 'easy',
      options: [
        { id: 'easy', label: 'Facile', hint: 'Un paysage ou un objet à associer à sa saison.' },
        { id: 'medium', label: 'Moyen', hint: 'Avec en plus des indices à comprendre.' },
        { id: 'hard', label: 'Difficile', hint: 'Avec en plus les mois de l’année.' },
      ],
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de questions',
      min: 4,
      max: 20,
      default: 10,
    },
  ],
  component: lazy(() => import('./Seasons.jsx')),
}
