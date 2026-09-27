import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'sound-lotto',
  title: 'Le loto sonore',
  tagline: 'Écouter un mot, puis retrouver son image sur le plateau.',
  category: 'oral-language',
  cover,
  ages: '3 ans et plus',
  keywords: ['lexique', 'discrimination auditive', 'vocabulaire', 'loto', 'écoute'],
  objectives: [
    'Association entre un mot entendu et son image',
    'Discrimination auditive et attention soutenue',
    'Accès au lexique, sans passer par l’écrit',
  ],
  materials: [
    'Le mot n’est jamais écrit à l’écran : seule l’écoute permet de le retrouver.',
    'La taille du plateau fixe la difficulté : plus il y a d’images, plus la recherche demande d’attention.',
    'Variante : faire répéter le mot à voix haute avant de toucher l’image.',
  ],
  instructions:
    'Un mot est proposé à l’écoute. Le patient touche, parmi les images du plateau, celle qui correspond à ce mot. Chaque image trouvée reste marquée jusqu’à la fin de la partie, comme sur un vrai loto.',
  settings: [
    {
      id: 'size',
      type: 'choice',
      label: 'Plateau',
      default: '6',
      options: [
        { id: '6', label: '6 images', hint: 'Grille de 3 sur 2.' },
        { id: '9', label: '9 images', hint: 'Grille de 3 sur 3.' },
        { id: '12', label: '12 images', hint: 'Grille de 4 sur 3.' },
      ],
    },
  ],
  component: lazy(() => import('./SoundLotto.jsx')),
}
