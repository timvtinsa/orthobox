import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'visual-search',
  title: 'Cherche et trouve',
  tagline: 'Repérer un objet précis au milieu d’un décor encombré.',
  category: 'executive-functions',
  cover,
  ages: '4 ans et plus',
  keywords: ['recherche visuelle', 'attention sélective', 'balayage', 'exploration'],
  objectives: [
    'Attention visuelle sélective',
    'Stratégie d’exploration et balayage organisé du champ visuel',
    'Inhibition des distracteurs',
  ],
  materials: [
    'Le nombre d’objets et leur présentation se règlent séparément : un décor dense et tourné est bien plus exigeant qu’un décor aligné.',
    'Le temps de recherche moyen et le nombre de clics à côté sont donnés en fin de partie.',
    'Variante : demander de verbaliser la stratégie, par exemple « je regarde ligne par ligne ».',
  ],
  instructions:
    'Un objet cible est affiché au dessus du décor, où il n’apparaît qu’une seule fois. La manche compte comme réussie si l’objet est désigné sans erreur.',
  settings: [
    {
      id: 'items',
      type: 'number',
      label: 'Objets dans le décor',
      hint: 'Plus le décor est dense, plus l’exploration doit être organisée.',
      min: 12,
      max: 90,
      step: 6,
      default: 24,
    },
    {
      id: 'variation',
      type: 'choice',
      label: 'Présentation',
      default: 'aligned',
      options: [
        { id: 'aligned', label: 'Objets alignés', hint: 'Même taille, sans rotation.' },
        { id: 'varied', label: 'Tailles variées', hint: 'Objets de tailles différentes.' },
        { id: 'rotated', label: 'Tournés et mêlés', hint: 'Tailles et orientations variables.' },
      ],
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de recherches',
      min: 3,
      max: 12,
      default: 6,
    },

  ],
  component: lazy(() => import('./VisualSearch.jsx')),
}
