import { pick, shuffle } from '../../lib/random.js'
import { STORIES } from './data.js'

export function pickStory(length, previous) {
  const byLength = STORIES.filter((story) => story.length === length)
  const pool = byLength.length > 0 ? byLength : STORIES
  const fresh = pool.filter((story) => story.id !== previous)
  return pick(fresh.length > 0 ? fresh : pool)
}

/** The option order is shuffled on every run. */
export function prepareQuestions(story) {
  return story.questions.map((question) => {
    const right = question.options[question.answer]
    const options = shuffle(question.options)
    return { ...question, options, answer: options.indexOf(right) }
  })
}
