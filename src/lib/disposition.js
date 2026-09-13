/**
 * Placement d'éléments dans une zone, sans chevauchement.
 *
 * Deux jeux dispersent des objets dans un cadre : les collections de points
 * et le décor de recherche visuelle. Un tirage purement aléatoire produirait
 * des amas et des superpositions ; on tire donc des cases dans une grille
 * invisible, puis on bouscule légèrement chaque position pour que la grille
 * ne se voie pas.
 *
 * Les coordonnées sont en pourcentage du conteneur : la disposition suit
 * la taille réelle du cadre, quel que soit l'écran.
 */
import { sample } from './random.js'

/**
 * @param {number} nombre  éléments à placer
 * @param {object} options
 * @param {number} [options.ratio]   cases disponibles par élément (plus il est
 *                                   élevé, plus la disposition est aérée)
 * @param {number} [options.jitter]  décalage aléatoire, en fraction de cellule
 * @returns {{ colonnes: number, lignes: number, largeurCellule: number,
 *             hauteurCellule: number, positions: Array<{left: number, top: number}> }}
 */
export function placerSurGrille(nombre, { ratio = 1.6, jitter = 0.5 } = {}) {
  const colonnes = Math.max(1, Math.ceil(Math.sqrt(nombre * ratio)))
  const lignes = Math.max(1, Math.ceil(nombre / colonnes))
  const largeurCellule = 100 / colonnes
  const hauteurCellule = 100 / lignes

  const cases = sample(
    Array.from({ length: colonnes * lignes }, (_, index) => index),
    nombre,
  )

  const positions = cases.map((index) => {
    const colonne = index % colonnes
    const ligne = Math.floor(index / colonnes)
    const ecart = (amplitude) => (Math.random() - 0.5) * amplitude
    return {
      left: colonne * largeurCellule + largeurCellule / 2 + ecart(largeurCellule * jitter),
      top: ligne * hauteurCellule + hauteurCellule / 2 + ecart(hauteurCellule * jitter),
    }
  })

  return { colonnes, lignes, largeurCellule, hauteurCellule, positions }
}
