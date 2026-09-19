import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'opposites',
  title: 'Le contraire',
  tagline: 'Trouver le mot de sens contraire, parmi quatre propositions.',
  category: 'oral-language',
  cover,
  ages: '5 ans et plus',
  keywords: ['antonymes', 'lexique', 'relations de sens', 'évocation'],
  objectives: [
    'Relations de sens : antonymie',
    'Accès au lexique par un chemin différent de la définition',
    'Justification d’un choix à l’oral',
  ],
  materials: [
    'Chaque mot n’a qu’un seul contraire possible dans la banque, pour que rien ne se discute.',
    'Le sens du mot proposé (adjectif, verbe, nom) varie d’un tour à l’autre.',
    'Variante : demander une phrase avec le mot et son contraire.',
  ],
  instructions:
    'Un mot est proposé, écrit et prononçable par le bouton d’écoute. Le patient touche celui des quatre mots qui veut dire le contraire.',
  settings: [
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de mots',
      min: 4,
      max: 20,
      default: 10,
    },
  ],
  component: lazy(() => import('./Opposites.jsx')),
}
