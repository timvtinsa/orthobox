/**
 * Everyday French words used by the memory games.
 *
 * Deliberately varied and unrelated to each other: semantic grouping would
 * make recall easier and distort the span being measured.
 */
export const COMMON_WORDS = [
  'bateau', 'chapeau', 'lampe', 'fraise', 'cheval', 'bouton', 'tapis', 'nuage',
  'clé', 'poisson', 'gâteau', 'jardin', 'valise', 'crayon', 'fenêtre', 'orange',
  'fourchette', 'montagne', 'serviette', 'guitare', 'château', 'bouteille', 'échelle', 'ballon',
  'chaussure', 'télé', 'girafe', 'confiture', 'parapluie', 'tambour', 'carotte', 'miroir',
  'tracteur', 'coussin', 'bougie', 'panier', 'feuille', 'sirop', 'balai', 'casserole',
  'chemise', 'dauphin', 'fromage', 'lunettes', 'moulin', 'oreiller', 'pinceau', 'râteau',
  'salade', 'timbre', 'village', 'wagon', 'brosse', 'citron', 'domino', 'escalier',
  'flocon', 'grenier', 'horloge', 'image', 'journal', 'lapin', 'manteau', 'noisette',
  'ananas', 'robinet', 'ceinture', 'sifflet', 'tabouret', 'éponge', 'chaussette', 'biberon',
  'cravate', 'tiroir', 'poubelle', 'réveil', 'coquillage', 'papillon', 'tortue', 'cactus',
  'harmonica', 'montre', 'pantoufle', 'coffre', 'seau', 'igloo', 'tunnel', 'cloche',
]

/** Random digit sequence, never repeating the same digit twice in a row. */
export function digitSequence(length) {
  const sequence = []
  for (let i = 0; i < length; i += 1) {
    let digit = Math.floor(Math.random() * 10)
    while (digit === sequence[sequence.length - 1]) digit = Math.floor(Math.random() * 10)
    sequence.push(digit)
  }
  return sequence
}

/**
 * Compares an answer to an expected word, ignoring case, accents and spacing:
 * memory is what is being assessed here, not spelling.
 */
export function sameWord(answer, expected) {
  const normalise = (value) =>
    value
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
  return normalise(answer) === normalise(expected)
}
