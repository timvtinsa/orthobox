/**
 * The four domains, and the lookups every game and page rely on.
 */
import { describe, expect, it } from 'vitest'
import {
  CATEGORIES,
  CATEGORY_IDS,
  categoryStyle,
  getCategory,
  isCategoryId,
} from '../src/lib/categories.js'

describe('categories', () => {
  it('exposes exactly four domains, each with the fields a game relies on', () => {
    expect(CATEGORIES).toHaveLength(4)
    for (const category of CATEGORIES) {
      expect(category.id).toBeTruthy()
      expect(category.label).toBeTruthy()
      expect(category.pastel).toMatch(/^#/)
      expect(category.ink).toMatch(/^#/)
      expect(category.tint).toMatch(/^#/)
      expect(category.shape).toBeTruthy()
    }
  })

  it('gives every domain a unique id', () => {
    expect(new Set(CATEGORY_IDS).size).toBe(CATEGORY_IDS.length)
  })

  it('looks a category up by id', () => {
    expect(getCategory('oral-language')).toBe(CATEGORIES[0])
    expect(getCategory('no-such-domain')).toBeNull()
  })

  it('recognises only the four known ids', () => {
    expect(isCategoryId('oral-language')).toBe(true)
    expect(isCategoryId('no-such-domain')).toBe(false)
  })
})

describe('categoryStyle', () => {
  it('exposes a category as CSS custom properties', () => {
    const category = getCategory('math-cognition')
    expect(categoryStyle(category)).toEqual({
      '--category': category.ink,
      '--category-pastel': category.pastel,
      '--category-tint': category.tint,
      '--category-shape': `var(--shape-${category.shape})`,
    })
  })

  it('is undefined for no category, rather than a style full of undefined values', () => {
    expect(categoryStyle(null)).toBeUndefined()
  })
})
