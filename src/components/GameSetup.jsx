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
import { shareLink } from '../lib/share-settings.js'
import Stepper from './Stepper.jsx'
import StyledQr from './StyledQr.jsx'
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
  sharedApplied = false,
}) {
  const defaults = defaultConfig(game.settings)
  const [config, setConfig] = useState(() => initial ?? defaults)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const update = (id, value) => setConfig((current) => ({ ...current, [id]: value }))

  const link = shareLink(game.id, game.settings, config)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé, permission
      // refusée) : le champ reste sélectionnable à la main.
      setCopied(false)
    }
  }

  const fields = [...game.settings].sort((a, b) => {
    if (a.type === b.type) return 0
    return a.type === 'number' ? -1 : 1
  })

  const isDefault = game.settings.every((field) => config[field.id] === field.default)

  return (
    <div className="setup">
      {sharedApplied && (
        <p className="setup__note setup__note--shared">
          Réglages reçus par lien : les champs marqués « Modifié » viennent de ce lien, pas d’un
          choix fait ici.
        </p>
      )}

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

        <button
          type="button"
          className="btn btn--ghost"
          aria-expanded={shareOpen}
          onClick={() => setShareOpen((open) => !open)}
        >
          Partager ces réglages
        </button>

        {variant === 'start' && (
          <p className="setup__note">
            Le plateau n’est pas monté avant cet appui : le patient ne voit ni le matériel, ni la
            réponse attendue. Aucun score n’est conservé d’une partie à l’autre.
          </p>
        )}
      </div>

      {shareOpen && (
        <div className="share-panel">
          <StyledQr value={link} className="share-panel__qr" />

          <div className="share-panel__details">
            <p className="share-panel__note">
              Le code et le lien ne contiennent que ces réglages : aucune donnée patient, aucun
              résultat n’y est attaché.
            </p>

            <div className="share-panel__link-row">
              <input
                className="share-panel__link"
                type="text"
                readOnly
                value={link}
                onFocus={(event) => event.target.select()}
                aria-label="Lien vers ces réglages"
              />
              <button type="button" className="btn btn--subtle" onClick={copyLink}>
                {copied ? 'Copié' : 'Copier le lien'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
