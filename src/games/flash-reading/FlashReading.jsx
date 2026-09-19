/**
 * Flash reading: identify a word shown very briefly.
 *
 * Three steps: ready, timed display, then a choice among orthographically
 * close lures.
 */
import { useEffect, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { noRepeatSeries, shuffle } from '../../lib/random.js'
import { SHORT_WORDS, LONG_WORDS } from './data.js'

/** The whole session's words, drawn upfront so the same word cannot come
 * back twice within a series while the pool has enough to avoid it. */
function buildSeries(config) {
  const pool = config.length === 'long' ? LONG_WORDS : SHORT_WORDS
  return noRepeatSeries(pool, config.rounds).map((entry) => ({
    // The setting is expressed in tenths of a second.
    duration: config.duration * 100,
    word: entry.word,
    options: shuffle([entry.word, ...entry.distractors]),
  }))
}

export default function FlashReading({ config, session }) {
  const [series, setSeries] = useState(() => buildSeries(config))
  const rounds = useRounds(series.length, session)
  const round = series[rounds.round]
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
    setPicked(null)
    setPhase('ready')
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setSeries(buildSeries(config))
    setPicked(null)
    setPhase('ready')
  }

  if (rounds.isOver || !round) {
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
              const state = answerState(word, { picked, expected: round.word })
              const dim = picked && !state ? ' choice--dim' : ''
              return (
                <button
                  key={word}
                  type="button"
                  className={`choice${stateClass(state)}${dim}`}
                  disabled={Boolean(picked)}
                  onClick={() => answer(word)}
                >
                  {word}
                  <StateMark state={state} />
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
