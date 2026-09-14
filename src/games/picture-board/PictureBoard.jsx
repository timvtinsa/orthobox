/**
 * Picture board: memorisation, then visual recognition.
 *
 * The test shows as many new pictures as pictures from the board, which tells
 * forgotten items apart from false memories.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import StudyPhase from '../../components/StudyPhase.jsx'
import { PICTOGRAMS, Pictogram } from '../../lib/pictograms.jsx'
import { sample, shuffle } from '../../lib/random.js'

function prepare({ count }) {
  const drawn = sample(PICTOGRAMS, Math.min(count * 2, PICTOGRAMS.length))
  const board = drawn.slice(0, count)
  const oddOne = drawn.slice(count)
  const trials = shuffle([
    ...board.map((pictogram) => ({ pictogram, onBoard: true })),
    ...oddOne.map((pictogram) => ({ pictogram, onBoard: false })),
  ])
  return { board, trials }
}

export default function PictureBoard({ config, session }) {
  const [phase, setPhase] = useState('study')
  const [game, setGame] = useState(() => prepare(config))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [last, setLast] = useState(null)

  const withLabels = config.labels === 'shown'

  const restart = () => {
    setGame(prepare(config))
    setIndex(0)
    setAnswers([])
    setLast(null)
    setPhase('study')
  }

  const answer = (answeredYes) => {
    const trial = game.trials[index]
    const correct = answeredYes === trial.onBoard
    session.register(correct)
    setAnswers((current) => [...current, { ...trial, correct }])
    setLast(correct ? 'correct' : 'wrong')
    if (index + 1 >= game.trials.length) setPhase('results')
    else setIndex(index + 1)
  }

  if (phase === 'study') {
    return (
      <StudyPhase
        seconds={config.duration}
        instruction="Retiens bien ces images"
        onDone={() => setPhase('test')}
      >
        <ul className="picture-grid">
          {game.board.map(({ id, label }) => (
            <li key={id} className="picture-card">
              <Pictogram id={id} title={withLabels ? undefined : label} />
              {withLabels && <span className="picture-card__label">{label}</span>}
            </li>
          ))}
        </ul>
      </StudyPhase>
    )
  }

  if (phase === 'test') {
    const { pictogram } = game.trials[index]
    return (
      <div className="game-board">
        <p className="game-round">
          Image {index + 1} sur {game.trials.length}
        </p>
        <p className="game-prompt">Cette image était-elle affichée ?</p>

        <div className="picture-card picture-card--large">
          <Pictogram id={pictogram.id} size={132} title={pictogram.label} />
        </div>

        <div className="game-actions">
          <button type="button" className="btn btn--lg" onClick={() => answer(true)}>
            Oui, elle y était
          </button>
          <button type="button" className="btn btn--ghost btn--lg" onClick={() => answer(false)}>
            Non, elle est nouvelle
          </button>
        </div>

        <Feedback status={last} message={last === null ? ' ' : undefined} />
      </div>
    )
  }

  const correctCount = answers.filter((item) => item.correct).length
  const missed = answers.filter((item) => item.onBoard && !item.correct)

  return (
    <div className="game-final">
      <p className="game-round">Résultats</p>
      <p className="game-final__score">
        {correctCount} / {answers.length}
      </p>

      <ul className="picture-grid">
        {game.board.map(({ id, label }) => {
          const wasMissed = missed.some((item) => item.pictogram.id === id)
          return (
            <li
              key={id}
              className={`picture-card ${wasMissed ? 'picture-card--wrong' : 'picture-card--correct'}`}
            >
              <Pictogram id={id} size={56} title={label} />
              <span className="picture-card__label">{label}</span>
            </li>
          )
        })}
      </ul>

      <div className="game-actions">
        <button type="button" className="btn btn--lg" onClick={restart}>
          Nouvelle planche
        </button>
      </div>
    </div>
  )
}
