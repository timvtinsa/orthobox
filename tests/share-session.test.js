/**
 * Turning a whole session plan into a link and reading one back.
 *
 * Same guarantee as `share-settings.js`, extended to a full ordered plan: a
 * link can never hand the board a setting the game itself would refuse, a
 * game the catalogue no longer has is dropped rather than crashing the page,
 * and a corrupted or hand-crafted `p` parameter yields `null`, never a throw.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  MAX_SHARED_STEPS,
  decodeSessionSteps,
  encodeSessionSteps,
  sessionShareLink,
} from '../src/lib/share-session.js'
import { createStep } from '../src/lib/session-plan.js'

describe('encodeSessionSteps / decodeSessionSteps', () => {
  it('reads back the same games and settings it wrote', () => {
    const steps = [
      createStep('shape-sequence', { material: 'shapes', length: 'four', duration: 5, rounds: 6 }),
      createStep('shape-sequence', { material: 'colors', length: 'two', duration: 2, rounds: 4 }),
    ]
    const decoded = decodeSessionSteps(encodeSessionSteps(steps))
    expect(decoded.map((step) => [step.gameId, step.config])).toEqual(
      steps.map((step) => [step.gameId, step.config]),
    )
  })

  it('gives every decoded step its own, fresh id', () => {
    const steps = [createStep('shape-sequence', { rounds: 5 })]
    const decoded = decodeSessionSteps(encodeSessionSteps(steps))
    expect(decoded[0].id).not.toBe(steps[0].id)
  })

  it('returns null for a missing, empty or unparsable parameter', () => {
    expect(decodeSessionSteps(null)).toBeNull()
    expect(decodeSessionSteps('')).toBeNull()
    expect(decodeSessionSteps('not-base64url-json!!')).toBeNull()
  })

  it('returns null when the payload is not an array', () => {
    const encoded = btoa(JSON.stringify({ not: 'an array' }))
    expect(decodeSessionSteps(encoded)).toBeNull()
  })

  it('drops a step naming a game the catalogue does not have', () => {
    const steps = [createStep('no-such-game', {}), createStep('shape-sequence', { rounds: 6 })]
    const decoded = decodeSessionSteps(encodeSessionSteps(steps))
    expect(decoded).toHaveLength(1)
    expect(decoded[0].gameId).toBe('shape-sequence')
  })

  it('returns null when every step is unusable', () => {
    const steps = [createStep('no-such-game', {})]
    expect(decodeSessionSteps(encodeSessionSteps(steps))).toBeNull()
  })

  it('falls back to the game’s own defaults for a missing or invalid config', () => {
    const decoded = decodeSessionSteps(encodeSessionSteps([createStep('shape-sequence', {})]))
    expect(decoded[0].config).toEqual({ material: 'colors', length: 'three', duration: 4, rounds: 8 })
  })

  it('clamps a number field and drops a choice value the game does not offer', () => {
    const steps = [createStep('shape-sequence', { rounds: 999, material: 'metal' })]
    const decoded = decodeSessionSteps(encodeSessionSteps(steps))
    expect(decoded[0].config).toEqual({ rounds: 20 })
  })

  it('caps the number of steps a shared session can carry', () => {
    const steps = Array.from({ length: MAX_SHARED_STEPS + 5 }, () =>
      createStep('shape-sequence', { rounds: 5 }),
    )
    const decoded = decodeSessionSteps(encodeSessionSteps(steps))
    expect(decoded).toHaveLength(MAX_SHARED_STEPS)
  })
})

describe('sessionShareLink', () => {
  beforeEach(() => {
    globalThis.window = { location: { origin: 'https://example.test', pathname: '/' } }
  })

  afterEach(() => {
    delete globalThis.window
  })

  it('builds a link that decodes back to the same plan', () => {
    const steps = [createStep('shape-sequence', { rounds: 6 })]
    const link = sessionShareLink(steps)
    expect(link).toMatch(/^https:\/\/example\.test\/#\/session\/shared\?p=/)

    const params = new URL(link.replace('#', '')).searchParams
    expect(decodeSessionSteps(params.get('p'))[0].config).toEqual({ rounds: 6 })
  })
})
