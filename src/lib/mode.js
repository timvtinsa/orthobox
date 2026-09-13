/**
 * Mode d'affichage : « adulte » ou « enfant ».
 *
 * Le mode adulte est l'interface sobre par défaut. Le mode enfant y ajoute un
 * compagnon animé qui réagit aux réponses et des animations de réussite ; il
 * ne change ni les couleurs, ni la disposition, ni le contenu des jeux, de
 * sorte qu'un même exercice reste comparable d'un mode à l'autre.
 *
 * Le choix est conservé dans le navigateur : le praticien retrouve le mode
 * utilisé lors de la séance précédente.
 */
import { readJson, writeJson } from './storage.js'

const CLE = 'mode'

export const MODES = [
  { id: 'adulte', label: 'Adulte' },
  { id: 'enfant', label: 'Enfant' },
]

export function lireMode() {
  const valeur = readJson(CLE, 'adulte')
  return MODES.some((mode) => mode.id === valeur) ? valeur : 'adulte'
}

export function ecrireMode(mode) {
  writeJson(CLE, mode)
}
