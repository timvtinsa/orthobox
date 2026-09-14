/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { MODES, ecrireMode, lireMode } from '../src/lib/mode.js'

describe('mode d’affichage', () => {
  beforeEach(() => window.localStorage.clear())

  it('démarre en mode adulte', () => {
    expect(lireMode()).toBe('adulte')
  })

  it('conserve le mode choisi', () => {
    ecrireMode('enfant')
    expect(lireMode()).toBe('enfant')
  })

  it('ignore une valeur inconnue', () => {
    window.localStorage.setItem('orthobox:mode', '"martien"')
    expect(lireMode()).toBe('adulte')
  })

  it('propose exactement deux modes', () => {
    expect(MODES.map((mode) => mode.id)).toEqual(['adulte', 'enfant'])
  })
})
