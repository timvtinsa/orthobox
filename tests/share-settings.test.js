/**
 * Turning settings into a link and reading them back.
 *
 * The one guarantee that matters: a link can never hand the settings screen
 * a value the game itself would refuse, whatever was typed into the URL.
 */
import { describe, expect, it } from 'vitest'
import { settingsFromParams, settingsToParams } from '../src/lib/share-settings.js'

const SETTINGS = [
  { id: 'rounds', type: 'number', min: 4, max: 20, default: 10 },
  {
    id: 'task',
    type: 'choice',
    default: 'place',
    options: [{ id: 'place' }, { id: 'read' }, { id: 'compute' }],
  },
]

describe('settingsToParams / settingsFromParams', () => {
  it('reads back exactly what it wrote', () => {
    const params = settingsToParams(SETTINGS, { rounds: 8, task: 'read' })
    expect(settingsFromParams(SETTINGS, params)).toEqual({ rounds: 8, task: 'read' })
  })

  it('returns null when the query carries none of the game’s fields', () => {
    expect(settingsFromParams(SETTINGS, new URLSearchParams('foo=bar'))).toBeNull()
  })

  it('clamps a number field to the game’s own bounds', () => {
    const params = new URLSearchParams('rounds=999')
    expect(settingsFromParams(SETTINGS, params)).toEqual({ rounds: 20 })
  })

  it('drops a choice value the game does not offer', () => {
    const params = new URLSearchParams('task=teleport')
    expect(settingsFromParams(SETTINGS, params)).toBeNull()
  })

  it('drops a non-numeric value for a number field', () => {
    const params = new URLSearchParams('rounds=beaucoup')
    expect(settingsFromParams(SETTINGS, params)).toBeNull()
  })

  it('keeps the fields it can read even when a neighbour is invalid', () => {
    const params = new URLSearchParams('rounds=12&task=teleport')
    expect(settingsFromParams(SETTINGS, params)).toEqual({ rounds: 12 })
  })
})
