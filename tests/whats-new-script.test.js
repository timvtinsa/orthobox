import { describe, expect, it } from 'vitest'
import { MAX_HIGHLIGHTS, buildPrompt, extractHighlights, whatsNewFor } from '../scripts/write-whats-new.mjs'

describe('write-whats-new', () => {
  it('puts the tag and the commit log in the prompt', () => {
    const prompt = buildPrompt('v0.6.0', 'feat: add a game\n---')
    expect(prompt).toContain('v0.6.0')
    expect(prompt).toContain('feat: add a game')
  })

  it('reads a plain JSON answer', () => {
    expect(extractHighlights('{"highlights": ["Un nouveau jeu."]}')).toEqual(['Un nouveau jeu.'])
  })

  it('reads an answer wrapped in a code fence and a sentence', () => {
    const answer = 'Voici :\n```json\n{"highlights": [" Un jeu. ", "Un autre."]}\n```'
    expect(extractHighlights(answer)).toEqual(['Un jeu.', 'Un autre.'])
  })

  it('accepts an empty list: a release can have nothing to announce', () => {
    expect(extractHighlights('{"highlights": []}')).toEqual([])
  })

  it('rejects answers that are not a usable list', () => {
    expect(() => extractHighlights('Désolé, je ne peux pas.')).toThrow()
    expect(() => extractHighlights('{"highlights": "oops"}')).toThrow()
    expect(() => extractHighlights('{"highlights": ["Ok.", ""]}')).toThrow()
    expect(() => extractHighlights('{"highlights": [3]}')).toThrow()
  })

  it('asks for three highlights and keeps no more than that', () => {
    expect(buildPrompt('v1.0.0', 'x')).toContain('three main highlights at most')
    const many = JSON.stringify({ highlights: ['A.', 'B.', 'C.', 'D.', 'E.'] })
    expect(extractHighlights(many)).toEqual(['A.', 'B.', 'C.'])
    expect(MAX_HIGHLIGHTS).toBe(3)
  })

  it('strips the leading v from the version', () => {
    expect(whatsNewFor('v0.6.0', ['A.'])).toEqual({ version: '0.6.0', highlights: ['A.'] })
  })
})
