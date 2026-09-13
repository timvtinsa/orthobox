import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'phrase-a-trous',
  title: 'La phrase à trous',
  tagline: 'Choisir le mot qui manque pour que la phrase soit juste.',
  category: 'langage-ecrit',
  cover,
  ages: '7 ans et plus',
  keywords: ['closure', 'compréhension écrite', 'grammaire', 'accord', 'vocabulaire'],
  objectives: [
    'Compréhension écrite au niveau de la phrase',
    'Maîtrise des mots de liaison et des pronoms relatifs',
    'Accords en genre, en nombre et avec le participe passé',
  ],
  materials: [
    'Trois séries : le sens de la phrase, les mots de liaison, les accords.',
    'Chaque phrase n’admet qu’une seule réponse correcte, les autres propositions existent mais ne conviennent pas ici.',
    'La phrase complète peut être relue à voix haute après correction.',
  ],
  instructions:
    'Une phrase est affichée avec un mot manquant. Le patient choisit parmi quatre propositions celle qui convient, et la phrase se complète sous ses yeux.',
  settings: [
    {
      id: 'serie',
      type: 'choice',
      label: 'Série',
      default: 'sens',
      options: [
        { id: 'sens', label: 'Sens de la phrase', hint: 'Le mot attendu est un mot de vocabulaire.' },
        { id: 'grammaire', label: 'Mots de liaison', hint: 'Pronoms relatifs, prépositions, conjonctions.' },
        { id: 'accord', label: 'Accords', hint: 'Terminaisons des verbes et des adjectifs.' },
      ],
    },
    {
      id: 'manches',
      type: 'number',
      label: 'Nombre de phrases',
      min: 4,
      max: 10,
      default: 8,
    },

  ],
  component: lazy(() => import('./PhraseATrous.jsx')),
}
