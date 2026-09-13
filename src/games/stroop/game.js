import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'stroop',
  title: 'Encre ou mot ?',
  tagline: 'Répondre sur la couleur de l’encre malgré ce que le mot raconte.',
  category: 'fonctions-executives',
  cover,
  ages: '7 ans et +',
  duration: '3 à 5 min',
  keywords: ['stroop', 'inhibition', 'flexibilité', 'attention'],
  objectives: [
    'Inhibition de la réponse automatique de lecture',
    'Flexibilité mentale (niveau « consigne qui change »)',
    'Attention soutenue et vitesse de traitement',
  ],
  materials: [
    'Le temps de réponse moyen est affiché en fin de partie : utile pour comparer deux passations.',
    'Variante orale : faire nommer la couleur à voix haute avant de cliquer.',
  ],
  instructions:
    'Un nom de couleur est écrit dans une encre différente. Il faut répondre selon la consigne affichée — la couleur de l’encre, et au niveau le plus difficile tantôt l’encre, tantôt le mot.',
  levels: [
    { id: 'facile', label: 'Échauffement', hint: 'Un essai sur deux est congruent' },
    { id: 'classique', label: 'Classique', hint: 'Toujours la couleur de l’encre' },
    { id: 'flexible', label: 'Consigne qui change', hint: 'Encre ou mot, au hasard' },
  ],
  component: lazy(() => import('./Stroop.jsx')),
}
