import { lazy } from 'react'

export default {
  id: 'chaine-numerique',
  title: 'Range les nombres',
  tagline: 'Ordonner une poignée de nombres, du plus petit au plus grand.',
  category: 'cognition-mathematique',
  icon: '📏',
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
  levels: [
    { id: 'vingt', label: 'Jusqu’à 20', hint: '5 nombres' },
    { id: 'cent', label: 'Jusqu’à 100', hint: '6 nombres' },
    { id: 'decroissant', label: 'Décroissant', hint: 'Du plus grand au plus petit' },
    { id: 'decimaux', label: 'Décimaux', hint: 'Nombres à virgule' },
  ],
  component: lazy(() => import('./ChaineNumerique.jsx')),
}
