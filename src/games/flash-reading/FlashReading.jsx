/**
 * Flash reading: identify a word shown very briefly.
 *
 * Three steps: ready, timed display, then a choice among orthographically
 * close lures.
 */
import { useEffect, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { pick, shuffle } from '../../lib/random.js'
import { SHORT_WORDS, LONG_WORDS } from './data.js'

function buildRound(config) {
  const entry = pick(config.length === 'long' ? LONG_WORDS : SHORT_WORDS)
  return {
    // The setting is expressed in tenths of a second.
    duration: config.duration * 100,
    word: entry.word,
    options: shuffle([entry.word, ...entry.distractors]),
  }
}

export default function FlashReading({ config, session }) {
  const rounds = useRounds(config.rounds)
  const [round, setRound] = useState(() => buildRound(config))
  const [phase, setPhase] = useState('ready') // ready -> flash -> choice
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  useEffect(() => {
    if (phase !== 'flash') return undefined
    const id = window.setTimeout(() => setPhase('choice'), round.duration)
    return () => window.clearTimeout(id)
  }, [phase, round])

  const answer = (word) => {
    if (!lock.take()) return
    setPicked(word)
    session.register(word === round.word)
  }

  const goNext = () => {
    lock.release()
    rounds.next()
    setRound(buildRound(config))
    setPicked(null)
    setPhase('ready')
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setRound(buildRound(config))
    setPicked(null)
    setPhase('ready')
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Mot {rounds.round + 1} sur {rounds.total}
      </p>

      {phase === 'ready' && (
        <>
          <p className="game-prompt">Prêt ? Le mot va apparaître très brièvement.</p>
          <button type="button" className="btn btn--lg" onClick={() => setPhase('flash')}>
            Afficher le mot
          </button>
        </>
      )}

      {phase === 'flash' && (
        <div className="flash-word" aria-live="assertive">
          {round.word}
        </div>
      )}

      {phase === 'choice' && (
        <>
          <p className="game-prompt">Quel mot as-tu vu ?</p>
          <div className="choice-grid choice-grid--wide">
            {round.options.map((word) => {
              let modifier = ''
              if (picked) {
                if (word === round.word) modifier = ' choice--correct'
                else if (word === picked) modifier = ' choice--wrong'
                else modifier = ' choice--dim'
              }
              return (
                <button
                  key={word}
                  type="button"
                  className={`choice${modifier}`}
                  disabled={Boolean(picked)}
                  onClick={() => answer(word)}
                >
                  {word}
                </button>
              )
            })}
          </div>

          {picked && (
            <>
              <Feedback
                status={picked === round.word ? 'correct' : 'wrong'}
                message={
                  picked === round.word
                    ? 'Exact !'
                    : `Le mot affiché était « ${round.word} ».`
                }
              />
              <div className="game-actions">
                <button type="button" className="btn btn--lg" onClick={goNext}>
                  Mot suivant
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
