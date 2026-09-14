import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'stroop',
  title: 'Encre ou mot ?',
  tagline: 'Répondre sur la couleur de l’encre malgré ce que le mot raconte.',
  category: 'executive-functions',
  cover,
  ages: '7 ans et plus',
  keywords: ['stroop', 'inhibition', 'flexibilité', 'attention'],
  objectives: [
    'Inhibition de la réponse automatique de lecture',
    'Flexibilité mentale quand la consigne change d’un essai à l’autre',
    'Attention soutenue et vitesse de traitement',
  ],
  materials: [
    'Trois consignes possibles : échauffement à moitié congruent, couleur de l’encre, ou consigne tirée au hasard à chaque essai.',
    'Le temps de réponse moyen est affiché en fin de partie, utile pour comparer deux passations.',
    'Variante orale : faire nommer la couleur à voix haute avant de cliquer.',
  ],
  instructions:
    'Un nom de couleur est écrit dans une encre différente. Il faut répondre selon la consigne affichée au dessus du mot.',
  settings: [
    {
      id: 'rule',
      type: 'choice',
      label: 'Consigne',
      default: 'ink',
      options: [
        { id: 'warmup', label: 'Échauffement', hint: 'Un essai sur deux est congruent.' },
        { id: 'ink', label: 'Couleur de l’encre', hint: 'Toujours la couleur de l’encre.' },
        { id: 'switching', label: 'Consigne qui change', hint: 'Tantôt l’encre, tantôt le mot écrit.' },
      ],
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre d’essais',
      min: 5,
      max: 40,
      step: 5,
      default: 15,
    },

  ],
  component: lazy(() => import('./Stroop.jsx')),
}
