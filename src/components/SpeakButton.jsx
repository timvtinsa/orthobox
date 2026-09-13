import Icon from './Icon.jsx'
import { isSpeechAvailable, speak } from '../lib/speech.js'

/** Bouton de lecture vocale : prononce un mot ou une consigne. */
export default function SpeakButton({ text, label = 'Écouter', className = '' }) {
  if (!isSpeechAvailable()) return null

  return (
    <button
      type="button"
      className={`btn btn--ghost speak-btn ${className}`.trim()}
      onClick={(event) => {
        event.stopPropagation()
        speak(text)
      }}
      aria-label={`${label} : ${text}`}
      title={label}
    >
      <Icon name="sound" size={18} />
    </button>
  )
}
