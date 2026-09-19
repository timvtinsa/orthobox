/**
 * Ink or word? A Stroop task.
 *
 * Response time is measured on every trial: it reveals the cost of inhibition
 * just as much as the score does.
 */
import { useEffect, useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { pick, shuffle } from '../../lib/random.js'

const COLORS = [
  { id: 'red', label: 'ROUGE', hex: '#d0342c' },
  { id: 'blue', label: 'BLEU', hex: '#2d5fd0' },
  { id: 'green', label: 'VERT', hex: '#1f8a4c' },
  { id: 'yellow', label: 'JAUNE', hex: '#e0b800' },
]

function buildRound(config) {
  const word = pick(COLORS)
  // During warmup, every other trial is congruent (word and ink match).
  const congruent = config.rule === 'warmup' ? Math.random() < 0.5 : false
  const ink = congruent ? word : pick(COLORS.filter((color) => color.id !== word.id))
  const prompt = config.rule === 'switching' ? pick(['ink', 'word']) : 'ink'
  return {
    word,
    ink,
    prompt,
    expected: prompt === 'ink' ? ink.id : word.id,
    options: shuffle(COLORS),
  }
}

export default function Stroop({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [round, setRound] = useState(() => buildRound(config))
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()
  const times = useRef([])
  const start = useRef(performance.now())

  // The stopwatch restarts when each new round is displayed.
  useEffect(() => {
    start.current = performance.now()
  }, [round])

  const answer = (colorId) => {
    if (!lock.take()) return
    const isCorrect = colorId === round.expected
    times.current.push(performance.now() - start.current)
    setPicked(colorId)
    session.register(isCorrect)
  }

  const goNext = () => {
    lock.release()
    rounds.next()
    setRound(buildRound(config))
    setPicked(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    times.current = []
    setRound(buildRound(config))
    setPicked(null)
  }

  if (rounds.isOver) {
    const average =
      times.current.length > 0
        ? times.current.reduce((sum, value) => sum + value, 0) / times.current.length / 1000
        : 0
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">Temps de réponse moyen : {average.toFixed(2)} s</p>
      </GameOver>
    )
  }

  const promptText =
    round.prompt === 'ink'
      ? 'Clique sur la COULEUR DE L’ENCRE'
      : 'Clique sur la couleur ÉCRITE (lis le mot)'

  return (
    <div className="game-board">
      <p className="game-round">
        Essai {rounds.round + 1} sur {rounds.total}
      </p>
      <p className={`stroop-rule${round.prompt === 'word' ? ' stroop-rule--switch' : ''}`}>
        {promptText}
      </p>

      <div className="stroop-word" style={{ color: round.ink.hex }}>
        {round.word.label}
      </div>

      <div className="choice-grid">
        {round.options.map((color) => {
          const state = answerState(color.id, { picked, expected: round.expected })
          const dim = picked && !state ? ' choice--dim' : ''
          return (
            <button
              key={color.id}
              type="button"
              className={`choice stroop-swatch${stateClass(state)}${dim}`}
              disabled={Boolean(picked)}
              onClick={() => answer(color.id)}
            >
              <span className="stroop-swatch__dot" style={{ background: color.hex }} />
              {color.label.toLowerCase()}
              <StateMark state={state} />
            </button>
          )
        })}
      </div>

      {picked && (
        <>
          <Feedback status={picked === round.expected ? 'correct' : 'wrong'} />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Essai suivant
            </button>
          </div>
        </>
      )}
    </div>
  )
}
