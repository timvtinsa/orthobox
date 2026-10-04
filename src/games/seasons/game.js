import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'seasons',
  title: 'Les quatre saisons',
  tagline: 'Printemps, été, automne, hiver : leur ordre, leurs mois, ce qu’on y voit.',
  category: 'oral-language',
  cover,
  ages: '5 ans et plus',
  keywords: ['saisons', 'mois', 'temps', 'lexique', 'compréhension', 'chaîne ordonnée'],
  objectives: [
    'Connaissance de l’ordre des saisons et de leur retour en cycle',
    'Lexique des saisons : comprendre un indice et nommer la saison qui lui correspond',
    'Lien entre les mois de l’année et les saisons',
  ],
  materials: [
    'Les saisons suivent le calendrier de l’école : le printemps commence en mars, l’été en juin, l’automne en septembre, l’hiver en décembre.',
    'Les quatre saisons sont toujours proposées ; la bande du cycle montre la saison de départ.',
    'Variante : faire décrire à voix haute un paysage, un vêtement ou une activité de la saison trouvée.',
  ],
  instructions:
    'Une question porte sur les saisons : leur ordre, un mois ou un indice à reconnaître. Le patient touche la bonne saison, avec ou sans la bande du cycle pour l’aider.',
  settings: [
    {
      id: 'level',
      type: 'choice',
      label: 'Niveau',
      default: 'easy',
      options: [
        { id: 'easy', label: 'Facile', hint: 'La saison d’avant ou d’après, et reconnaître une saison à un indice.' },
        { id: 'medium', label: 'Moyen', hint: 'Avec en plus les mois et la saison entre deux saisons.' },
        { id: 'hard', label: 'Difficile', hint: 'Compter deux ou trois saisons, avant ou après.' },
      ],
    },
    {
      id: 'support',
      type: 'choice',
      label: 'Bande du cycle',
      default: 'strip',
      options: [
        { id: 'strip', label: 'Affichée', hint: 'Appui visuel : les quatre saisons et la saison de départ.' },
        { id: 'none', label: 'Masquée', hint: 'Sans appui.' },
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
