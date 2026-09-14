import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'picture-board',
  title: 'La planche d’images',
  tagline: 'Mémoriser une planche d’images, puis reconnaître celles qui y figuraient.',
  category: 'executive-functions',
  cover,
  ages: '5 ans et plus',
  keywords: ['mémoire visuelle', 'reconnaissance', 'images', 'encodage'],
  objectives: [
    'Mémoire visuelle à court terme',
    'Reconnaissance visuelle et rejet des images nouvelles',
    'Double encodage image et mot',
  ],
  materials: [
    'Masquer les noms fait reposer la mémorisation sur le visuel plutôt que sur le langage.',
    'Le test propose autant d’images nouvelles que d’images de la planche.',
    'Variante : faire nommer chaque image à voix haute pendant la mémorisation.',
  ],
  instructions:
    'La planche est affichée pendant le temps choisi, puis les images défilent une par une, mélangées à des images nouvelles. Pour chacune, le patient dit si elle figurait sur la planche.',
  settings: [
    {
      id: 'count',
      type: 'number',
      label: 'Nombre d’images',
      hint: 'Cinq à sept images pour commencer.',
      min: 3,
      max: 12,
      default: 6,
    },
    {
      id: 'duration',
      type: 'number',
      label: 'Temps de mémorisation',
      min: 5,
      max: 60,
      step: 5,
      default: 10,
      unit: 'seconds',
    },
    {
      id: 'labels',
      type: 'choice',
      label: 'Nom des images',
      default: 'shown',
      options: [
        { id: 'shown', label: 'Affichés', hint: 'Le nom soutient la mémorisation.' },
        { id: 'hidden', label: 'Masqués', hint: 'Mémorisation visuelle, sans appui du langage.' },
      ],
    },

  ],
  component: lazy(() => import('./PictureBoard.jsx')),
}
