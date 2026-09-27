/**
 * Domino images: extend a chain of picture dominoes, one tile at a time.
 *
 * Each domino shows two pictures. The chain's open end is the picture on the
 * right of its last tile; the round asks which of several dominoes has a
 * matching picture on its own left, the only one that can be placed next.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { Pictogram } from '../../lib/pictograms.jsx'
import { buildRound, firstDomino } from './logic.js'

function DominoTile({ domino, size = 44 }) {
  return (
    <span className="domino-tile">
      <Pictogram id={domino.left.id} size={size} title={domino.left.label} />
      <span className="domino-tile__divider" aria-hidden="true" />
      <Pictogram id={domino.right.id} size={size} title={domino.right.label} />
    </span>
  )
}

export default function DominoImage({ config, session }) {
  const optionCount = config.options === 'four' ? 4 : 3
  const rounds = useRounds(config.rounds, session)
  const [chain, setChain] = useState(() => [firstDomino()])
  const [round, setRound] = useState(() => buildRound(chain[0].right, optionCount))
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const answer = (option) => {
    if (!lock.take()) return
    setPicked(option.id)
    session.register(option.id === round.correct.id)
  }

  const goNext = () => {
    lock.release()
    const nextChain = picked === round.correct.id ? [...chain, round.correct] : chain
    setChain(nextChain)
    rounds.next()
    setRound(buildRound(nextChain[nextChain.length - 1].right, optionCount))
    setPicked(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    const start = [firstDomino()]
    setChain(start)
    setRound(buildRound(start[0].right, optionCount))
    setPicked(null)
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Domino {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">Quel domino continue la chaîne ?</p>

      <div className="domino-chain">
        {chain.map((domino, index) => (
          <DominoTile key={index} domino={domino} />
        ))}
      </div>

      <div className="choice-grid choice-grid--wide">
        {round.options.map((option) => {
          const state = answerState(option.id, { picked, expected: round.correct.id })
          const dim = picked && !state ? ' choice--dim' : ''
          return (
            <button
              key={option.id}
              type="button"
              className={`choice choice--domino${stateClass(state)}${dim}`}
              disabled={Boolean(picked)}
              onClick={() => answer(option)}
              aria-label={`Domino ${option.left.label}, ${option.right.label}`}
            >
              <DominoTile domino={option} />
              <StateMark state={state} />
            </button>
          )
        })}
      </div>

      {picked && (
        <>
          <Feedback
            status={picked === round.correct.id ? 'correct' : 'wrong'}
            message={
              picked === round.correct.id
                ? undefined
                : `Le bon domino continuait avec l’image « ${round.correct.right.label} ».`
            }
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Domino suivant
            </button>
          </div>
        </>
      )}
    </div>
  )
}
