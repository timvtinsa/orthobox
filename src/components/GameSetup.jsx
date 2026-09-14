/**
 * Settings screen built from the `settings` a game declares.
 *
 * This is the only place that turns a setting definition into a control:
 * games merely describe what they expect.
 */
import { useState } from 'react'
import SetupPanel from './SetupPanel.jsx'
import Stepper from './Stepper.jsx'
import SwitchGroup from './SwitchGroup.jsx'

/** Default values declared by a game in its `game.js` manifest. */
export function defaultConfig(settings = []) {
  return Object.fromEntries(settings.map((field) => [field.id, field.default]))
}

/**
 * Settings screen shared by every game: the practitioner adjusts the values a
 * game declares, then starts it. Nothing is shown to the patient before the
 * « Démarrer » button is pressed.
 */
export default function GameSetup({ game, initial, onStart, actionLabel = 'Démarrer' }) {
  const [config, setConfig] = useState(() => initial ?? defaultConfig(game.settings))

  const update = (id, value) => setConfig((current) => ({ ...current, [id]: value }))

  return (
    <SetupPanel
      title={`Réglages : ${game.title}`}
      description={game.setupHint ?? game.instructions}
      actionLabel={actionLabel}
      onStart={() => onStart(config)}
    >
      {game.settings.map((field) =>
        field.type === 'number' ? (
          <Stepper
            key={field.id}
            label={field.label}
            hint={field.hint}
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
            key={field.id}
            label={field.label}
            hint={field.options.find((option) => option.id === config[field.id])?.hint ?? field.hint}
            value={config[field.id]}
            options={field.options}
            onChange={(value) => update(field.id, value)}
          />
        ),
      )}
    </SetupPanel>
  )
}
