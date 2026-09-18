/**
 * Le contraire: word retrieval through an antonym rather than a definition.
 *
 * Structurally the sibling of « L'intrus de la famille », but positive
 * rather than an odd one out: no family to spot, just the one word among
 * four that means the opposite of the one given.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { pick, sample, shuffle } from '../../lib/random.js'
import { PAIRS } from './data.js'

function buildRound() {
  const pair = pick(PAIRS)
  const flipped = Math.random() < 0.5
  const prompt = flipped ? pair[1] : pair[0]
  const answer = flipped ? pair[0] : pair[1]

  // Un intrus vient de n'importe quelle autre paire : deux mots issus de la
  // même paire ne se retrouvent jamais parmi les options.
  const otherWords = PAIRS.filter((entry) => entry !== pair).flat()
  const distractors = sample(otherWords, 3)

  return { prompt, answer, options: shuffle([answer, ...distractors]) }
}

export default function Opposites({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [round, setRound] = useState(buildRound)
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const answer = (word) => {
    if (!lock.take()) return
    setPicked(word)
    session.register(word === round.answer)
  }

  const goNext = () => {
    lock.release()
    rounds.next()
    setRound(buildRound())
    setPicked(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setRound(buildRound())
    setPicked(null)
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Mot {rounds.round + 1} sur {rounds.total}
      </p>

      <div className="syllable-word">
        <span className="syllable-word__text">{round.prompt}</span>
        <SpeakButton text={round.prompt} label="Écouter le mot" />
      </div>

      <p className="game-prompt">Quel est son contraire ?</p>

      <div className="choice-grid">
        {round.options.map((word) => {
          const state = answerState(word, { picked, expected: round.answer })
          const dim = picked && !state ? ' choice--dim' : ''
          return (
            <div key={word} className="choice-card">
              <button
                type="button"
                className={`choice${stateClass(state)}${dim}`}
                disabled={Boolean(picked)}
                onClick={() => answer(word)}
              >
                {word}
                <StateMark state={state} />
              </button>
              <SpeakButton text={word} label="Écouter le mot" />
            </div>
          )
        })}
      </div>

      {picked && (
        <>
          <Feedback
            status={picked === round.answer ? 'correct' : 'wrong'}
            message={
              picked === round.answer
                ? undefined
                : `Le contraire de « ${round.prompt} » est « ${round.answer} ».`
            }
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Mot suivant
            </button>
          </div>
        </>
      )}
    </div>
  )
}
