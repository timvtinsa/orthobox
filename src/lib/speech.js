/**
 * Speech synthesis (Web Speech API): optional, and entirely local.
 *
 * When the browser or the system provides no French voice, games stay usable:
 * the practitioner then reads the prompt aloud.
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

/** Speaks a French text. A `rate` below 1 slows the delivery down. */
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
 * Speaks a list of words one after another, with a pause in between. Used
 * when no recording exists for the material (animal names). `onDone` fires
 * once the last word has been spoken.
 */
export function speakSequence(words, { pause = 700, onDone } = {}) {
  if (!isSpeechAvailable() || words.length === 0) {
    onDone?.()
    return false
  }
  window.speechSynthesis.cancel()
  const voice = findFrenchVoice()

  const sayFrom = (index) => {
    if (index >= words.length) {
      onDone?.()
      return
    }
    const utterance = new window.SpeechSynthesisUtterance(words[index])
    utterance.lang = 'fr-FR'
    utterance.rate = 0.95
    if (voice) utterance.voice = voice
    utterance.onend = () => window.setTimeout(() => sayFrom(index + 1), pause)
    // A failed utterance must not freeze the game.
    utterance.onerror = () => window.setTimeout(() => sayFrom(index + 1), pause)
    window.speechSynthesis.speak(utterance)
  }

  sayFrom(0)
  return true
}

// The voice list arrives asynchronously in some browsers.
if (isSpeechAvailable()) {
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    frenchVoice = undefined
  })
}
