/**
 * Réglage numérique à gros boutons, pensé pour l'usage tactile.
 *
 * `unite` met en forme la valeur sans changer ce qui est stocké :
 *   'secondes'  ->  « 10 s »
 *   'dixiemes'  ->  « 1,4 s » (la valeur reste en dixièmes de seconde)
 * Sinon, la valeur est affichée telle quelle, suivie de `suffix` s'il existe.
 */
export function formaterValeur(valeur, unite, suffix) {
  if (unite === 'secondes') return `${valeur} s`
  if (unite === 'dixiemes') {
    return `${(valeur / 10).toLocaleString('fr-FR', { minimumFractionDigits: 1 })} s`
  }
  return suffix ? `${valeur} ${suffix}` : `${valeur}`
}

export default function Stepper({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  unite,
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
        <output className="stepper__value">{formaterValeur(value, unite, suffix)}</output>
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
