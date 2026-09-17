/**
 * Settings screen built from the `settings` a game declares.
 *
 * This is the only place that turns a setting definition into a control:
 * games merely describe what they expect.
 *
 * The screen is scanned by value, not by label: the label stays small and
 * grey, the value is the big thing in the card, and a « Modifié » marker
 * points at what departs from the game's own default, which is the only thing
 * a practitioner really looks for when picking a game back up.
 *
 * The order is imposed here rather than by each manifest: numbers first, then
 * choices, and a choice of more than three options takes a row of its own.
 */
import { useState } from 'react'
import Stepper from './Stepper.jsx'
import SwitchGroup from './SwitchGroup.jsx'

/** Default values declared by a game in its `game.js` manifest. */
export function defaultConfig(settings = []) {
  return Object.fromEntries(settings.map((field) => [field.id, field.default]))
}

function fieldId(field) {
  return `setting-${field.id}`
}

export default function GameSetup({
  game,
  initial,
  onStart,
  actionLabel = 'Démarrer',
  variant = 'start',
}) {
  const defaults = defaultConfig(game.settings)
  const [config, setConfig] = useState(() => initial ?? defaults)

  const update = (id, value) => setConfig((current) => ({ ...current, [id]: value }))

  const fields = [...game.settings].sort((a, b) => {
    if (a.type === b.type) return 0
    return a.type === 'number' ? -1 : 1
  })

  const isDefault = game.settings.every((field) => config[field.id] === field.default)

  return (
    <div className="setup">
      <div className="setup__grid">
        {fields.map((field) => {
          const wide = field.type === 'choice' && field.options.length > 3
          const changed = config[field.id] !== field.default
          return (
            <div key={field.id} className={`setting${wide ? ' setting--wide' : ''}`}>
              <div className="setting__head">
                <span className="setting__label" id={fieldId(field)}>
                  {field.label}
                </span>
                {changed && <span className="setting__changed">Modifié</span>}
              </div>

              {field.type === 'number' ? (
                <Stepper
                  label={field.label}
                  labelId={fieldId(field)}
                  unit={field.unit}
                  suffix={field.suffix}
                  value={config[field.id]}
                  min={field.min}
                  max={field.max}
                  step={field.step ?? 1}
                  onChange={(value) => update(field.id, value)}
                />
              ) : (
                <SwitchGroup
                  labelId={fieldId(field)}
                  value={config[field.id]}
                  options={field.options}
                  onChange={(value) => update(field.id, value)}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="setup__actions">
        <button
          type="button"
          className={variant === 'start' ? 'btn-start' : 'btn btn--lg'}
          onClick={() => onStart(config)}
        >
          {actionLabel}
        </button>

        <button
          type="button"
          className="btn btn--ghost"
          disabled={isDefault}
          onClick={() => setConfig(defaults)}
        >
          Réglages par défaut
        </button>

        {variant === 'start' && (
          <p className="setup__note">
            Le plateau n’est pas monté avant cet appui : le patient ne voit ni le matériel, ni la
            réponse attendue. Aucun score n’est conservé d’une partie à l’autre.
          </p>
        )}
      </div>
    </div>
  )
}
