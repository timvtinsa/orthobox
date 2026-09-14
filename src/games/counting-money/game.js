import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'counting-money',
  title: 'Compter la monnaie',
  tagline: 'Composer un montant exact avec des pièces et des billets.',
  category: 'math-cognition',
  cover,
  ages: '6 ans et plus',
  keywords: ['monnaie', 'euros', 'décomposition', 'vie quotidienne', 'addition'],
  objectives: [
    'Décomposition additive d’un nombre',
    'Connaissance des pièces et des billets en euros',
    'Transfert vers une situation de la vie quotidienne',
  ],
  materials: [
    'Sans les centimes, les montants sont des euros entiers, ce qui simplifie nettement la tâche.',
    'Le porte monnaie affiche le total au fur et à mesure, et l’écart avec le prix en cas d’erreur.',
    'Variante : demander de payer avec le moins de pièces possible.',
  ],
  instructions:
    'Un montant est demandé. Le patient ajoute des pièces et des billets jusqu’à l’atteindre exactement, puis valide. Un clic sur une pièce du porte monnaie la retire.',
  settings: [
    {
      id: 'maxAmount',
      type: 'choice',
      label: 'Montants',
      default: 'five',
      options: [
        { id: 'five', label: 'Jusqu’à 5 €', hint: 'Petites sommes.' },
        { id: 'twenty', label: 'Jusqu’à 20 €', hint: 'Billets de 5 et 10 euros.' },
        { id: 'fifty', label: 'Jusqu’à 50 €', hint: 'Tous les billets courants.' },
      ],
    },
    {
      id: 'cents',
      type: 'choice',
      label: 'Centimes',
      default: 'without',
      options: [
        { id: 'without', label: 'Sans centimes', hint: 'Montants en euros entiers.' },
        { id: 'with', label: 'Avec centimes', hint: 'Montants au multiple de 5 centimes.' },
      ],
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre d’achats',
      min: 3,
      max: 12,
      default: 6,
    },

  ],
  component: lazy(() => import('./CountingMoney.jsx')),
}
