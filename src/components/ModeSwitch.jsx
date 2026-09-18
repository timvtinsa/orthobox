/**
 * Switch between adult mode and child mode.
 *
 * Two named buttons rather than a knob: the current mode reads without having
 * to interpret a position, and the practitioner picks a mode instead of
 * flipping an unlabelled state.
 */
import { useMode } from './ModeProvider.jsx'

const MODES = [
  { id: 'adult', label: 'Adulte' },
  { id: 'child', label: 'Enfant' },
]

export default function ModeSwitch() {
  const { mode, changeMode } = useMode()

  return (
    <div className="mode-switch">
      <span className="mode-switch__title" id="mode-switch-label">
        Mode
      </span>
      <div className="mode-switch__group" role="group" aria-labelledby="mode-switch-label">
        {MODES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`mode-switch__option${
              mode === entry.id ? ' mode-switch__option--active' : ''
            }`}
            aria-pressed={mode === entry.id}
            onClick={() => changeMode(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>
    </div>
  )
}
