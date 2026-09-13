import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'suite-sons',
  title: 'La suite de sons',
  tagline: 'Écouter une suite de sons, puis remettre les cartes dans l’ordre entendu.',
  category: 'langage-oral',
  cover,
  ages: '5 ans et +',
  duration: '5 min',
  keywords: ['écoute', 'mémoire auditive', 'séquence', 'ordre', 'attention auditive'],
  objectives: [
    'Mémoire auditivo-séquentielle',
    'Attention et discrimination auditives',
    'Association d’un son à son image',
  ],
  materials: [
    'Bruits du quotidien : sonnette, téléphone, horloge, klaxon, goutte d’eau, verre, tambour, sifflet — fabriqués par l’application, sans fichier audio.',
    'Banque « animaux » : les noms sont prononcés par la voix de l’appareil (une voix française doit être installée).',
    'Le nombre de réécoutes autorisées se règle : le mettre à zéro rend l’épreuve nettement plus exigeante.',
    'Vérifier le volume du poste avant de commencer, et faire écouter au casque si la pièce est bruyante.',
  ],
  instructions:
    'La suite est jouée sans que les cartes soient visibles. Le patient les remet ensuite dans l’ordre entendu ; un clic sur une carte la place à la suite des précédentes.',
  settings: [
    {
      id: 'banque',
      type: 'choice',
      label: 'Sons',
      default: 'quotidien',
      options: [
        { id: 'quotidien', label: 'Bruits du quotidien', hint: 'Huit bruitages fabriqués par l’application.' },
        { id: 'animaux', label: 'Animaux', hint: 'Noms prononcés par la voix de l’appareil.' },
      ],
    },
    {
      id: 'longueur',
      type: 'number',
      label: 'Sons par suite',
      hint: 'Trois pour commencer ; au-delà de cinq, la charge devient importante.',
      min: 2,
      max: 5,
      default: 3,
    },
    {
      id: 'reecoutes',
      type: 'number',
      label: 'Réécoutes autorisées',
      min: 0,
      max: 3,
      default: 1,
    },
    { id: 'manches', type: 'number', label: 'Nombre de suites', min: 3, max: 10, default: 5 },
  ],
  component: lazy(() => import('./SuiteSons.jsx')),
}
