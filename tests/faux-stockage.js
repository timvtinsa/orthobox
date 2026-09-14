/**
 * Faux `window.localStorage` pour les tests.
 *
 * Les modules qui persistent des données lisent `window.localStorage`. Plutôt
 * que de faire tourner un DOM complet pour quelques lectures et écritures,
 * les tests posent ce double : c'est plus rapide, et cela évite une
 * dépendance supplémentaire dans l'intégration continue.
 */
export function installerStockage({ enEchec = false } = {}) {
  const donnees = new Map()

  const stockage = {
    getItem: (cle) => (donnees.has(cle) ? donnees.get(cle) : null),
    setItem: (cle, valeur) => {
      if (enEchec) throw new Error('quota dépassé')
      donnees.set(cle, String(valeur))
    },
    removeItem: (cle) => donnees.delete(cle),
    clear: () => donnees.clear(),
  }

  globalThis.window = { localStorage: stockage }
  return stockage
}

export function retirerStockage() {
  delete globalThis.window
}
