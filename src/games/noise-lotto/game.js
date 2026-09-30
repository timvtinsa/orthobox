import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'noise-lotto',
  title: 'Le loto sonore',
  tagline: 'Écouter un bruit, puis retrouver l’image qui lui correspond.',
  category: 'oral-language',
  cover,
  ages: '3 ans et plus',
  keywords: ['discrimination auditive', 'bruits', 'reconnaissance sonore', 'loto', 'écoute'],
  objectives: [
    'Association entre un bruit entendu et son image',
    'Discrimination auditive fine, hors langage',
    'Attention soutenue et mémoire du plateau',
  ],
  materials: [
    'Le bruit n’est jamais nommé à l’écran : seule l’écoute permet de le reconnaître.',
    'La taille du plateau fixe la difficulté : plus il y a d’images, plus la recherche demande d’attention.',
    'Variante : faire décrire le bruit à voix haute avant de toucher l’image.',
  ],
  instructions:
    'Un bruit est proposé à l’écoute (sonnette, klaxon, cri d’animal…). Le patient touche, parmi les images du plateau, celle qui correspond à ce bruit. Chaque image trouvée reste marquée jusqu’à la fin de la partie, comme sur un vrai loto.',
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
  component: lazy(() => import('./NoiseLotto.jsx')),
}
