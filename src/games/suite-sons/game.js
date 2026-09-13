import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'suite-sons',
  title: 'La suite de sons',
  tagline: 'Écouter une suite de sons, puis remettre les cartes dans l’ordre entendu.',
  category: 'langage-oral',
  cover,
  ages: '5 ans et plus',
  keywords: ['écoute', 'mémoire auditive', 'séquence', 'ordre', 'attention auditive'],
  objectives: [
    'Mémoire auditive séquentielle',
    'Attention et discrimination auditives',
    'Association d’un son à son image',
  ],
  materials: [
    'Bruits du quotidien : sonnette, téléphone, horloge, klaxon, eau, verre, tambour, sifflet, porte, applaudissements, cloche, moteur.',
    'Banque « animaux » : le nom de l’animal est prononcé par la voix de l’appareil, faute de bruitage enregistré.',
    'Des fichiers audio déposés dans public/sons/ remplacent automatiquement les bruits de synthèse, sans rien changer au jeu.',
    'Ramener les réécoutes à zéro rend l’épreuve nettement plus exigeante.',
    'Vérifier le volume du poste avant de commencer, et proposer un casque si la pièce est bruyante.',
  ],
  instructions:
    'La suite est jouée sans que les cartes soient visibles. Le patient les remet ensuite dans l’ordre entendu, un clic plaçant la carte à la suite des précédentes.',
  settings: [
    {
      id: 'banque',
      type: 'choice',
      label: 'Sons',
      default: 'quotidien',
      options: [
        { id: 'quotidien', label: 'Bruits du quotidien', hint: 'Douze bruits familiers.' },
        { id: 'animaux', label: 'Animaux', hint: 'Cinq animaux, nommés par la voix de l’appareil.' },
      ],
    },
    {
      id: 'longueur',
      type: 'number',
      label: 'Sons par suite',
      hint: 'Trois pour commencer, au delà de cinq la charge devient importante.',
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
    {
      id: 'manches',
      type: 'number',
      label: 'Nombre de suites',
      min: 3,
      max: 10,
      default: 5,
    },

  ],
  component: lazy(() => import('./SuiteSons.jsx')),
}
