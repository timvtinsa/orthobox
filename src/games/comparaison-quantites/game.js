import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'comparaison-quantites',
  title: 'Le plus grand tas',
  tagline: 'Comparer deux collections d’un coup d’œil, sans les compter.',
  category: 'cognition-mathematique',
  cover,
  ages: '4 ans et plus',
  keywords: ['subitizing', 'estimation', 'sens du nombre', 'comparaison'],
  objectives: [
    'Sens du nombre et comparaison de quantités',
    'Subitizing, la reconnaissance immédiate des petites quantités',
    'Lien entre collection et écriture chiffrée',
  ],
  materials: [
    'La taille des points varie d’un point à l’autre : la surface occupée ne renseigne pas sur la quantité.',
    'Le matériel « estimation » masque les points au bout d’une seconde, ce qui empêche le comptage.',
    'Variante : demander « combien ? » avant de valider, pour observer la stratégie employée.',
  ],
  instructions:
    'Deux collections sont présentées côte à côte, et le patient désigne la plus nombreuse.',
  settings: [
    {
      id: 'materiel',
      type: 'choice',
      label: 'Matériel',
      default: 'subitizing',
      options: [
        { id: 'subitizing', label: 'Petites quantités', hint: 'De 1 à 6 points.' },
        { id: 'moyennes', label: 'Quantités moyennes', hint: 'De 4 à 14 points.' },
        { id: 'estimation', label: 'Estimation', hint: 'Les points disparaissent au bout d’un instant.' },
        { id: 'transcodage', label: 'Points et chiffres', hint: 'Une collection face à un nombre écrit.' },
      ],
    },
    {
      id: 'manches',
      type: 'number',
      label: 'Nombre de comparaisons',
      min: 6,
      max: 24,
      default: 12,
    },

  ],
  component: lazy(() => import('./ComparaisonQuantites.jsx')),
}
