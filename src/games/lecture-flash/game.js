import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'lecture-flash',
  title: 'Lecture flash',
  tagline: 'Identifier un mot affiché très brièvement, parmi des leurres proches.',
  category: 'langage-ecrit',
  cover,
  ages: '7 ans et plus',
  keywords: ['lecture', 'voie d’adressage', 'fluence', 'discrimination visuelle'],
  objectives: [
    'Reconnaissance globale du mot écrit',
    'Discrimination visuelle fine, inversions et confusions b, d, p, q',
    'Vitesse de traitement visuel',
  ],
  materials: [
    'La durée d’affichage se règle finement : plus elle est courte, plus la lecture globale est sollicitée.',
    'Les leurres reprennent les erreurs fréquentes : inversion de lettres, confusion visuelle, lettre ajoutée.',
    'Variante : demander de relire le mot à voix haute avant de choisir.',
  ],
  instructions:
    'Le mot n’apparaît qu’un court instant, puis quatre propositions très ressemblantes sont présentées.',
  settings: [
    {
      id: 'duree',
      type: 'number',
      label: 'Durée d’affichage',
      hint: 'Le mot disparaît au bout de ce délai.',
      min: 2,
      max: 20,
      default: 14,
      unite: 'dixiemes',
    },
    {
      id: 'longueur',
      type: 'choice',
      label: 'Longueur des mots',
      default: 'courts',
      options: [
        { id: 'courts', label: 'Mots courts', hint: 'Une à deux syllabes.' },
        { id: 'longs', label: 'Mots longs', hint: 'Trois syllabes et plus.' },
      ],
    },
    {
      id: 'manches',
      type: 'number',
      label: 'Nombre de mots',
      min: 5,
      max: 20,
      default: 10,
    },

  ],
  component: lazy(() => import('./LectureFlash.jsx')),
}
