import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'market-basket',
  title: 'Le panier du marché',
  tagline: 'Reproduire une commande de fruits et légumes en les prenant sur l’étal.',
  category: 'executive-functions',
  cover,
  ages: '4 ans et plus',
  keywords: ['planification', 'mémoire de travail', 'dénombrement', 'comparaison', 'inhibition'],
  objectives: [
    'Comparaison terme à terme d’un modèle et d’une production',
    'Planification d’une suite d’actions',
    'Dénombrement de petites quantités',
  ],
  materials: [
    'L’étal montre toujours les huit fruits et légumes : il faut choisir les bons, pas recopier une rangée.',
    'Toucher un article du panier en retire un seul exemplaire, ce qui permet de corriger un surcomptage sans tout vider.',
    'Le réglage « Quantités » fait passer d’une simple identification à un vrai dénombrement.',
    'Modèle caché : la commande n’est visible que pendant la mémorisation, le jeu devient une tâche de mémoire de travail.',
    'Variante : faire énoncer la commande à voix haute (« deux pommes et un poireau ») avant de remplir le panier.',
  ],
  instructions:
    'Une commande de fruits et légumes est affichée. Le patient la reproduit dans son panier en touchant les articles de l’étal, puis valide. La correction montre article par article ce qui manquait ou était en trop.',
  settings: [
    {
      id: 'kinds',
      type: 'number',
      label: 'Articles différents',
      min: 2,
      max: 5,
      default: 3,
      hint: 'Nombre de fruits ou légumes distincts dans la commande.',
    },
    {
      id: 'duration',
      type: 'number',
      label: 'Temps de mémorisation',
      min: 3,
      max: 15,
      default: 6,
      suffix: 's',
      hint: 'Utilisé seulement quand le modèle est caché.',
    },
    {
      id: 'rounds',
      type: 'number',
      label: 'Nombre de paniers',
      min: 3,
      max: 15,
      default: 6,
    },
    {
      id: 'quantities',
      type: 'choice',
      label: 'Quantités',
      default: 'single',
      options: [
        { id: 'single', label: 'Un de chaque', hint: 'Seule l’identification des articles est en jeu.' },
        { id: 'multiple', label: 'Jusqu’à trois', hint: 'Il faut aussi compter combien d’exemplaires prendre.' },
      ],
    },
    {
      id: 'model',
      type: 'choice',
      label: 'Modèle',
      default: 'visible',
      options: [
        { id: 'visible', label: 'Visible', hint: 'La commande reste affichée pendant le remplissage.' },
        { id: 'hidden', label: 'Caché', hint: 'La commande disparaît après la mémorisation.' },
      ],
    },
  ],
  component: lazy(() => import('./MarketBasket.jsx')),
}
