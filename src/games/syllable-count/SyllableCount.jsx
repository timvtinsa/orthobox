/**
 * How many syllables? Syllabic awareness, counted rather than clapped.
 *
 * The word is written and can be heard: a patient who does not read yet works
 * from the voice, one who reads works from both, and the practitioner chooses
 * by showing or hiding the written form.
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
import { WORDS_BY_SYLLABLES } from './data.js'

function buildRound(config) {
  const counts = config.range === 'upTo4' ? [1, 2, 3, 4] : [1, 2, 3]
  const count = pick(counts)
  return { word: pick(WORDS_BY_SYLLABLES[count]), count, counts }
}

export default function SyllableCount({ config, session }) {
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
      <p className="game-prompt">Combien de syllabes ?</p>

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
            message={picked === round.count ? undefined : `${round.word} : ${round.count} syllabes.`}
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
