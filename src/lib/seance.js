/**
 * Séance : une suite de jeux enchaînés, chacun avec ses propres réglages.
 * La séance en préparation est conservée dans le navigateur pour être
 * retrouvée d'une consultation à l'autre.
 */
import { readJson, writeJson } from './storage.js'

const CLE = 'seance'

export function lireSeance() {
  const donnees = readJson(CLE, [])
  return Array.isArray(donnees) ? donnees : []
}

export function ecrireSeance(etapes) {
  writeJson(CLE, etapes)
}

let compteur = 0

/** Identifiant d'étape : un même jeu peut figurer plusieurs fois. */
export function nouvelleEtape(gameId, config) {
  compteur += 1
  return { id: `${gameId}-${Date.now()}-${compteur}`, gameId, config }
}

/** Déplace un élément d'une position à une autre, sans muter la liste. */
export function deplacer(liste, depuis, vers) {
  if (depuis === vers || depuis < 0 || vers < 0) return liste
  const copie = [...liste]
  const [element] = copie.splice(depuis, 1)
  copie.splice(vers, 0, element)
  return copie
}

/** Réussite en pourcentage, ou null si le jeu n'a pas été joué. */
export function pourcentage(resultat) {
  if (!resultat || resultat.attempts === 0) return null
  return Math.round((resultat.correct / resultat.attempts) * 100)
}
