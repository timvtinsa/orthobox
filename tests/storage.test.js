import { afterEach, describe, expect, it } from 'vitest'
import { installerStockage, retirerStockage } from './faux-stockage.js'
import { readJson, writeJson } from '../src/lib/storage.js'

describe('stockage local', () => {
  afterEach(retirerStockage)

  it('relit ce qui a été écrit', () => {
    installerStockage()
    writeJson('essai', { a: 1 })
    expect(readJson('essai', null)).toEqual({ a: 1 })
  })

  it('préfixe les clés pour ne pas écraser celles d’une autre application', () => {
    const stockage = installerStockage()
    writeJson('favoris', ['stroop'])
    expect(stockage.getItem('orthobox:favoris')).toBe('["stroop"]')
  })

  it('rend la valeur de repli quand la clé est absente', () => {
    installerStockage()
    expect(readJson('jamais-ecrit', 'repli')).toBe('repli')
  })

  it('résiste à un contenu illisible', () => {
    const stockage = installerStockage()
    stockage.setItem('orthobox:casse', '{ pas du json')
    expect(readJson('casse', [])).toEqual([])
  })

  it('ne lève pas quand le stockage est refusé', () => {
    installerStockage({ enEchec: true })
    expect(writeJson('essai', 1)).toBe(false)
  })

  it('ne lève pas quand le stockage est absent', () => {
    expect(readJson('essai', 'repli')).toBe('repli')
    expect(writeJson('essai', 1)).toBe(false)
  })
})
