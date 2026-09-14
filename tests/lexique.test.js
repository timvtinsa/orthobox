import { describe, expect, it } from 'vitest'
import { MOTS_COURANTS, memeMot, suiteDeChiffres } from '../src/lib/lexique.js'

describe('comparaison de mots', () => {
  it('ignore la casse, les accents et les espaces', () => {
    expect(memeMot('Gateau', 'gâteau')).toBe(true)
    expect(memeMot('  ÉCHELLE ', 'echelle')).toBe(true)
    expect(memeMot('clé', 'cle')).toBe(true)
  })

  it('distingue deux mots différents', () => {
    expect(memeMot('lapin', 'sapin')).toBe(false)
    expect(memeMot('', 'lapin')).toBe(false)
  })
})

describe('lexique', () => {
  it('ne contient pas de doublon', () => {
    expect(new Set(MOTS_COURANTS).size).toBe(MOTS_COURANTS.length)
  })
})

describe('suite de chiffres', () => {
  it('a la longueur demandée', () => {
    expect(suiteDeChiffres(7)).toHaveLength(7)
  })

  it('ne répète jamais deux fois le même chiffre de suite', () => {
    for (let essai = 0; essai < 50; essai += 1) {
      const suite = suiteDeChiffres(10)
      for (let i = 1; i < suite.length; i += 1) {
        expect(suite[i]).not.toBe(suite[i - 1])
      }
    }
  })
})
