import { afterEach, describe, expect, it } from 'vitest'
import { installStorage, removeStorage } from './fake-storage.js'
import { readJson, writeJson } from '../src/lib/storage.js'

describe('local storage', () => {
  afterEach(removeStorage)

  it('reads back what was written', () => {
    installStorage()
    writeJson('probe', { a: 1 })
    expect(readJson('probe', null)).toEqual({ a: 1 })
  })

  it('prefixes keys so another application is never overwritten', () => {
    const storage = installStorage()
    writeJson('favorites', ['stroop'])
    expect(storage.getItem('orthobox:favorites')).toBe('["stroop"]')
  })

  it('returns the fallback when the key is missing', () => {
    installStorage()
    expect(readJson('never-written', 'fallback')).toBe('fallback')
  })

  it('survives unreadable content', () => {
    const storage = installStorage()
    storage.setItem('orthobox:broken', '{ not json')
    expect(readJson('broken', [])).toEqual([])
  })

  it('does not throw when storage is refused', () => {
    installStorage({ failing: true })
    expect(writeJson('probe', 1)).toBe(false)
  })

  it('does not throw when storage is missing altogether', () => {
    expect(readJson('probe', 'fallback')).toBe('fallback')
    expect(writeJson('probe', 1)).toBe(false)
  })
})
