/**
 * Story picking and question shuffling: the questions must still point at
 * the right answer after the options are reshuffled, and the same story
 * should not repeat immediately when an alternative exists.
 */
import { describe, expect, it } from 'vitest'
import { pickStory, prepareQuestions } from '../src/games/story-details/logic.js'
import { STORIES } from '../src/games/story-details/data.js'

const RUNS = 200

describe('pickStory', () => {
  it('picks a story of the requested length', () => {
    for (const length of ['short', 'medium', 'long']) {
      const story = pickStory(length)
      expect(story.length).toBe(length)
    }
  })

  it('falls back to the whole bank for a length with no story', () => {
    const story = pickStory('no-such-length')
    expect(STORIES).toContainEqual(story)
  })

  it('avoids repeating the previous story when an alternative exists', () => {
    for (let run = 0; run < RUNS; run += 1) {
      const first = pickStory('short')
      const second = pickStory('short', first.id)
      const alternativesExist = STORIES.some(
        (story) => story.length === 'short' && story.id !== first.id,
      )
      if (alternativesExist) expect(second.id).not.toBe(first.id)
    }
  })
})

describe('prepareQuestions', () => {
  it('keeps every question pointing at its correct option after shuffling', () => {
    for (let run = 0; run < RUNS; run += 1) {
      for (const story of STORIES) {
        const prepared = prepareQuestions(story)
        prepared.forEach((question, index) => {
          const original = story.questions[index]
          const originalAnswerText = original.options[original.answer]
          expect(question.options[question.answer]).toBe(originalAnswerText)
        })
      }
    }
  })

  it('keeps the same set of options, only reordered', () => {
    const story = STORIES[0]
    const prepared = prepareQuestions(story)
    prepared.forEach((question, index) => {
      expect([...question.options].sort()).toEqual([...story.questions[index].options].sort())
    })
  })
})
