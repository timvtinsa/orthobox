import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'shape-sorting',
  title: 'Le tri des formes',
  tagline: 'Classer des objets selon leur couleur, leur forme, ou une règle qui change.',
  category: 'executive-functions',
  cover,
  ages: '4 ans et plus',
  keywords: ['tri', 'catégorisation', 'flexibilité', 'critère', 'formes', 'couleurs'],
  objectives: [
    'Catégorisation selon un critère donné',
    'Abstraction d’une propriété, couleur ou forme, en ignorant l’autre',
    'Flexibilité mentale lorsque la règle change en cours de jeu',
  ],
  materials: [
    'Quatre formes et quatre couleurs : chaque objet peut être rangé selon l’un ou l’autre critère.',
    'Le réglage « règle qui change » bascule de la couleur vers la forme à mi parcours, comme dans les épreuves de flexibilité.',
    'Variante : demander d’annoncer le critère avant chaque dépôt.',
  ],
  instructions:
    'Le patient choisit un objet, puis le bac où il doit aller. Un dépôt dans le mauvais bac est signalé et l’objet reste à classer.',
  settings: [
    {
      id: 'criterion',
      type: 'choice',
      label: 'Critère de tri',
      default: 'color',
      options: [
        { id: 'color', label: 'Couleur', hint: 'Quatre bacs, un par couleur.' },
        { id: 'shape', label: 'Forme', hint: 'Quatre bacs, un par forme.' },
        { id: 'switching', label: 'Règle qui change', hint: 'Couleur, puis forme à mi parcours.' },
      ],
    },
    {
      id: 'count',
      type: 'number',
      label: 'Nombre d’objets',
      min: 4,
      max: 16,
      step: 4,
      default: 8,
    },

  ],
  component: lazy(() => import('./ShapeSorting.jsx')),
}
