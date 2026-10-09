/**
 * Difficulty suggestion: at the end of a game, whether the next one should be
 * a notch harder or a notch easier.
 *
 * A game that can get harder says which of its settings does it, in its
 * manifest: `progression: { setting: 'level' }`. A `choice` setting is read in
 * the order its options are declared, easiest first; a `number` setting gets
 * harder as it grows (`direction: 'down'` for the rare one that gets harder as
 * it shrinks). The practitioner stays in charge: this only offers a button.
 */
import { formatValue } from '../components/Stepper.jsx'

/** Fewer answers than this say nothing about the level. */
export const MIN_ATTEMPTS = 5
/** From this success rate, the game was easy: propose a harder one. */
export const RAISE_FROM = 0.8
/** Up to this success rate, the game was hard: propose an easier one. */
export const LOWER_UNTIL = 0.4

/** The setting as a list of steps, easiest first: `[{ value, label }]`. */
export function progressionSteps(game) {
  const spec = game.progression
  const field = spec && game.settings.find((setting) => setting.id === spec.setting)
  if (!field) return []
  if (field.type === 'choice') return field.options.map((option) => ({ value: option.id, label: option.label }))
  if (field.type === 'number') {
    const values = []
    for (let value = field.min; value <= field.max; value += field.step ?? 1) values.push(value)
    if (spec.direction === 'down') values.reverse()
    return values.map((value) => ({
      value,
      label: `${field.label.toLowerCase()} : ${formatValue(value, field.unit, field.suffix)}`,
    }))
  }
  return []
}

/**
 * `{ direction: 'up' | 'down', config, label }`, or `null` when the result
 * calls for no change, the game cannot move further, or it has no progression.
 */
export function suggestProgression(game, config, { correct, attempts }) {
  if (!game?.progression || attempts < MIN_ATTEMPTS) return null
  const steps = progressionSteps(game)
  const current = steps.findIndex((step) => step.value === config?.[game.progression.setting])
  if (current === -1) return null

  const rate = correct / attempts
  const direction = rate >= RAISE_FROM ? 'up' : rate <= LOWER_UNTIL ? 'down' : null
  if (!direction) return null

  const target = steps[current + (direction === 'up' ? 1 : -1)]
  if (!target) return null
  return {
    direction,
    config: { ...config, [game.progression.setting]: target.value },
    label: target.label,
  }
}
