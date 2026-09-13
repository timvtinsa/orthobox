import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'memoire-chiffres',
  title: 'La suite de chiffres',
  tagline: 'Retenir une suite de chiffres, puis la retaper à l’endroit ou à l’envers.',
  category: 'fonctions-executives',
  cover,
  ages: '6 ans et +',
  duration: '3 à 5 min',
  keywords: ['empan de chiffres', 'mémoire de travail', 'ordre inverse', 'attention'],
  objectives: [
    'Empan numérique direct et inverse',
    'Mémoire de travail verbale',
    'Maintien et manipulation d’une information en mémoire',
  ],
  materials: [
    'Longueur de la suite, temps d’affichage et sens de restitution réglables avant la partie.',
    'Augmenter la longueur d’un chiffre à chaque réussite permet d’estimer l’empan.',
    'Variante : faire répéter la suite à voix haute pendant la mémorisation.',
  ],
  instructions:
    'La suite s’affiche pendant le temps choisi, puis disparaît. Le patient la retape sur le pavé numérique, dans le même ordre ou à l’envers selon le réglage.',
  levels: [],
  component: lazy(() => import('./MemoireChiffres.jsx')),
}
