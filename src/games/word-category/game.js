import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'word-category',
  title: 'L’intrus de la famille',
  tagline: 'Repérer le mot qui n’appartient pas à la même famille que les autres.',
  category: 'oral-language',
  cover,
  ages: '4 ans et plus',
  keywords: ['lexique', 'catégorisation', 'sémantique', 'intrus'],
  objectives: [
    'Catégorisation sémantique',
    'Accès au lexique et aux traits communs',
    'Justification d’un choix à l’oral',
  ],
  materials: [
    'Nommer la famille à l’avance transforme la recherche en vérification.',
    'Les familles sont assez éloignées pour qu’aucun mot n’appartienne aux deux.',
    'Variante : demander pourquoi, la justification vaut autant que le choix.',
  ],
  instructions:
    'Plusieurs mots d’une même famille sont proposés, avec un mot venu d’une autre famille. Le patient touche l’intrus, puis explique ce que les autres ont en commun.',
  settings: [
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de séries',
      min: 4,
      max: 20,
      default: 10,
    },
    {
      id: 'size',
      type: 'choice',
      label: 'Mots par série',
      default: 'four',
      options: [
        { id: 'four', label: '4', hint: 'Trois mots de la famille, un intrus.' },
        { id: 'five', label: '5', hint: 'Quatre mots de la famille, un intrus.' },
      ],
    },
    {
      id: 'clue',
      type: 'choice',
      label: 'Famille annoncée',
      default: 'hidden',
      options: [
        { id: 'hidden', label: 'Non', hint: 'Il faut trouver le lien tout seul.' },
        { id: 'named', label: 'Oui', hint: 'La consigne nomme la famille.' },
      ],
    },
  ],
  component: lazy(() => import('./WordCategory.jsx')),
}
