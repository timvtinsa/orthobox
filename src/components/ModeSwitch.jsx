/**
 * Toggle between adult mode and child mode.
 *
 * A single button flips modes: both labels stay visible so the current state
 * reads without having to interpret the knob position, and the state itself
 * is carried by `aria-checked`.
 */
import { useMode } from './ModeProvider.jsx'

export default function ModeSwitch() {
  const { mode, isChild, changeMode } = useMode()

  return (
    <div className="mode-switch">
      <span className={`mode-switch__label${isChild ? '' : ' mode-switch__label--on'}`}>
        Adulte
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isChild}
        aria-label="Mode enfant"
        className="mode-switch__track"
        onClick={() => changeMode(isChild ? 'adult' : 'child')}
      >
        <span className="mode-switch__knob" />
      </button>
      <span className={`mode-switch__label${isChild ? ' mode-switch__label--on' : ''}`}>
        Enfant
      </span>
      <span className="visually-hidden">
        Mode actuel : {mode === 'child' ? 'enfant' : 'adulte'}
      </span>
    </div>
  )
}
