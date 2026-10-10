import { describe, expect, it } from 'vitest'
import { TEXTS, TOPICS, TOPIC_COUNTS } from '../src/games/word-endings/data.js'
import {
  buildSeries,
  completeText,
  correctWord,
  countRight,
  gapsOf,
  isComplete,
  isRight,
  parseText,
  pool,
} from '../src/games/word-endings/logic.js'

describe('word endings: the texts', () => {
  it('has at least six texts for each topic', () => {
    for (const topic of TOPICS) expect(TOPIC_COUNTS[topic], topic).toBeGreaterThanOrEqual(6)
  })

  it('gives every text three gaps, each with a reason', () => {
    for (const entry of TEXTS) {
      const gaps = gapsOf({ parts: parseText(entry.text) })
      expect(gaps, entry.text).toHaveLength(3)
      for (const gap of gaps) {
        // A gap has a stem to complete, or is a whole word to choose.
        expect(gap.stem.length + gap.answer.length, entry.text).toBeGreaterThan(0)
        expect(gap.why.length, entry.text).toBeGreaterThan(10)
      }
    }
  })

  it('offers, for every gap, the right ending among at least three endings', () => {
    for (const entry of TEXTS) {
      expect(entry.options.length, entry.text).toBeGreaterThanOrEqual(3)
      expect(new Set(entry.options).size, entry.text).toBe(entry.options.length)
      for (const gap of gapsOf({ parts: parseText(entry.text) })) {
        expect(entry.options, entry.text).toContain(gap.answer)
      }
    }
  })

  it('leaves no brace or bar of the gap syntax in the text itself', () => {
    for (const entry of TEXTS) {
      const plain = completeText({ parts: parseText(entry.text) })
      expect(plain, entry.text).not.toMatch(/[{}|]/)
    }
  })

  it('uses every ending of a topic at least once as the right answer', () => {
    for (const topic of ['infinitive', 'tenses']) {
      const answers = new Set(
        TEXTS.filter((entry) => entry.topic === topic).flatMap((entry) =>
          gapsOf({ parts: parseText(entry.text) }).map((gap) => gap.answer),
        ),
      )
      const offered = TEXTS.find((entry) => entry.topic === topic).options
      expect([...answers].sort(), topic).toEqual([...offered].sort())
    }
  })

  it('never mixes prefix and suffix gaps in a text, and offers whole words for pronouns and forms', () => {
    for (const entry of TEXTS) {
      const gaps = gapsOf({ parts: parseText(entry.text) })
      if (entry.topic === 'derivation' && gaps.some((gap) => gap.before)) {
        for (const gap of gaps) expect(gap.before, entry.text).toBe(true)
      }
      if (entry.topic === 'pronouns' || entry.topic === 'inflection') {
        for (const gap of gaps) expect(gap.stem, entry.text).toBe('')
      }
    }
  })

  it('writes no em dash in patient-facing text', () => {
    for (const entry of TEXTS) expect(entry.text).not.toContain('—')
  })
})

describe('word endings: parsing and checking', () => {
  const round = { parts: parseText('Léo aime {march|er|Après « aime ».} et {jou|e|Pourquoi.} dehors. Un {petit||Rien.} chat.') }

  it('splits a text into words and gaps, in order', () => {
    expect(round.parts.map((part) => part.type)).toEqual(['text', 'gap', 'text', 'gap', 'text', 'gap', 'text'])
    expect(gapsOf(round).map((gap) => gap.id)).toEqual([0, 1, 2])
  })

  it('reads a prefix gap, whose list comes before the stem', () => {
    const prefixed = { parts: parseText('C’est {^possible|im|Devant p.} !') }
    const gap = gapsOf(prefixed)[0]
    expect(gap).toMatchObject({ stem: 'possible', answer: 'im', before: true })
    expect(correctWord(gap)).toBe('impossible')
    expect(completeText(prefixed)).toBe('C’est impossible !')
    expect(gapsOf(round)[0].before).toBe(false)
  })

  it('reads a gap with no stem as a whole word to choose', () => {
    const whole = { parts: parseText('Léa dort car {|elle|Une fille.} est fatiguée.') }
    const gap = gapsOf(whole)[0]
    expect(gap).toMatchObject({ stem: '', answer: 'elle' })
    expect(completeText(whole)).toBe('Léa dort car elle est fatiguée.')
  })

  it('reads an empty ending as « nothing to add »', () => {
    const gap = gapsOf(round)[2]
    expect(gap).toMatchObject({ stem: 'petit', answer: '' })
    expect(correctWord(gap)).toBe('petit')
  })

  it('rebuilds the complete text, endings on', () => {
    expect(completeText(round)).toBe('Léo aime marcher et joue dehors. Un petit chat.')
  })

  it('tells a complete round from a partial one, and counts the right ones', () => {
    expect(isComplete(round, { 0: 'er' })).toBe(false)
    const picks = { 0: 'er', 1: 'es', 2: '' }
    expect(isComplete(round, picks)).toBe(true)
    expect(isRight(gapsOf(round)[0], picks)).toBe(true)
    expect(isRight(gapsOf(round)[1], picks)).toBe(false)
    // « (rien) » picked is a pick like another: the empty ending is right here.
    expect(isRight(gapsOf(round)[2], picks)).toBe(true)
    expect(countRight(round, picks)).toBe(2)
  })

  it('does not take an unanswered gap for the empty ending', () => {
    expect(isComplete(round, { 0: 'er', 1: 'e' })).toBe(false)
    expect(isRight(gapsOf(round)[2], { 0: 'er', 1: 'e' })).toBe(false)
  })
})

describe('word endings: the series', () => {
  it('draws only the topic asked for, each text once before any comes back', () => {
    for (const topic of TOPICS) {
      for (let run = 0; run < 40; run += 1) {
        const series = buildSeries({ topic, rounds: 6 })
        expect(series).toHaveLength(6)
        for (const round of series) expect(round.topic).toBe(topic)
        const texts = series.map((round) => completeText(round))
        expect(new Set(texts).size).toBe(6)
      }
    }
  })

  it('mixes the topics on request', () => {
    expect(pool('mixed')).toHaveLength(TEXTS.length)
    const seen = new Set()
    for (let run = 0; run < 40; run += 1) buildSeries({ topic: 'mixed', rounds: 6 }).forEach((round) => seen.add(round.topic))
    expect(seen.size).toBe(TOPICS.length)
  })
})
