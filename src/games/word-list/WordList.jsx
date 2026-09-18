/**
 * Word list: memorisation, then verbal recognition.
 *
 * The test shows as many new words as words from the list, which tells
 * forgotten items apart from false memories.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import StudyPhase from '../../components/StudyPhase.jsx'
import { COMMON_WORDS } from '../../lib/lexicon.js'
import { sample, shuffle } from '../../lib/random.js'

/**
 * Prepares one run: the words to memorise, then the series of trials (as many
 * shown words as new ones, shuffled together).
 */
function prepare({ count }) {
  const drawn = sample(COMMON_WORDS, count * 2)
  const list = drawn.slice(0, count)
  const oddOne = drawn.slice(count)
  const trials = shuffle([
    ...list.map((word) => ({ word, inList: true })),
    ...oddOne.map((word) => ({ word, inList: false })),
  ])
  return { list, trials }
}

export default function WordList({ config, session }) {
  const [phase, setPhase] = useState('study')
  const [game, setGame] = useState(() => prepare(config))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [last, setLast] = useState(null)

  const restart = () => {
    setGame(prepare(config))
    setIndex(0)
    setAnswers([])
    setLast(null)
    setPhase('study')
  }

  const answer = (answeredYes) => {
    const trial = game.trials[index]
    const correct = answeredYes === trial.inList
    session.register(correct)
    setAnswers((current) => [...current, { ...trial, answeredYes, correct }])
    setLast(correct ? 'correct' : 'wrong')
    if (index + 1 >= game.trials.length) {
      setPhase('results')
    } else {
      setIndex(index + 1)
    }
  }

  if (phase === 'study') {
    return (
      <StudyPhase
        seconds={config.duration}
        instruction="Retiens bien ces mots"
        onDone={() => setPhase('test')}
      >
        <ul className="word-list">
          {game.list.map((word) => (
            <li key={word} className="word-list__item">
              {word}
            </li>
          ))}
        </ul>
      </StudyPhase>
    )
  }

  if (phase === 'test') {
    const trial = game.trials[index]
    return (
      <div className="game-board">
        <p className="game-round">
          Mot {index + 1} sur {game.trials.length}
        </p>
        <p className="game-prompt">Ce mot était-il dans la liste ?</p>
        <p className="flash-word">{trial.word}</p>

        <div className="game-actions">
          <button type="button" className="btn btn--lg" onClick={() => answer(true)}>
            Oui, il y était
          </button>
          <button type="button" className="btn btn--ghost btn--lg" onClick={() => answer(false)}>
            Non, il est nouveau
          </button>
        </div>

        <Feedback status={last} message={last === null ? ' ' : undefined} />
      </div>
    )
  }

  const missed = answers.filter((item) => item.inList && !item.correct)
  const falseAlarms = answers.filter((item) => !item.inList && !item.correct)
  const correctCount = answers.filter((item) => item.correct).length

  return (
    <div className="game-final">
      <p className="game-round">Résultats</p>
      <p className="game-final__score">
        {correctCount} / {answers.length}
      </p>
      <p className="muted">
        {missed.length} mot{missed.length > 1 ? 's' : ''} de la liste non reconnu
        {missed.length > 1 ? 's' : ''} · {falseAlarms.length} mot
        {falseAlarms.length > 1 ? 's' : ''} nouveau{falseAlarms.length > 1 ? 'x' : ''} pris pour
        un mot de la liste
      </p>

      <div className="recall-chips">
        {game.list.map((word) => (
          <span
            key={word}
            className={`chip ${missed.some((item) => item.word === word) ? 'chip--missed' : 'chip--found'}`}
          >
            {word}
          </span>
        ))}
      </div>

      <div className="game-actions">
        <button type="button" className="btn btn--lg" onClick={restart}>
          Nouvelle liste
        </button>
      </div>
    </div>
  )
}
