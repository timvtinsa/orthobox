import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'custom-words',
  title: 'Mes mots',
  tagline: 'Lire ou reconnaître les mots de votre propre liste.',
  category: 'oral-language',
  cover,
  ages: '5 ans et plus',
  keywords: ['vocabulaire', 'liste personnalisée', 'lecture', 'discrimination auditive', 'mots du patient'],
  objectives: [
    'Travailler le vocabulaire choisi par le praticien : mots du patient, thème, phonème cible',
    'Lecture à voix haute de mots ciblés',
    'Reconnaissance écrite d’un mot entendu',
  ],
  materials: [
    'La liste se prépare dans « Mes listes » (menu du haut) : un mot par ligne. La liste active est celle que le jeu utilise.',
    'En lecture, c’est le praticien qui juge : « Bien lu » ou « À revoir ». Les mots à revoir figurent dans le bilan de séance.',
    'Le mode écoute demande au moins deux mots dans la liste ; les propositions sont tirées de la même liste.',
  ],
  instructions:
    'Un mot de la liste active est affiché à lire à voix haute, ou lu par l’appareil pour être retrouvé parmi plusieurs mots écrits.',
  settings: [
    {
      id: 'mode',
      type: 'choice',
      label: 'Mode',
      default: 'read',
      options: [
        { id: 'read', label: 'Lecture à voix haute', hint: 'Le mot est affiché, le patient le lit, le praticien valide.' },
        { id: 'listen', label: 'Reconnaître le mot entendu', hint: 'Le mot est dit, le patient le retrouve parmi quatre mots écrits.' },
      ],
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de mots',
      min: 4,
      max: 20,
      default: 10,
    },
  ],
  component: lazy(() => import('./CustomWords.jsx')),
}
