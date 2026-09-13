import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'comparaison-quantites',
  title: 'Le plus grand tas',
  tagline: 'Comparer deux collections d’un coup d’œil, sans les compter.',
  category: 'cognition-mathematique',
  cover,
  ages: '4 ans et +',
  duration: '5 min',
  keywords: ['subitizing', 'estimation', 'sens du nombre', 'comparaison'],
  objectives: [
    'Sens du nombre et comparaison de quantités',
    'Subitizing (reconnaissance immédiate des petites quantités)',
    'Lien entre collection et écriture chiffrée',
  ],
  materials: [
    'La taille des points varie d’un point à l’autre : la surface occupée ne renseigne pas sur la quantité.',
    'Variante : demander « combien ? » avant de valider, pour observer la stratégie (comptage un à un ou estimation).',
  ],
  instructions:
    'Deux collections sont présentées côte à côte : l’enfant désigne la plus nombreuse. Au niveau estimation, les points disparaissent au bout d’une seconde, ce qui empêche le comptage.',
  settings: [
    {
      id: 'materiel',
      type: 'choice',
      label: 'Matériel',
      default: 'subitizing',
      options: [
        { id: 'subitizing', label: 'Petites quantités', hint: '1 à 6 points.' },
        { id: 'moyennes', label: 'Quantités moyennes', hint: '4 à 14 points.' },
        { id: 'estimation', label: 'Estimation', hint: 'Les points disparaissent au bout d’un instant.' },
        { id: 'transcodage', label: 'Points et chiffres', hint: 'Une collection face à un nombre écrit.' },
      ],
    },
    { id: 'manches', type: 'number', label: 'Nombre de comparaisons', min: 6, max: 24, default: 12 },
  ],
  component: lazy(() => import('./ComparaisonQuantites.jsx')),
}
