import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { installStorage, removeStorage } from './fake-storage.js'
import {
  createStep,
  moveItem,
  readSessionPlan,
  successRate,
  summariseConfig,
  writeSessionPlan,
} from '../src/lib/session-plan.js'

describe('step ordering', () => {
  const list = ['a', 'b', 'c', 'd']

  it('moves an item down', () => {
    expect(moveItem(list, 0, 2)).toEqual(['b', 'c', 'a', 'd'])
  })

  it('moves an item up', () => {
    expect(moveItem(list, 3, 1)).toEqual(['a', 'd', 'b', 'c'])
  })

  it('changes nothing for an identical or invalid position', () => {
    expect(moveItem(list, 1, 1)).toEqual(list)
    expect(moveItem(list, -1, 2)).toEqual(list)
  })

  it('does not mutate the source list', () => {
    const copy = [...list]
    moveItem(list, 0, 3)
    expect(list).toEqual(copy)
  })
})

describe('steps', () => {
  it('gives every step its own id', () => {
    const first = createStep('stroop', {})
    const second = createStep('stroop', {})
    expect(first.id).not.toBe(second.id)
    expect(first.gameId).toBe('stroop')
  })
})

describe('success rate', () => {
  it('rounds the percentage', () => {
    expect(successRate({ correct: 1, attempts: 3 })).toBe(33)
    expect(successRate({ correct: 3, attempts: 3 })).toBe(100)
  })

  it('stays undefined without any attempt', () => {
    expect(successRate({ correct: 0, attempts: 0 })).toBeNull()
    expect(successRate(null)).toBeNull()
  })
})

describe('reading and writing the plan', () => {
  beforeEach(() => installStorage())
  afterEach(removeStorage)

  it('starts empty', () => {
    expect(readSessionPlan()).toEqual([])
  })

  it('reads back exactly what it wrote', () => {
    const steps = [createStep('stroop', { rounds: 8 })]
    writeSessionPlan(steps)
    expect(readSessionPlan()).toEqual(steps)
  })

  it('falls back to an empty plan for anything that is not a list', () => {
    window.localStorage.setItem('orthobox:session-plan', JSON.stringify({ not: 'a list' }))
    expect(readSessionPlan()).toEqual([])
  })
})

describe('summariseConfig', () => {
  const game = {
    settings: [
      { id: 'rounds', type: 'number', label: 'Essais', default: 10, unit: null, suffix: null },
      {
        id: 'task',
        type: 'choice',
        label: 'Tâche',
        default: 'place',
        options: [
          { id: 'place', label: 'Placer' },
          { id: 'read', label: 'Lire' },
        ],
      },
    ],
  }

  it('reads a game with no settings as having none', () => {
    expect(summariseConfig({ settings: [] }, {})).toBe('Aucun réglage')
  })

  it('summarises every field it can read', () => {
    expect(summariseConfig(game, { rounds: 8, task: 'read' })).toBe('essais : 8 · Lire')
  })

  it('reads an all-default config as having no changes to report', () => {
    expect(summariseConfig(game, {})).toBe('Réglages par défaut')
  })

  it('leaves out a field a later version of the game no longer declares', () => {
    expect(summariseConfig(game, { rounds: 8, ghost: 'field' })).toBe('essais : 8')
  })
})
