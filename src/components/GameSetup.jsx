/**
 * Écran de réglages construit à partir des `settings` déclarés par un jeu.
 *
 * C'est le seul endroit qui sait traduire une définition de réglage en
 * contrôle : les jeux se contentent de décrire ce qu'ils attendent.
 */
import { useState } from 'react'
import SetupPanel from './SetupPanel.jsx'
import Stepper from './Stepper.jsx'
import SwitchGroup from './SwitchGroup.jsx'

/** Valeurs par défaut déclarées par un jeu dans sa fiche `game.js`. */
export function defaultConfig(settings = []) {
  return Object.fromEntries(settings.map((champ) => [champ.id, champ.default]))
}

/**
 * Écran de réglages commun à tous les jeux : le praticien ajuste les
 * paramètres déclarés par le jeu, puis lance la partie. Rien n'est affiché
 * au patient avant l'appui sur « Démarrer ».
 */
export default function GameSetup({ game, initial, onStart, actionLabel = 'Démarrer' }) {
  const [config, setConfig] = useState(() => initial ?? defaultConfig(game.settings))

  const modifier = (id, valeur) => setConfig((current) => ({ ...current, [id]: valeur }))

  return (
    <SetupPanel
      title={`Réglages : ${game.title}`}
      description={game.setupHint ?? game.instructions}
      actionLabel={actionLabel}
      onStart={() => onStart(config)}
    >
      {game.settings.map((champ) =>
        champ.type === 'number' ? (
          <Stepper
            key={champ.id}
            label={champ.label}
            hint={champ.hint}
            unite={champ.unite}
            suffix={champ.suffix}
            value={config[champ.id]}
            min={champ.min}
            max={champ.max}
            step={champ.step ?? 1}
            onChange={(valeur) => modifier(champ.id, valeur)}
          />
        ) : (
          <SwitchGroup
            key={champ.id}
            label={champ.label}
            hint={champ.options.find((option) => option.id === config[champ.id])?.hint ?? champ.hint}
            value={config[champ.id]}
            options={champ.options}
            onChange={(valeur) => modifier(champ.id, valeur)}
          />
        ),
      )}
    </SetupPanel>
  )
}
