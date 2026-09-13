/**
 * Synthèse vocale (Web Speech API) : facultative, purement locale.
 * Si le navigateur ou le système ne fournit pas de voix française, les jeux
 * restent utilisables : c'est alors le praticien qui lit la consigne.
 */
export function isSpeechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let frenchVoice

function findFrenchVoice() {
  if (frenchVoice !== undefined) return frenchVoice
  const voices = window.speechSynthesis.getVoices()
  frenchVoice = voices.find((voice) => voice.lang?.toLowerCase().startsWith('fr')) ?? null
  return frenchVoice
}

/** Prononce un texte en français. `rate` inférieur à 1 ralentit l'énoncé. */
export function speak(text, { rate = 0.95 } = {}) {
  if (!isSpeechAvailable()) return false
  try {
    window.speechSynthesis.cancel()
    const utterance = new window.SpeechSynthesisUtterance(text)
    utterance.lang = 'fr-FR'
    utterance.rate = rate
    const voice = findFrenchVoice()
    if (voice) utterance.voice = voice
    window.speechSynthesis.speak(utterance)
    return true
  } catch {
    return false
  }
}

/**
 * Prononce une suite de mots l'un après l'autre, avec une pause entre chaque.
 * Utilisé quand aucun bruitage n'existe pour le matériel (noms d'animaux).
 * `onFin` est appelé une fois le dernier mot prononcé.
 */
export function speakSequence(mots, { pause = 700, onFin } = {}) {
  if (!isSpeechAvailable() || mots.length === 0) {
    onFin?.()
    return false
  }
  window.speechSynthesis.cancel()
  const voix = findFrenchVoice()

  const direre = (index) => {
    if (index >= mots.length) {
      onFin?.()
      return
    }
    const utterance = new window.SpeechSynthesisUtterance(mots[index])
    utterance.lang = 'fr-FR'
    utterance.rate = 0.95
    if (voix) utterance.voice = voix
    utterance.onend = () => window.setTimeout(() => direre(index + 1), pause)
    // Si la synthèse échoue, on n'immobilise pas le jeu.
    utterance.onerror = () => window.setTimeout(() => direre(index + 1), pause)
    window.speechSynthesis.speak(utterance)
  }

  direre(0)
  return true
}

// La liste des voix arrive de façon asynchrone sur certains navigateurs.
if (isSpeechAvailable()) {
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    frenchVoice = undefined
  })
}
