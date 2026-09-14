import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { installerStockage, retirerStockage } from './faux-stockage.js'
import { MODES, ecrireMode, lireMode } from '../src/lib/mode.js'

describe('mode d’affichage', () => {
  beforeEach(() => installerStockage())
  afterEach(retirerStockage)

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
