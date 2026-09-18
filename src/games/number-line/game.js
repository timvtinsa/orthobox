import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'number-line',
  title: 'La ligne des nombres',
  tagline: 'Placer un nombre sur une ligne, puis calculer en s’y déplaçant.',
  category: 'math-cognition',
  cover,
  ages: '6 ans et plus',
  keywords: ['ligne numérique', 'estimation', 'représentation spatiale', 'calcul'],
  objectives: [
    'Représentation spatiale de la chaîne numérique',
    'Estimation de la position d’un nombre',
    'Calcul mental appuyé sur un déplacement',
  ],
  materials: [
    'Les graduations font la difficulté, pas l’étendue : tout graduer revient à compter, les seuls repères obligent à estimer, la ligne nue fait travailler l’image mentale.',
    'La tolérance est de quatre pour cent de la ligne : on mesure le sens du nombre, pas l’adresse du doigt.',
    'Variante : faire dire à voix haute de quel repère le patient est parti avant de toucher.',
  ],
  instructions:
    'Une ligne va de zéro au nombre choisi. Selon la tâche, le patient place un nombre sur la ligne, lit le nombre qu’un repère indique, ou part d’un nombre et se déplace pour trouver où il arrive.',
  settings: [
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre d’essais',
      min: 4,
      max: 20,
      default: 10,
    },
    {
      id: 'task',
      type: 'choice',
      label: 'Tâche',
      default: 'place',
      options: [
        { id: 'place', label: 'Placer', hint: 'Poser un nombre au bon endroit.' },
        { id: 'read', label: 'Lire', hint: 'Nommer le nombre qu’un repère indique.' },
        { id: 'compute', label: 'Calculer', hint: 'Partir d’un nombre et se déplacer sur la ligne.' },
      ],
    },
    {
      id: 'range',
      type: 'choice',
      label: 'La ligne va jusqu’à',
      default: 'ten',
      options: [
        { id: 'ten', label: '10', hint: 'La première dizaine.' },
        { id: 'twenty', label: '20', hint: 'Franchissement de la dizaine.' },
        { id: 'hundred', label: '100', hint: 'La centaine, de cinq en cinq.' },
      ],
    },
    {
      id: 'ticks',
      type: 'choice',
      label: 'Graduations',
      default: 'all',
      options: [
        { id: 'all', label: 'Toutes', hint: 'Chaque unité est marquée : placer revient à compter.' },
        { id: 'landmarks', label: 'Repères', hint: 'Début, milieu et fin seulement : il faut estimer.' },
        { id: 'none', label: 'Aucune', hint: 'Ligne nue : c’est l’image mentale qui travaille.' },
      ],
    },
  ],
  component: lazy(() => import('./NumberLine.jsx')),
}
