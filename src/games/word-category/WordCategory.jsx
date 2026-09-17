/**
 * The odd one out by meaning: several words from one family, one from another.
 *
 * The sibling of « L'intrus sonore », on the other axis: there the words were
 * sorted by their sound, here by what they mean. The family can be named
 * beforehand, which turns a search into a check.
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
import { FAMILIES } from './data.js'

function buildRound(config) {
  const size = config.size === 'five' ? 5 : 4
  const family = pick(FAMILIES)
  const other = pick(FAMILIES.filter((entry) => entry.id !== family.id))
  const kept = sample(family.words, size - 1)
  const intruder = pick(other.words)
  return { family, intruder, options: shuffle([...kept, intruder]) }
}

export default function WordCategory({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [round, setRound] = useState(() => buildRound(config))
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const answer = (word) => {
    if (!lock.take()) return
    setPicked(word)
    session.register(word === round.intruder)
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
    setRound(buildRound(config))
    setPicked(null)
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  const prompt =
    config.clue === 'named'
      ? `Quel mot n’est pas ${round.family.label} ?`
      : 'Quel mot ne va pas avec les autres ?'

  return (
    <div className="game-board">
      <p className="game-round">
        Série {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">{prompt}</p>

      <div className="choice-grid">
        {round.options.map((word) => {
          const state = answerState(word, { picked, expected: round.intruder })
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
            status={picked === round.intruder ? 'correct' : 'wrong'}
            message={
              picked === round.intruder
                ? undefined
                : `Les autres mots sont ${round.family.label}.`
            }
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Série suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
