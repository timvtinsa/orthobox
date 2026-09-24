import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'shape-sequence',
  title: 'La suite de formes',
  tagline: 'Mémoriser une suite de couleurs, ou de formes et couleurs, puis la reconstituer dans l’ordre.',
  category: 'executive-functions',
  cover,
  ages: '5 ans et plus',
  keywords: ['empan', 'mémoire de travail', 'séquence', 'attention visuelle', 'formes', 'couleurs'],
  objectives: [
    'Mémoire de travail visuelle',
    'Reconstitution d’une séquence ordonnée',
    'Discrimination visuelle (couleur, puis forme et couleur combinées)',
  ],
  materials: [
    'Plus d’éléments sont proposés que la suite n’en compte : il faut choisir les bons, pas seulement les remettre en ordre.',
    'Le réglage « Matériel » fixe la difficulté du contenu à retenir : la couleur seule pour commencer, puis la forme et la couleur combinées.',
    'Le temps de mémorisation et la longueur de la suite se règlent séparément.',
    'Variante : faire nommer chaque élément à voix haute pendant la mémorisation.',
  ],
  instructions:
    'Une suite d’éléments (des couleurs, ou des formes et des couleurs) s’affiche pendant quelques instants, puis disparaît. Le patient la reconstitue dans le même ordre en touchant les bons éléments, parmi d’autres qui ne sont pas demandés.',
  settings: [
    {
      id: 'material',
      type: 'choice',
      label: 'Matériel',
      default: 'colors',
      options: [
        { id: 'colors', label: 'Couleurs', hint: 'Six couleurs, sans les formes : le point de départ.' },
        { id: 'shapes', label: 'Formes et couleurs', hint: 'Chaque élément combine une forme et une couleur à retenir.' },
      ],
    },
    {
      id: 'length',
      type: 'choice',
      label: 'Éléments à retenir',
      default: 'three',
      options: [
        { id: 'two', label: '2', hint: 'Une suite courte.' },
        { id: 'three', label: '3', hint: 'Une étape de plus à retenir.' },
        { id: 'four', label: '4', hint: 'La mémoire de travail est vraiment sollicitée.' },
        { id: 'five', label: '5', hint: 'Le maximum proposé.' },
      ],
    },
    {
      id: 'duration',
      type: 'number',
      label: 'Temps de mémorisation',
      min: 2,
      max: 10,
      default: 4,
      suffix: 's',
      hint: 'Durée d’affichage de la suite avant qu’elle ne disparaisse.',
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de suites',
      min: 4,
      max: 20,
      default: 8,
    },
  ],
  component: lazy(() => import('./ShapeSequence.jsx')),
}
