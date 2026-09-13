/** Choix entre quelques options exclusives (2 à 4). */
export default function SwitchGroup({ label, hint, value, options, onChange }) {
  const id = `switch-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className="field">
      <span className="field__label" id={id}>
        {label}
      </span>
      <div className="switch-group" role="group" aria-labelledby={id}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`switch-group__option${
              option.id === value ? ' switch-group__option--active' : ''
            }`}
            aria-pressed={option.id === value}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  )
}
