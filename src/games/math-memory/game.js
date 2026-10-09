import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'math-memory',
  title: 'Le memory des calculs',
  tagline: 'Retrouver, parmi des cartes cachées, le nombre et le calcul qui donne ce résultat.',
  category: 'math-cognition',
  cover,
  ages: '7 ans et plus',
  keywords: ['memory', 'calcul mental', 'mémoire visuo-spatiale', 'appariement'],
  objectives: [
    'Calcul mental : évaluer un résultat pour le reconnaître ailleurs',
    'Mémoire visuo-spatiale : retenir la position d’une carte déjà vue',
    'Stratégie d’exploration, retourner méthodiquement plutôt qu’au hasard',
  ],
  materials: [
    'La moitié des cartes montre un nombre, l’autre moitié un calcul : une paire associe un calcul à son résultat.',
    'Chaque calcul de la partie donne un résultat différent : une carte nombre n’a jamais qu’une seule carte calcul possible.',
    'Trois niveaux : 3, 6 ou 10 paires, soit 6 à 20 cartes.',
    'Variante : faire annoncer le résultat du calcul avant de le retourner, pour vérifier la paire sans la voir.',
  ],
  instructions:
    'Les cartes sont face cachée, certaines montrent un nombre, d’autres un calcul. Le patient en retourne deux : si le calcul donne bien ce nombre elles restent visibles, sinon elles se retournent après le temps d’observation choisi.',
  // The setting the end screen moves one notch when the series was very well
  // or poorly answered (see src/lib/progression.js).
  progression: { setting: 'level' },
  settings: [
    {
      id: 'level',
      type: 'choice',
      label: 'Niveau',
      default: 'easy',
      options: [
        { id: 'easy', label: 'Facile', hint: '3 paires, soit 6 cartes.' },
        { id: 'medium', label: 'Moyen', hint: '6 paires, soit 12 cartes.' },
        { id: 'hard', label: 'Difficile', hint: '10 paires, soit 20 cartes.' },
      ],
    },
    {
      id: 'operation',
      type: 'choice',
      label: 'Opération',
      default: 'addition',
      options: [
        { id: 'addition', label: 'Additions', hint: 'Uniquement des additions.' },
        { id: 'subtraction', label: 'Soustractions', hint: 'Uniquement des soustractions.' },
        { id: 'mixed', label: 'Addi. et soustr.', hint: 'Additions et soustractions mêlées.' },
        { id: 'multiplication', label: 'Tables', hint: 'Multiplications dans les tables.' },
        { id: 'all', label: 'Tout mélangé', hint: 'Additions, soustractions et tables, au hasard.' },
      ],
    },
    {
      id: 'reveal',
      type: 'number',
      label: 'Temps d’observation',
      hint: 'Durée d’affichage d’une paire ratée avant qu’elle se retourne.',
      min: 5,
      max: 40,
      step: 5,
      default: 15,
      unit: 'tenths',
    },
  ],
  component: lazy(() => import('./MathMemory.jsx')),
}
