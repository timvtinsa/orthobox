import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'chaine-numerique',
  title: 'Range les nombres',
  tagline: 'Ordonner une poignée de nombres, du plus petit au plus grand.',
  category: 'cognition-mathematique',
  cover,
  ages: '5 ans et +',
  duration: '5 min',
  keywords: ['ordre', 'comparaison', 'ligne numérique', 'décimaux'],
  objectives: [
    'Comparaison et rangement de nombres',
    'Représentation de la ligne numérique',
    'Lecture des nombres à deux et trois chiffres, puis des décimaux',
  ],
  materials: [
    'Variante orale : faire lire chaque nombre à voix haute avant de cliquer.',
    'Le niveau « décimaux » est utile pour repérer l’erreur classique « 0,9 plus grand que 0,15 ».',
  ],
  instructions:
    'Les nombres sont mélangés : l’enfant clique du plus petit au plus grand (ou l’inverse selon le niveau). Une suite compte comme réussie si elle est terminée sans erreur.',
  settings: [
    {
      id: 'plage',
      type: 'choice',
      label: 'Nombres',
      default: 'vingt',
      options: [
        { id: 'vingt', label: 'Jusqu’à 20', hint: 'Petits nombres entiers.' },
        { id: 'cent', label: 'Jusqu’à 100', hint: 'Nombres à deux chiffres.' },
        { id: 'mille', label: 'Jusqu’à 1000', hint: 'Nombres à trois chiffres.' },
        { id: 'decimaux', label: 'Décimaux', hint: 'Nombres à virgule, entre 0,1 et 10.' },
      ],
    },
    {
      id: 'sens',
      type: 'choice',
      label: 'Ordre',
      default: 'croissant',
      options: [
        { id: 'croissant', label: 'Croissant', hint: 'Du plus petit au plus grand.' },
        { id: 'decroissant', label: 'Décroissant', hint: 'Du plus grand au plus petit.' },
      ],
    },
    { id: 'quantite', type: 'number', label: 'Nombres par suite', min: 4, max: 9, default: 5 },
    { id: 'manches', type: 'number', label: 'Nombre de suites', min: 3, max: 12, default: 6 },
  ],
  component: lazy(() => import('./ChaineNumerique.jsx')),
}
