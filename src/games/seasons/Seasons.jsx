/**
 * The four seasons: naming the season of a landscape, an object, a clue or a
 * month. Pictures are shown above the question and never name the answer.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { Landscape, SeasonObject } from './drawings.jsx'
import { buildSeries } from './logic.js'

function Picture({ picture }) {
  if (!picture) return null
  return (
    <div className="season-picture">
      {picture.type === 'landscape' ? <Landscape season={picture.season} /> : <SeasonObject id={picture.id} size={128} />}
    </div>
  )
}

export default function Seasons({ config, session }) {
  const [series, setSeries] = useState(() => buildSeries(config))
  const rounds = useRounds(series.length, session)
  const round = series[rounds.round]
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const answer = (season) => {
    if (!lock.take()) return
    setPicked(season)
    session.register(season === round.answer)
  }

  const goNext = () => {
    lock.release()
    rounds.next()
    setPicked(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setSeries(buildSeries(config))
    setPicked(null)
  }

  if (rounds.isOver || !round) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Question {rounds.round + 1} sur {rounds.total}
      </p>

      <Picture picture={round.picture} />

      <div className="season-prompt">
        <p className="game-prompt">{round.prompt}</p>
        <SpeakButton text={round.prompt} label="Écouter la question" />
      </div>

      <div className="choice-grid">
        {round.options.map((season) => {
          const state = answerState(season, { picked, expected: round.answer })
          const dim = picked !== null && !state ? ' choice--dim' : ''
          return (
            <button
              key={season}
              type="button"
              className={`choice${stateClass(state)}${dim}`}
              disabled={picked !== null}
              onClick={() => answer(season)}
            >
              {season}
              <StateMark state={state} />
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <>
          <Feedback
            status={picked === round.answer ? 'correct' : 'wrong'}
            message={picked === round.answer ? undefined : round.explanation}
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Question suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
