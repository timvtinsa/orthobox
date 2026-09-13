import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'recherche-visuelle',
  title: 'Cherche et trouve',
  tagline: 'Repérer un objet précis au milieu d’un décor encombré.',
  category: 'fonctions-executives',
  cover,
  ages: '4 ans et +',
  duration: '5 min',
  keywords: ['recherche visuelle', 'attention sélective', 'balayage', 'exploration'],
  objectives: [
    'Attention visuelle sélective',
    'Stratégie d’exploration et balayage organisé du champ visuel',
    'Inhibition des distracteurs',
  ],
  materials: [
    'Le décor se densifie d’un niveau à l’autre : de 24 à 80 objets, avec rotations et tailles variées.',
    'Le temps de recherche moyen et le nombre de clics à côté sont donnés en fin de partie.',
    'Variante : demander de verbaliser la stratégie (« je regarde ligne par ligne »).',
  ],
  instructions:
    'Un objet cible est affiché au-dessus du décor ; il n’apparaît qu’une seule fois dans la scène. La manche compte comme réussie si l’objet est désigné sans erreur.',
  levels: [
    { id: 'calme', label: 'Décor calme', hint: '24 objets alignés' },
    { id: 'charge', label: 'Décor chargé', hint: '48 objets, tailles variées' },
    { id: 'dense', label: 'Décor dense', hint: '80 objets, tournés et mêlés' },
  ],
  component: lazy(() => import('./RechercheVisuelle.jsx')),
}
