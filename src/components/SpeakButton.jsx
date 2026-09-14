import Icon from './Icon.jsx'
import { isSpeechAvailable, speak } from '../lib/speech.js'

/** Speech button: reads a word or a prompt aloud. */
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
