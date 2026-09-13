/**
 * Les quatre domaines de la galerie. L'ordre défini ici est celui de
 * l'affichage (filtres et sections de la galerie).
 */
export const CATEGORIES = [
  {
    id: 'langage-oral',
    label: 'Langage oral',
    short: 'Oral',
    description: 'Phonologie, lexique, évocation, compréhension et expression à l’oral.',
    color: '#e2604a',
    tint: '#fdeeeb',
    icon: '🗣️',
  },
  {
    id: 'langage-ecrit',
    label: 'Langage écrit',
    short: 'Écrit',
    description: 'Lecture, conscience syllabique, orthographe et fluence.',
    color: '#2f8f6b',
    tint: '#e8f5f0',
    icon: '📖',
  },
  {
    id: 'fonctions-executives',
    label: 'Fonctions exécutives',
    short: 'Exécutif',
    description: 'Inhibition, mémoire de travail, flexibilité et attention.',
    color: '#7b53c1',
    tint: '#f1ecfa',
    icon: '🧩',
  },
  {
    id: 'cognition-mathematique',
    label: 'Cognition mathématique',
    short: 'Maths',
    description: 'Sens du nombre, estimation, chaîne numérique et calcul.',
    color: '#c2761a',
    tint: '#fbf1e2',
    icon: '🔢',
  },
]

export const CATEGORY_IDS = CATEGORIES.map((category) => category.id)

const BY_ID = new Map(CATEGORIES.map((category) => [category.id, category]))

export function getCategory(id) {
  return BY_ID.get(id) ?? null
}

export function isCategoryId(id) {
  return BY_ID.has(id)
}
