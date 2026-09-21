/**
 * Sound lotto: hear a word, find its picture on the board.
 *
 * The word is never written on screen, only spoken: the board is a pure
 * listening exercise, not a reading one. Every picture is called exactly
 * once, and a found picture stays marked for the rest of the game, as on a
 * real lotto card.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { Pictogram } from '../../lib/pictograms.jsx'
import { deal } from './logic.js'

const COLUMNS = { 6: 3, 9: 3, 12: 4 }

export default function SoundLotto({ config, session }) {
  const size = Number(config.size)
  const columns = COLUMNS[size] ?? 3
  const [game, setGame] = useState(() => deal(size))
  const rounds = useRounds(size, session)
  const [found, setFound] = useState([])
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const current = game.calls[rounds.round]

  const answer = (picture) => {
    if (!lock.take()) return
    setPicked(picture.id)
    const correct = picture.id === current.id
    session.register(correct)
    if (correct) setFound((list) => [...list, picture.id])
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
    setGame(deal(size))
    setFound([])
    setPicked(null)
  }

  if (rounds.isOver) {
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">
          Plateau rempli : {found.length} image{found.length > 1 ? 's' : ''} sur {size} retrouvée
          {found.length > 1 ? 's' : ''} au son.
        </p>
      </GameOver>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Image {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">Écoute, puis touche la bonne image sur le plateau</p>

      <div className="game-actions">
        <SpeakButton text={current.label} label="Écouter le mot" className="btn--lg" />
      </div>

      <div className="memory-grid" style={{ '--columns': columns }}>
        {game.board.map((picture) => {
          const isFound = found.includes(picture.id)
          const state = isFound ? 'ok' : answerState(picture.id, { picked, expected: current.id })
          const disabled = isFound || Boolean(picked)
          return (
            <button
              key={picture.id}
              type="button"
              className={`lotto-cell${stateClass(state)}`}
              disabled={disabled}
              onClick={() => answer(picture)}
              aria-label={isFound ? `${picture.label}, déjà trouvée` : 'Image du plateau'}
            >
              <Pictogram id={picture.id} size="72%" title={isFound || picked ? picture.label : undefined} />
              <StateMark state={state} />
            </button>
          )
        })}
      </div>

      {picked && (
        <>
          <Feedback
            status={picked === current.id ? 'correct' : 'wrong'}
            message={picked === current.id ? undefined : `C’était « ${current.label} ».`}
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              {rounds.round + 1 < rounds.total ? 'Mot suivant' : 'Voir le résultat'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
