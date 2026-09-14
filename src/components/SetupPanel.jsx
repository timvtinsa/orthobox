/**
 * Settings screen shown before a game starts: the practitioner sets the
 * number of items, the study time and so on, before the patient sees any of
 * the material.
 */
export default function SetupPanel({ title, description, children, actionLabel, onStart }) {
  return (
    <div className="setup">
      <div>
        <h2 className="setup__title">{title}</h2>
        {description && <p className="game-instruction">{description}</p>}
      </div>

      <div className="setup__fields">{children}</div>

      <button type="button" className="btn btn--lg" onClick={onStart}>
        {actionLabel ?? 'Commencer'}
      </button>
    </div>
  )
}
