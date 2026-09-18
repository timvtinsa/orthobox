/**
 * Story details: read a text, then answer questions about it.
 *
 * The text disappears during the questions, and the option order is reshuffled
 * on every run so positions cannot be learnt.
 */
import { useState } from 'react'
import MultipleChoice from '../../components/MultipleChoice.jsx'
import Feedback from '../../components/Feedback.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { pick, shuffle } from '../../lib/random.js'
import { STORIES } from './data.js'

function pickStory(length, previous) {
  const byLength = STORIES.filter((story) => story.length === length)
  const pool = byLength.length > 0 ? byLength : STORIES
  const fresh = pool.filter((story) => story.id !== previous)
  return pick(fresh.length > 0 ? fresh : pool)
}

/** The option order is shuffled on every run. */
function prepareQuestions(story) {
  return story.questions.map((question) => {
    const right = question.options[question.answer]
    const options = shuffle(question.options)
    return { ...question, options, answer: options.indexOf(right) }
  })
}

export default function StoryDetails({ config, session }) {
  const [story, setStory] = useState(() => pickStory(config.length))
  const [questions, setQuestions] = useState(() => prepareQuestions(story))
  const [phase, setPhase] = useState('reading')
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const lock = useAnswerLock()

  const question = questions[index]

  const answer = (option) => {
    if (!lock.take()) return
    const correct = option === question.answer
    session.register(correct)
    if (correct) setCorrectCount(correctCount + 1)
    setChoice(option)
  }

  const goNext = () => {
    lock.release()
    setChoice(null)
    if (index + 1 >= questions.length) setPhase('results')
    else setIndex(index + 1)
  }

  const newStory = () => {
    const next = pickStory(config.length, story.id)
    setStory(next)
    setQuestions(prepareQuestions(next))
    setPhase('reading')
    setIndex(0)
    setChoice(null)
    setCorrectCount(0)
    lock.release()
  }

  if (phase === 'reading') {
    return (
      <div className="game-board">
        <p className="game-round">Lecture · {story.questions.length} questions ensuite</p>

        <article className="story">
          <h2 className="story__title">{story.title}</h2>
          {story.text.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>

        <p className="game-instruction">
          Le texte disparaît dès que les questions commencent : il faut retenir les détails
          (noms, nombres, couleurs, moments de la journée).
        </p>

        <div className="game-actions">
          <SpeakButton text={story.text.join(' ')} label="Lire le texte à voix haute" />
          <button type="button" className="btn btn--lg" onClick={() => setPhase('questions')}>
            J’ai fini de lire
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'questions') {
    return (
      <div className="game-board">
        <p className="game-round">
          Question {index + 1} sur {questions.length}
        </p>

        <div className="quiz">
          <p className="quiz__question">{question.question}</p>
          <MultipleChoice
            options={question.options}
            correct={question.answer}
            choice={choice}
            onChoose={answer}
          />
        </div>

        {choice !== null && (
          <>
            <Feedback status={choice === question.answer ? 'correct' : 'wrong'} />
            <div className="game-actions">
              <button type="button" className="btn btn--lg" onClick={goNext}>
                {index + 1 >= questions.length ? 'Voir le résultat' : 'Question suivante'}
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="game-final">
      <p className="game-round">Résultat : {story.title}</p>
      <p className="game-final__score">
        {correctCount} / {questions.length}
      </p>
      <p className="muted">
        {correctCount === questions.length
          ? 'Tous les détails ont été retenus.'
          : 'Relire le texte ensemble permet de repérer les détails passés inaperçus.'}
      </p>

      <div className="game-actions">
        <button type="button" className="btn btn--ghost" onClick={() => setPhase('reading')}>
          Relire ce texte
        </button>
        <button type="button" className="btn btn--lg" onClick={newStory}>
          Autre histoire
        </button>
      </div>
    </div>
  )
}
