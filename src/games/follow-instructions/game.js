import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'follow-instructions',
  title: 'La bonne consigne',
  tagline: 'Écouter une consigne à plusieurs étapes, puis l’exécuter dans l’ordre.',
  category: 'oral-language',
  cover,
  ages: '5 ans et plus',
  keywords: ['consignes', 'compréhension orale', 'mémoire de travail', 'attention'],
  objectives: [
    'Compréhension d’une consigne orale à plusieurs éléments',
    'Mémoire de travail : garder l’ordre en tête',
    'Inhibition des formes qui ne sont pas demandées',
  ],
  materials: [
    'Plus de formes sont affichées que la consigne n’en demande : il faut choisir les bonnes, pas seulement les remettre en ordre.',
    'Le nombre d’étapes fixe la difficulté : deux pour commencer, quatre pour charger la mémoire de travail.',
    'Variante : faire répéter la consigne à voix haute avant de toucher la première forme.',
  ],
  instructions:
    'Une consigne énonce une suite de formes à toucher, par exemple « le rond bleu, puis le carré rouge ». Le patient les touche dans cet ordre, parmi d’autres formes affichées qui ne sont pas demandées.',
  settings: [
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de consignes',
      min: 4,
      max: 20,
      default: 8,
    },
    {
      id: 'length',
      type: 'choice',
      label: 'Étapes par consigne',
      default: 'two',
      options: [
        { id: 'two', label: '2', hint: 'Une consigne courte.' },
        { id: 'three', label: '3', hint: 'Une étape de plus à retenir.' },
        { id: 'four', label: '4', hint: 'La mémoire de travail est vraiment sollicitée.' },
      ],
    },
  ],
  component: lazy(() => import('./FollowInstructions.jsx')),
}
