import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'dice-sum',
  title: 'La somme des dés',
  tagline: 'Lancer les dés, puis écrire le total qu’ils font.',
  category: 'math-cognition',
  cover,
  ages: '5 ans et plus',
  keywords: ['addition', 'subitizing', 'dénombrement', 'calcul mental', 'transcodage'],
  objectives: [
    'Reconnaissance immédiate des constellations du dé',
    'Addition de petites quantités',
    'Transcodage entre constellation et chiffre',
  ],
  materials: [
    'Le patient lance lui-même : la quantité à additionner est une quantité qu’il a produite, pas une donnée qu’on lui remet.',
    'La réponse s’écrit au pavé plutôt que de se choisir parmi des propositions : une somme fausse ne peut pas se trouver par élimination.',
    'L’affichage « Mélangé » met un dé en constellation et le suivant en chiffre, ce qui oblige à passer d’une écriture de la quantité à l’autre.',
    'Variante : demander comment le total a été trouvé (compté un à un, surcomptage, résultat connu) avant de valider.',
  ],
  instructions:
    'Le patient lance les dés, puis écrit leur total au pavé numérique. La correction affiche l’addition complète, ce qui permet de revenir sur la stratégie employée.',
  settings: [
    {
      id: 'dice',
      type: 'number',
      label: 'Nombre de dés',
      min: 2,
      max: 4,
      default: 2,
      hint: 'Deux dés pour commencer, au delà le total dépasse souvent dix.',
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de lancers',
      min: 5,
      max: 20,
      step: 5,
      default: 10,
    },
    {
      id: 'display',
      type: 'choice',
      label: 'Affichage',
      default: 'pips',
      options: [
        { id: 'pips', label: 'Constellations', hint: 'Les points du dé, comme sur un vrai dé.' },
        { id: 'digits', label: 'Chiffres', hint: 'Chaque dé montre son chiffre.' },
        { id: 'mixed', label: 'Mélangé', hint: 'Un dé en points, le suivant en chiffre.' },
      ],
    },
  ],
  component: lazy(() => import('./DiceSum.jsx')),
}
