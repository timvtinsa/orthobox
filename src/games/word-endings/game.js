import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'word-endings',
  title: 'Les terminaisons',
  tagline: 'Choisir la bonne terminaison des mots d’un petit texte.',
  category: 'written-language',
  cover,
  ages: '8 ans et plus',
  keywords: ['orthographe', 'terminaisons', 'accord', 'infinitif', 'participe passé', 'décision orthographique'],
  objectives: [
    'Décision orthographique : choisir la terminaison d’après le contexte',
    'Distinguer l’infinitif, le participe passé et la forme en -ez',
    'Accorder le verbe avec son sujet, et l’adjectif ou le nom en genre et en nombre',
  ],
  materials: [
    'Chaque texte compte trois mots à compléter : le patient ouvre la liste et choisit la terminaison, puis valide.',
    'La liste propose les mêmes terminaisons pour tous les mots du texte, y compris des terminaisons qui ne conviennent à aucun : on ne peut pas répondre par élimination.',
    'À la correction, la règle qui justifie chaque terminaison s’affiche pour les mots manqués : elle sert de point de départ à la remédiation.',
    'Variante : faire dire à voix haute pourquoi cette terminaison avant de valider (« après a, c’est un participe passé »).',
  ],
  instructions:
    'Un petit texte contient des mots dont la fin est à choisir dans une liste. Le patient complète tous les mots, puis valide pour voir la correction.',
  settings: [
    {
      id: 'topic',
      type: 'choice',
      label: 'Notion travaillée',
      default: 'infinitive',
      options: [
        { id: 'infinitive', label: 'er, é, ez', hint: 'L’infinitif, le participe passé et la forme avec « vous ».' },
        { id: 'tenses', label: 'ait, aient, ent', hint: 'L’imparfait et le présent, au singulier et au pluriel.' },
        { id: 'agreement', label: 'Genre et nombre', hint: 'Les adjectifs et les noms : -e, -s, -es, -x.' },
        { id: 'mixed', label: 'Tout mélangé', hint: 'Les trois notions, dans un ordre quelconque.' },
      ],
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de textes',
      min: 1,
      max: 6,
      default: 3,
    },
  ],
  component: lazy(() => import('./WordEndings.jsx')),
}
