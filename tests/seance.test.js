import { describe, expect, it } from 'vitest'
import { deplacer, nouvelleEtape, pourcentage } from '../src/lib/seance.js'

describe('ordre des étapes', () => {
  const liste = ['a', 'b', 'c', 'd']

  it('déplace un élément vers le bas', () => {
    expect(deplacer(liste, 0, 2)).toEqual(['b', 'c', 'a', 'd'])
  })

  it('déplace un élément vers le haut', () => {
    expect(deplacer(liste, 3, 1)).toEqual(['a', 'd', 'b', 'c'])
  })

  it('ne change rien quand la position est identique ou invalide', () => {
    expect(deplacer(liste, 1, 1)).toEqual(liste)
    expect(deplacer(liste, -1, 2)).toEqual(liste)
  })

  it('ne mute pas la liste d’origine', () => {
    const copie = [...liste]
    deplacer(liste, 0, 3)
    expect(liste).toEqual(copie)
  })
})

describe('étapes', () => {
  it('attribue un identifiant distinct à chaque étape', () => {
    const a = nouvelleEtape('stroop', {})
    const b = nouvelleEtape('stroop', {})
    expect(a.id).not.toBe(b.id)
    expect(a.gameId).toBe('stroop')
  })
})

describe('taux de réussite', () => {
  it('arrondit le pourcentage', () => {
    expect(pourcentage({ correct: 1, attempts: 3 })).toBe(33)
    expect(pourcentage({ correct: 3, attempts: 3 })).toBe(100)
  })

  it('reste indéfini sans essai', () => {
    expect(pourcentage({ correct: 0, attempts: 0 })).toBeNull()
    expect(pourcentage(null)).toBeNull()
  })
})
