import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'memoire-images',
  title: 'La planche d’images',
  tagline: 'Mémoriser une planche d’images, puis reconnaître celles qui y figuraient.',
  category: 'fonctions-executives',
  cover,
  ages: '5 ans et +',
  duration: '5 min',
  keywords: ['mémoire visuelle', 'reconnaissance', 'images', 'encodage'],
  objectives: [
    'Mémoire visuelle à court terme',
    'Reconnaissance visuelle et rejet des images nouvelles',
    'Double encodage image / mot',
  ],
  materials: [
    'Nombre d’images, temps de mémorisation et affichage des noms se règlent avant la partie.',
    'Noms masqués : la mémorisation repose davantage sur le visuel que sur le langage.',
    'Variante : faire nommer chaque image à voix haute pendant la mémorisation.',
  ],
  instructions:
    'Une planche d’images est affichée pendant le temps choisi. Ensuite, les images défilent une par une, mélangées à autant d’images nouvelles : pour chacune, le patient dit si elle figurait sur la planche.',
  levels: [],
  component: lazy(() => import('./MemoireImages.jsx')),
}
