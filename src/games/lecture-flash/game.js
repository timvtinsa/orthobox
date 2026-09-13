import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'lecture-flash',
  title: 'Lecture flash',
  tagline: 'Identifier un mot affiché très brièvement, parmi des leurres proches.',
  category: 'langage-ecrit',
  cover,
  ages: '7 ans et +',
  duration: '5 min',
  keywords: ['lecture', 'voie d’adressage', 'fluence', 'discrimination visuelle'],
  objectives: [
    'Reconnaissance globale du mot écrit',
    'Discrimination visuelle fine (inversions, confusions b/d/p/q)',
    'Vitesse de traitement visuel',
  ],
  materials: [
    'Les leurres reprennent les erreurs fréquentes : inversion de lettres, confusion visuelle, lettre ajoutée.',
    'Variante : demander de relire le mot à voix haute avant de choisir.',
  ],
  instructions:
    'Le mot n’apparaît qu’une fraction de seconde, puis quatre propositions très ressemblantes sont présentées. Réduire la durée d’affichage augmente la contrainte de traitement.',
  levels: [
    { id: 'lent', label: 'Lent', hint: '1,4 s d’affichage' },
    { id: 'rapide', label: 'Rapide', hint: '0,7 s d’affichage' },
    { id: 'expert', label: 'Expert', hint: '0,4 s, mots longs' },
  ],
  component: lazy(() => import('./LectureFlash.jsx')),
}
