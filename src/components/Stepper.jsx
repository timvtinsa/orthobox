/**
 * Numeric setting with large buttons, meant for touch use.
 *
 * `unit` formats the value without changing what is stored:
 *   'seconds' -> "10 s"
 *   'tenths'  -> "1,4 s" (the value stays in tenths of a second)
 * Otherwise the value is shown as is, followed by `suffix` when present.
 */
export function formatValue(value, unit, suffix) {
  if (unit === 'seconds') return `${value} s`
  if (unit === 'tenths') {
    return `${(value / 10).toLocaleString('fr-FR', { minimumFractionDigits: 1 })} s`
  }
  return suffix ? `${value} ${suffix}` : `${value}`
}

export default function Stepper({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  unit,
  suffix,
  onChange,
}) {
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
        <output className="stepper__value">{formatValue(value, unit, suffix)}</output>
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
