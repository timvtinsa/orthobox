import { describe, expect, it } from 'vitest'
import { PIECES, formaterMontant } from '../src/games/la-monnaie/pieces.jsx'

describe('montants en euros', () => {
  it('affiche toujours deux décimales, à la française', () => {
    expect(formaterMontant(100)).toBe('1,00 €')
    expect(formaterMontant(250)).toBe('2,50 €')
    expect(formaterMontant(5)).toBe('0,05 €')
  })
})

describe('pièces et billets', () => {
  it('couvre les valeurs courantes, en centimes', () => {
    expect(PIECES.map((piece) => piece.valeur)).toEqual([1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000])
  })

  it('permet de composer n’importe quel multiple de 5 centimes', () => {
    const valeurs = PIECES.map((piece) => piece.valeur)
    for (let montant = 5; montant <= 500; montant += 5) {
      let reste = montant
      for (const valeur of [...valeurs].reverse()) {
        while (reste >= valeur) reste -= valeur
      }
      expect(reste, `montant ${montant}`).toBe(0)
    }
  })
})
