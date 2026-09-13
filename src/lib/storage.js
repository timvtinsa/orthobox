/**
 * Persistance locale (localStorage). Tout reste sur le poste du praticien :
 * aucune donnée ne quitte le navigateur.
 * Chaque accès est protégé : navigation privée, stockage bloqué ou quota
 * plein ne doivent jamais casser l'application.
 */
const PREFIX = 'orthobox:'

export function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJson(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
