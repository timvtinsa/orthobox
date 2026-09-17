import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'syllable-count',
  title: 'Combien de syllabes ?',
  tagline: 'Compter les syllabes d’un mot entendu, ou lu et entendu.',
  category: 'oral-language',
  cover,
  ages: '4 ans et plus',
  keywords: ['syllabes', 'conscience phonologique', 'segmentation', 'oral'],
  objectives: [
    'Conscience syllabique et segmentation',
    'Dénombrement d’unités entendues',
    'Mise en mots d’une perception auditive',
  ],
  materials: [
    'Masquer le mot écrit fait reposer le comptage sur la seule écoute.',
    'Les mots dont la coupe varie d’une région à l’autre sont écartés de la banque.',
    'Variante : faire frapper les syllabes dans les mains avant de répondre.',
  ],
  instructions:
    'Un mot est proposé, écrit et prononçable par le bouton d’écoute. Le patient compte ses syllabes, puis touche le nombre correspondant.',
  settings: [
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de mots',
      hint: 'Huit à douze mots pour une passation courte.',
      min: 4,
      max: 20,
      default: 10,
    },
    {
      id: 'range',
      type: 'choice',
      label: 'Longueur des mots',
      default: 'upTo3',
      options: [
        { id: 'upTo3', label: "Jusqu'à 3", hint: 'Une à trois syllabes.' },
        { id: 'upTo4', label: "Jusqu'à 4", hint: 'Une à quatre syllabes, mots plus longs.' },
      ],
    },
    {
      id: 'written',
      type: 'choice',
      label: 'Mot écrit',
      default: 'shown',
      options: [
        { id: 'shown', label: 'Affiché', hint: 'L’écrit soutient le découpage.' },
        { id: 'hidden', label: 'Masqué', hint: 'Comptage à l’oreille seule.' },
      ],
    },
  ],
  component: lazy(() => import('./SyllableCount.jsx')),
}
