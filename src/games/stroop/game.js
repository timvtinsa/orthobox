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
  settings: [
    {
      id: 'consigne',
      type: 'choice',
      label: 'Consigne',
      default: 'encre',
      options: [
        { id: 'echauffement', label: 'Échauffement', hint: 'Un essai sur deux est congruent.' },
        { id: 'encre', label: 'Couleur de l’encre', hint: 'Toujours la couleur de l’encre.' },
        { id: 'flexible', label: 'Consigne qui change', hint: 'Tantôt l’encre, tantôt le mot.' },
      ],
    },
    { id: 'manches', type: 'number', label: 'Nombre d’essais', min: 5, max: 40, step: 5, default: 15 },
  ],
  component: lazy(() => import('./Stroop.jsx')),
}
