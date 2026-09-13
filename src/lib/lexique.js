/**
 * Lexique de mots concrets et fréquents, utilisé par les jeux de mémoire.
 * Volontairement variés et peu liés entre eux : un regroupement sémantique
 * facilite le rappel et fausserait l'évaluation de l'empan.
 */
export const MOTS_COURANTS = [
  'bateau', 'chapeau', 'lampe', 'fraise', 'cheval', 'bouton', 'tapis', 'nuage',
  'clé', 'poisson', 'gâteau', 'jardin', 'valise', 'crayon', 'fenêtre', 'orange',
  'fourchette', 'montagne', 'serviette', 'guitare', 'château', 'bouteille', 'échelle', 'ballon',
  'chaussure', 'télé', 'girafe', 'confiture', 'parapluie', 'tambour', 'carotte', 'miroir',
  'tracteur', 'coussin', 'bougie', 'panier', 'feuille', 'sirop', 'balai', 'casserole',
  'chemise', 'dauphin', 'fromage', 'lunettes', 'moulin', 'oreiller', 'pinceau', 'râteau',
  'salade', 'timbre', 'village', 'wagon', 'brosse', 'citron', 'domino', 'escalier',
  'flocon', 'grenier', 'horloge', 'image', 'journal', 'lapin', 'manteau', 'noisette',
]

/** Suite de chiffres aléatoires, sans répétition immédiate. */
export function suiteDeChiffres(longueur) {
  const suite = []
  for (let i = 0; i < longueur; i += 1) {
    let chiffre = Math.floor(Math.random() * 10)
    while (chiffre === suite[suite.length - 1]) chiffre = Math.floor(Math.random() * 10)
    suite.push(chiffre)
  }
  return suite
}

/**
 * Compare une saisie à un mot attendu : casse, accents et espaces sont
 * ignorés, pour ne pas pénaliser l'orthographe quand on évalue la mémoire.
 */
export function memeMot(saisie, attendu) {
  const nettoyer = (value) =>
    value
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
  return nettoyer(saisie) === nettoyer(attendu)
}
