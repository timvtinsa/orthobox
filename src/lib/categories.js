/**
 * Les quatre domaines de la galerie. L'ordre défini ici est celui de
 * l'affichage (filtres et sections de la galerie).
 *
 * Chaque domaine porte trois couleurs de la palette pastel :
 *   pastel — l'aplat coloré (vignettes, pastilles, éléments de jeu)
 *   ink    — la version foncée, utilisée pour le texte et les bordures
 *   tint   — le fond très clair des badges et des zones de jeu
 */
export const CATEGORIES = [
  {
    id: 'langage-oral',
    label: 'Langage oral',
    short: 'Oral',
    description: 'Phonologie, lexique, évocation, compréhension et expression à l’oral.',
    pastel: '#f6bdab',
    ink: '#a44a28',
    tint: '#fdede7',
  },
  {
    id: 'langage-ecrit',
    label: 'Langage écrit',
    short: 'Écrit',
    description: 'Lecture, conscience syllabique, compréhension écrite et fluence.',
    pastel: '#b9d8c2',
    ink: '#2f6b4c',
    tint: '#eaf4ee',
  },
  {
    id: 'fonctions-executives',
    label: 'Fonctions exécutives',
    short: 'Exécutif',
    description: 'Inhibition, mémoire de travail, attention, flexibilité et recherche visuelle.',
    pastel: '#cdc3ec',
    ink: '#5b45a0',
    tint: '#f0ecfa',
  },
  {
    id: 'cognition-mathematique',
    label: 'Cognition mathématique',
    short: 'Maths',
    description: 'Sens du nombre, estimation, chaîne numérique et calcul.',
    pastel: '#f4dfa8',
    ink: '#8a6410',
    tint: '#fcf5e4',
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

/** Variables CSS d'un domaine, à poser sur un conteneur. */
export function categoryStyle(category) {
  if (!category) return undefined
  return {
    '--category': category.ink,
    '--category-pastel': category.pastel,
    '--category-tint': category.tint,
  }
}
