/**
 * The right letter: find a target among the letters it is confused with.
 *
 * Mirrors (b d p q) and rotations (n u, m w) are the confusions that hold a
 * reader back the longest. The material is set in Atkinson Hyperlegible, which
 * was chosen for exactly that: it tells those letters apart by their shape,
 * not by their orientation alone.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { buildRound } from './letters.js'

export default function LetterDiscrimination({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [round, setRound] = useState(() => buildRound(config))
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const expected = round.cells.find((cell) => cell.letter === round.target)?.id ?? null

  const answer = (cell) => {
    if (!lock.take()) return
    setPicked(cell.id)
    session.register(cell.letter === round.target)
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
        Lettre {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">Montre la lettre</p>

      <div className="letter-target" aria-label={`Lettre à trouver : ${round.target}`}>
        {round.target}
      </div>

      <div className="letter-row">
        {round.cells.map((cell) => {
          const state = answerState(cell.id, { picked, expected })
          return (
            <button
              key={cell.id}
              type="button"
              className={`letter-cell${stateClass(state)}`}
              disabled={picked !== null}
              onClick={() => answer(cell)}
            >
              {cell.letter}
              <StateMark state={state} />
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <>
          <Feedback status={picked === expected ? 'correct' : 'wrong'} />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Lettre suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
