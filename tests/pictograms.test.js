/**
 * The hand-drawn pictogram bank: only its catalogue (id + label) is data the
 * rest of the application relies on. The drawings themselves are checked
 * visually, in a real browser.
 */
import { describe, expect, it } from 'vitest'
import { PICTOGRAMS } from '../src/lib/pictograms.jsx'

describe('PICTOGRAMS', () => {
  it('gives every drawing a unique id', () => {
    const ids = PICTOGRAMS.map((picto) => picto.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every drawing a non-empty French label', () => {
    expect(PICTOGRAMS.length).toBeGreaterThan(0)
    for (const picto of PICTOGRAMS) {
      expect(picto.label).toBeTruthy()
    }
  })
})
