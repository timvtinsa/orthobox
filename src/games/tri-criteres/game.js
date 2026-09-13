import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'tri-criteres',
  title: 'Le tri des formes',
  tagline: 'Classer des objets selon leur couleur, leur forme, ou une règle qui change.',
  category: 'fonctions-executives',
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
      id: 'critere',
      type: 'choice',
      label: 'Critère de tri',
      default: 'couleur',
      options: [
        { id: 'couleur', label: 'Couleur', hint: 'Quatre bacs, un par couleur.' },
        { id: 'forme', label: 'Forme', hint: 'Quatre bacs, un par forme.' },
        { id: 'alterne', label: 'Règle qui change', hint: 'Couleur, puis forme à mi parcours.' },
      ],
    },
    {
      id: 'nombre',
      type: 'number',
      label: 'Nombre d’objets',
      min: 4,
      max: 16,
      step: 4,
      default: 8,
    },

  ],
  component: lazy(() => import('./TriCriteres.jsx')),
}
