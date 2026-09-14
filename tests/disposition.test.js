import { describe, expect, it } from 'vitest'
import { placerSurGrille } from '../src/lib/disposition.js'

describe('placement sur grille', () => {
  it('produit autant de positions que d’éléments', () => {
    expect(placerSurGrille(24).positions).toHaveLength(24)
    expect(placerSurGrille(1).positions).toHaveLength(1)
  })

  it('garde les positions dans le cadre', () => {
    const { positions } = placerSurGrille(80)
    for (const position of positions) {
      expect(position.left).toBeGreaterThan(0)
      expect(position.left).toBeLessThan(100)
      expect(position.top).toBeGreaterThan(0)
      expect(position.top).toBeLessThan(100)
    }
  })

  it('prévoit assez de cases pour tous les éléments', () => {
    const { colonnes, lignes } = placerSurGrille(30)
    expect(colonnes * lignes).toBeGreaterThanOrEqual(30)
  })

  it('ne superpose pas deux éléments', () => {
    const { positions } = placerSurGrille(40)
    const cles = positions.map((position) => `${Math.round(position.left)}-${Math.round(position.top)}`)
    expect(new Set(cles).size).toBe(positions.length)
  })
})
