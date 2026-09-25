/**
 * Speech synthesis wrapper: a stub `window.speechSynthesis` stands in for the
 * real Web Speech API, which the node test environment does not provide.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

class FakeUtterance {
  constructor(text) {
    this.text = text
  }
}

function installSpeechSynthesis({ voices = [] } = {}) {
  const spoken = []
  const synthesis = {
    getVoices: () => voices,
    cancel: vi.fn(),
    speak: vi.fn((utterance) => spoken.push(utterance)),
  }
  globalThis.window = {
    speechSynthesis: synthesis,
    SpeechSynthesisUtterance: FakeUtterance,
    setTimeout: (...args) => setTimeout(...args),
    clearTimeout: (...args) => clearTimeout(...args),
  }
  return { synthesis, spoken }
}

describe('speech synthesis', () => {
  afterEach(() => {
    delete globalThis.window
    vi.resetModules()
  })

  it('is unavailable without a window', async () => {
    delete globalThis.window
    const { isSpeechAvailable } = await import('../src/lib/speech.js')
    expect(isSpeechAvailable()).toBe(false)
  })

  it('is unavailable when the browser offers no speechSynthesis', async () => {
    globalThis.window = {}
    const { isSpeechAvailable } = await import('../src/lib/speech.js')
    expect(isSpeechAvailable()).toBe(false)
  })

  describe('with speechSynthesis available', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    it('speaks the given text in French', async () => {
      const { synthesis, spoken } = installSpeechSynthesis()
      const { speak } = await import('../src/lib/speech.js')

      expect(speak('Bonjour')).toBe(true)
      expect(synthesis.cancel).toHaveBeenCalled()
      expect(spoken).toHaveLength(1)
      expect(spoken[0].text).toBe('Bonjour')
      expect(spoken[0].lang).toBe('fr-FR')
    })

    it('picks a French voice when one is offered', async () => {
      const frenchVoice = { lang: 'fr-FR', name: 'Amélie' }
      const { spoken } = installSpeechSynthesis({
        voices: [{ lang: 'en-US', name: 'Sam' }, frenchVoice],
      })
      const { speak } = await import('../src/lib/speech.js')

      speak('Bonjour')
      expect(spoken[0].voice).toBe(frenchVoice)
    })

    it('leaves the voice unset when none is French', async () => {
      const { spoken } = installSpeechSynthesis({ voices: [{ lang: 'en-US', name: 'Sam' }] })
      const { speak } = await import('../src/lib/speech.js')

      speak('Bonjour')
      expect(spoken[0].voice).toBeUndefined()
    })

    it('returns false and speaks nothing when synthesis throws', async () => {
      const { synthesis } = installSpeechSynthesis()
      synthesis.speak = vi.fn(() => {
        throw new Error('synthesis unavailable')
      })
      const { speak } = await import('../src/lib/speech.js')

      expect(speak('Bonjour')).toBe(false)
    })
  })

  describe('speakSequence', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    it('reports false and calls onDone immediately for an empty list', async () => {
      installSpeechSynthesis()
      const { speakSequence } = await import('../src/lib/speech.js')
      const onDone = vi.fn()

      expect(speakSequence([], { onDone })).toBe(false)
      expect(onDone).toHaveBeenCalledOnce()
    })

    it('speaks every word in order, then calls onDone', async () => {
      vi.useFakeTimers()
      const { synthesis, spoken } = installSpeechSynthesis()
      synthesis.speak = vi.fn((utterance) => {
        spoken.push(utterance)
        utterance.onend?.()
      })
      const { speakSequence } = await import('../src/lib/speech.js')
      const onDone = vi.fn()

      speakSequence(['un', 'deux', 'trois'], { pause: 10, onDone })
      await vi.runAllTimersAsync()

      expect(spoken.map((utterance) => utterance.text)).toEqual(['un', 'deux', 'trois'])
      expect(onDone).toHaveBeenCalledOnce()
      vi.useRealTimers()
    })
  })
})
