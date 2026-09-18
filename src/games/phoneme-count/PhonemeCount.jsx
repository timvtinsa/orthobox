/**
 * How many sounds? Phonemic awareness, one step finer than the syllable.
 *
 * The sibling of « Combien de syllabes ? », on a smaller unit: a syllable can
 * hold several sounds (« chat » is one syllable, two sounds), so the two
 * games rarely agree on the same word, which is the point of proposing this
 * one once syllables are settled.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { pick } from '../../lib/random.js'
import { WORDS_BY_PHONEMES } from './data.js'

function buildRound(config) {
  const counts = config.range === 'upTo5' ? [2, 3, 4, 5] : [2, 3]
  const count = pick(counts)
  return { word: pick(WORDS_BY_PHONEMES[count]), count, counts }
}

export default function PhonemeCount({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [round, setRound] = useState(() => buildRound(config))
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const answer = (value) => {
    if (!lock.take()) return
    setPicked(value)
    session.register(value === round.count)
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

  return (
    <div className="game-board">
      <p className="game-round">
        Mot {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">Combien de sons ?</p>

      <div className="syllable-word">
        {config.written === 'shown' ? (
          <span className="syllable-word__text">{round.word}</span>
        ) : (
          <span className="syllable-word__hidden" aria-hidden="true" />
        )}
        <SpeakButton text={round.word} label="Écouter le mot" />
      </div>

      <div className="choice-grid">
        {round.counts.map((value) => {
          const state = answerState(value, { picked, expected: round.count })
          return (
            <button
              key={value}
              type="button"
              className={`choice choice--number${stateClass(state)}`}
              disabled={picked !== null}
              onClick={() => answer(value)}
            >
              {value}
              <StateMark state={state} />
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <>
          <Feedback
            status={picked === round.count ? 'correct' : 'wrong'}
            message={picked === round.count ? undefined : `${round.word} : ${round.count} sons.`}
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
