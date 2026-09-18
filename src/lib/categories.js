/**
 * The four domains of the gallery. The order defined here drives the display
 * (filters and gallery sections).
 *
 * Each domain carries three colours from the pastel palette:
 *   pastel : the coloured fill (covers, dots, game pieces)
 *   ink    : the darker variant, used for text and borders
 *   tint   : the very light background of badges and play areas
 *
 * A fourth property, `shape`, carries the domain a second time as a geometric
 * shape. It is what keeps the domain readable in greyscale and on the printed
 * summary, where colour says nothing.
 *
 * Labels and descriptions are in French: they are shown to the practitioner.
 */
export const CATEGORIES = [
  {
    id: 'oral-language',
    label: 'Langage oral',
    short: 'Oral',
    description: 'Phonologie, lexique, évocation, compréhension et expression à l’oral.',
    pastel: '#f6bdab',
    ink: '#a44a28',
    tint: '#fdede7',
    shape: 'square',
  },
  {
    id: 'written-language',
    label: 'Langage écrit',
    short: 'Écrit',
    description: 'Lecture, conscience syllabique, compréhension écrite et fluence.',
    pastel: '#b9d8c2',
    ink: '#2f6b4c',
    tint: '#eaf4ee',
    shape: 'circle',
  },
  {
    id: 'executive-functions',
    label: 'Fonctions exécutives',
    short: 'Exécutives',
    description: 'Inhibition, mémoire de travail, attention, flexibilité et recherche visuelle.',
    pastel: '#cdc3ec',
    ink: '#5b45a0',
    tint: '#f0ecfa',
    shape: 'triangle',
  },
  {
    id: 'math-cognition',
    label: 'Cognition mathématique',
    short: 'Maths',
    description: 'Sens du nombre, estimation, chaîne numérique et calcul.',
    pastel: '#f4dfa8',
    ink: '#8a6a18',
    tint: '#fbf5e4',
    shape: 'diamond',
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

/** CSS custom properties for a domain, to set on a container. */
export function categoryStyle(category) {
  if (!category) return undefined
  return {
    '--category': category.ink,
    '--category-pastel': category.pastel,
    '--category-tint': category.tint,
    '--category-shape': `var(--shape-${category.shape})`,
  }
}
