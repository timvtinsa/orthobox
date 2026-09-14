import { describe, expect, it } from 'vitest'
import { pick, randomInt, sample, sampleAvoiding, shuffle } from '../src/lib/random.js'

const SOURCE = ['a', 'b', 'c', 'd', 'e', 'f']

describe('tirages aléatoires', () => {
  it('mélange sans perdre ni muter les éléments', () => {
    const copie = [...SOURCE]
    expect(shuffle(SOURCE).sort()).toEqual([...SOURCE].sort())
    expect(SOURCE).toEqual(copie)
  })

  it('tire des éléments distincts', () => {
    const tirage = sample(SOURCE, 4)
    expect(tirage).toHaveLength(4)
    expect(new Set(tirage).size).toBe(4)
  })

  it('ne dépasse pas la taille de la source', () => {
    expect(sample(SOURCE, 99)).toHaveLength(SOURCE.length)
  })

  it('reste dans les bornes demandées', () => {
    for (let essai = 0; essai < 100; essai += 1) {
      const valeur = randomInt(3, 6)
      expect(valeur).toBeGreaterThanOrEqual(3)
      expect(valeur).toBeLessThanOrEqual(6)
    }
  })

  it('choisit toujours un élément de la liste', () => {
    expect(SOURCE).toContain(pick(SOURCE))
  })

  it('évite les éléments déjà vus tant que c’est possible', () => {
    const vus = ['a', 'b', 'c']
    for (let essai = 0; essai < 20; essai += 1) {
      const tirage = sampleAvoiding(SOURCE, 3, vus)
      expect(tirage.some((element) => vus.includes(element))).toBe(false)
    }
  })

  it('retombe sur la liste entière si les éléments neufs ne suffisent pas', () => {
    expect(sampleAvoiding(SOURCE, 5, ['a', 'b', 'c', 'd'])).toHaveLength(5)
  })
})
