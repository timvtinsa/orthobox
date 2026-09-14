import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'mental-math',
  title: 'Le calcul éclair',
  tagline: 'Trouver le résultat d’une opération parmi quatre propositions.',
  category: 'math-cognition',
  cover,
  ages: '6 ans et plus',
  keywords: ['calcul mental', 'addition', 'subtraction', 'tables', 'automatismes'],
  objectives: [
    'Automatismes de calcul mental',
    'Vérification rapide d’un résultat',
    'Repérage des erreurs de retenue',
  ],
  materials: [
    'Les propositions fausses reprennent les erreurs fréquentes : le voisin immédiat, la retenue oubliée, le facteur inversé.',
    'Le temps de réponse moyen est affiché en fin de partie.',
    'Variante : demander comment le résultat a été trouvé avant de valider.',
  ],
  instructions:
    'Une opération est affichée avec quatre résultats possibles. Le patient choisit le bon, et la correction est immédiate.',
  settings: [
    {
      id: 'operation',
      type: 'choice',
      label: 'Opération',
      default: 'addition',
      options: [
        { id: 'addition', label: 'Additions', hint: 'Uniquement des additions.' },
        { id: 'subtraction', label: 'Soustractions', hint: 'Uniquement des soustractions.' },
        { id: 'mixed', label: 'Les deux', hint: 'Additions et soustractions mêlées.' },
        { id: 'multiplication', label: 'Tables', hint: 'Multiplications dans les tables.' },
      ],
    },
    {
      id: 'range',
      type: 'choice',
      label: 'Nombres',
      default: 'ten',
      options: [
        { id: 'ten', label: 'Jusqu’à 10', hint: 'Tables de 2 à 5 en multiplication.' },
        { id: 'twenty', label: 'Jusqu’à 20', hint: 'Tables de 2 à 6 et table de 10.' },
        { id: 'hundred', label: 'Jusqu’à 100', hint: 'Toutes les tables.' },
      ],
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de calculs',
      min: 5,
      max: 30,
      step: 5,
      default: 10,
    },

  ],
  component: lazy(() => import('./MentalMath.jsx')),
}
