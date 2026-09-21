import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'shape-sequence',
  title: 'La suite de formes',
  tagline: 'Mémoriser une suite de cases colorées, puis la reproduire à l’endroit ou à l’envers.',
  category: 'executive-functions',
  cover,
  ages: '5 ans et plus',
  keywords: ['empan', 'mémoire de travail', 'séquence', 'attention visuelle', 'formes', 'couleurs'],
  objectives: [
    'Mémoire de travail visuo-spatiale',
    'Empan direct et empan inverse',
    'Discrimination visuelle (couleur, puis forme et couleur combinées)',
  ],
  materials: [
    'Le réglage « Matériel » fixe la difficulté du contenu à retenir : la couleur seule pour commencer, puis la forme et la couleur combinées.',
    'La suite s’allonge d’un élément à chaque réussite, et l’empan atteint est affiché en fin de partie.',
    'Variante : faire nommer chaque case à voix haute pendant la restitution.',
  ],
  instructions:
    'Les cases s’allument l’une après l’autre, chacune avec sa propre couleur (ou sa forme et sa couleur). L’enfant reproduit la suite en touchant les cases dans le même ordre, ou dans l’ordre inverse selon le réglage.',
  settings: [
    {
      id: 'material',
      type: 'choice',
      label: 'Matériel',
      default: 'colors',
      options: [
        { id: 'colors', label: 'Couleurs', hint: 'Six couleurs, sans les formes : le point de départ.' },
        { id: 'shapes', label: 'Formes et couleurs', hint: 'Chaque case combine une forme et une couleur à retenir.' },
      ],
    },
    {
      id: 'cells',
      type: 'choice',
      label: 'Grille',
      default: '4',
      options: [
        { id: '4', label: '4 cases', hint: 'Grille de 2 sur 2.' },
        { id: '6', label: '6 cases', hint: 'Grille de 3 sur 2.' },
      ],
    },
    {
      id: 'direction',
      type: 'choice',
      label: 'Sens de restitution',
      default: 'forward',
      options: [
        { id: 'forward', label: 'À l’endroit', hint: 'Empan direct.' },
        { id: 'backward', label: 'À l’envers', hint: 'Empan inverse, plus exigeant.' },
      ],
    },
    {
      id: 'start',
      type: 'number',
      label: 'Longueur de départ',
      hint: 'La suite s’allonge ensuite à chaque réussite.',
      min: 2,
      max: 6,
      default: 2,
    },
  ],
  component: lazy(() => import('./ShapeSequence.jsx')),
}
