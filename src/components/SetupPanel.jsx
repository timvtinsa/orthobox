/**
 * Écran de réglages affiché avant de lancer une partie : le praticien fixe
 * le nombre d'éléments, la durée de mémorisation, etc. avant que le patient
 * ne voie le matériel.
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
