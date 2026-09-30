/**
 * Noise lotto: hear a real sound, find its picture on the board.
 *
 * Unlike a spoken-word game, the label is never spoken either: only the
 * sound recording plays, so the match is made from the noise alone. The
 * board is dealt once, and a found picture stays marked for the rest of the
 * game, as on a real lotto card.
 */
import { useEffect, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { isAudioAvailable, playSequence, preloadSounds, primeAudio } from '../../lib/audio.js'
import { Pictogram } from '../../lib/pictograms.jsx'
import { deal, NOISES } from './logic.js'

const COLUMNS = { 6: 3, 9: 3, 12: 4 }

export default function NoiseLotto({ config, session }) {
  const size = Number(config.size)
  const columns = COLUMNS[size] ?? 3
  const [game, setGame] = useState(() => deal(size))
  const rounds = useRounds(size, session)
  const [found, setFound] = useState([])
  const [picked, setPicked] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const lock = useAnswerLock()
  const available = isAudioAvailable()

  const current = game.calls[rounds.round]

  // The full bank is preloaded once: every board dealt afterwards, including
  // on replay, is served from that cache, with no further wait.
  useEffect(() => {
    let active = true
    preloadSounds(NOISES).then(() => {
      if (active) setReady(true)
    })
    return () => {
      active = false
    }
  }, [])

  const listen = () => {
    if (!ready || playing) return
    primeAudio()
    setPlaying(true)
    const duration = playSequence([current])
    window.setTimeout(() => setPlaying(false), duration * 1000)
  }

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

  if (!available) {
    return (
      <div className="game-board">
        <p className="game-prompt">Son indisponible sur ce poste</p>
        <p className="game-instruction">
          Ce navigateur ne fournit pas la lecture audio nécessaire aux bruitages.
        </p>
      </div>
    )
  }

  if (rounds.isOver) {
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">
          Plateau rempli : {found.length} image{found.length > 1 ? 's' : ''} sur {size} retrouvée
          {found.length > 1 ? 's' : ''} au bruit.
        </p>
      </GameOver>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Bruit {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">Écoute, puis touche la bonne image sur le plateau</p>

      {!picked && (
        <div className="game-actions">
          <button type="button" className="btn btn--lg" onClick={listen} disabled={!ready || playing}>
            {!ready ? 'Chargement…' : playing ? 'Écoute…' : 'Écouter le bruit'}
          </button>
        </div>
      )}

      <div className="memory-grid" style={{ '--columns': columns }}>
        {game.board.map((noise) => {
          const isFound = found.includes(noise.id)
          const state = isFound ? 'ok' : answerState(noise.id, { picked, expected: current.id })
          const disabled = isFound || Boolean(picked)
          return (
            <button
              key={noise.id}
              type="button"
              className={`lotto-cell${stateClass(state)}`}
              disabled={disabled}
              onClick={() => answer(noise)}
              aria-label={isFound ? `${noise.label}, déjà trouvé` : 'Image du plateau'}
            >
              <Pictogram id={noise.pictogram} size="72%" title={isFound || picked ? noise.label : undefined} />
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
            <button type="button" className="btn btn--subtle" onClick={listen} disabled={playing}>
              Réécouter le bruit
            </button>
            <button type="button" className="btn btn--lg" onClick={goNext}>
              {rounds.round + 1 < rounds.total ? 'Bruit suivant' : 'Voir le résultat'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
