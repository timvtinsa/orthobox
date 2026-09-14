/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readJson, writeJson } from '../src/lib/storage.js'

describe('stockage local', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  it('relit ce qui a été écrit', () => {
    writeJson('essai', { a: 1 })
    expect(readJson('essai', null)).toEqual({ a: 1 })
  })

  it('rend la valeur de repli quand la clé est absente', () => {
    expect(readJson('jamais-ecrit', 'repli')).toBe('repli')
  })

  it('résiste à un contenu illisible', () => {
    window.localStorage.setItem('orthobox:casse', '{ pas du json')
    expect(readJson('casse', [])).toEqual([])
  })

  it('ne lève pas quand le stockage est refusé', () => {
    vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    expect(writeJson('essai', 1)).toBe(false)
  })
})
