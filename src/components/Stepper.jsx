/** Réglage numérique à gros boutons, pensé pour l'usage tactile. */
export default function Stepper({ label, hint, value, min, max, step = 1, suffix, onChange }) {
  const id = `stepper-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className="field">
      <span className="field__label" id={id}>
        {label}
      </span>
      <div className="stepper" role="group" aria-labelledby={id}>
        <button
          type="button"
          className="stepper__btn"
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
          aria-label={`Diminuer : ${label}`}
        >
          −
        </button>
        <output className="stepper__value">
          {value}
          {suffix ? ` ${suffix}` : ''}
        </output>
        <button
          type="button"
          className="stepper__btn"
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
          aria-label={`Augmenter : ${label}`}
        >
          +
        </button>
      </div>
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  )
}
