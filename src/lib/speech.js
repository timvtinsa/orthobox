/**
 * Synthèse vocale (Web Speech API) : facultative, purement locale.
 * Si le navigateur ou le système ne fournit pas de voix française, les jeux
 * restent utilisables — c'est alors le praticien qui lit la consigne.
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

// La liste des voix arrive de façon asynchrone sur certains navigateurs.
if (isSpeechAvailable()) {
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    frenchVoice = undefined
  })
}
