import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { installStorage, removeStorage } from './fake-storage.js'
import { MODES, readMode, writeMode } from '../src/lib/mode.js'

describe('display mode', () => {
  beforeEach(() => installStorage())
  afterEach(removeStorage)

  it('starts in adult mode', () => {
    expect(readMode()).toBe('adult')
  })

  it('keeps the chosen mode', () => {
    writeMode('child')
    expect(readMode()).toBe('child')
  })

  it('ignores an unknown value', () => {
    window.localStorage.setItem('orthobox:mode', '"martian"')
    expect(readMode()).toBe('adult')
  })

  it('offers exactly two modes', () => {
    expect(MODES.map((mode) => mode.id)).toEqual(['adult', 'child'])
  })
})
