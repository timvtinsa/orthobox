/**
 * Sound sequence: sequential auditory memory.
 *
 * Cards are only shown after the first listen, so the sequence is memorised
 * by ear rather than associated visually.
 */
import { useEffect, useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import {
  ANIMALS,
  SOUNDS,
  hasRecording,
  isAudioAvailable,
  playSequence,
  preloadSounds,
  primeAudio,
} from '../../lib/audio.js'
import { Pictogram } from '../../lib/pictograms.jsx'
import { isSpeechAvailable, speakSequence } from '../../lib/speech.js'
import { sample, shuffle } from '../../lib/random.js'

function drawSequence(config) {
  const bank = config.bank === 'animals' ? ANIMALS : SOUNDS
  return sample(bank, Math.min(config.length, bank.length))
}

export default function SoundSequence({ config, session }) {
  const rounds = useRounds(config.rounds)
  const [sequence, setSequence] = useState(() => drawSequence(config))
  const [cards, setCards] = useState(() => shuffle(sequence))
  const [option, setOption] = useState([])
  const [listens, setListens] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [result, setResult] = useState(null)
  const timer = useRef(null)

  // Animals have no synthesised sound effect: without an audio file in
  // public/sounds/, the device voice names them instead.
  const [recordings, setRecordings] = useState(false)
  const speech = config.bank === 'animals' && !recordings
  const available = speech ? isSpeechAvailable() : isAudioAvailable()
  const replaysLeft = config.replays - Math.max(0, listens - 1)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // A file dropped into public/sounds/ replaces the synthesised sound.
  useEffect(() => {
    let active = true
    preloadSounds(sequence).then(() => {
      if (active) setRecordings(sequence.every((sound) => hasRecording(sound.id)))
    })
    return () => {
      active = false
    }
  }, [sequence])

  const listen = () => {
    if (playing) return
    primeAudio()
    setPlaying(true)
    setListens((count) => count + 1)

    if (speech) {
      speakSequence(
        sequence.map((item) => item.label),
        { onDone: () => setPlaying(false) },
      )
      return
    }
    const duration = playSequence(sequence)
    timer.current = window.setTimeout(() => setPlaying(false), duration * 1000)
  }

  const add = (card) => {
    if (result || playing) return
    if (option.some((item) => item.id === card.id)) return
    const next = [...option, card]
    setOption(next)
    if (next.length === sequence.length) {
      const exact = next.every((item, index) => item.id === sequence[index].id)
      session.register(exact)
      setResult(exact ? 'correct' : 'wrong')
    }
  }

  const nextRound = () => {
    const next = drawSequence(config)
    setSequence(next)
    setCards(shuffle(next))
    setOption([])
    setResult(null)
    setListens(0)
    rounds.next()
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    const next = drawSequence(config)
    setSequence(next)
    setCards(shuffle(next))
    setOption([])
    setResult(null)
    setListens(0)
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  if (!available) {
    return (
      <div className="game-board">
        <p className="game-prompt">Son indisponible sur ce poste</p>
        <p className="game-instruction">
          {speech
            ? 'La banque « animaux » utilise la voix de l’appareil, et aucune voix n’est installée ici. Choisissez « bruits du quotidien » dans les réglages : ces sons sont fabriqués par l’application.'
            : 'Ce navigateur ne fournit pas la synthèse audio nécessaire aux bruitages.'}
        </p>
      </div>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Suite {rounds.round + 1} sur {rounds.total} · {sequence.length} sons
      </p>

      {listens === 0 ? (
        <>
          <p className="game-prompt">Écoute bien la suite de sons</p>
          <p className="game-instruction">
            Les cartes ne sont montrées qu’après l’écoute : il faut retenir l’ordre des sons.
          </p>
          <button type="button" className="btn btn--lg" onClick={listen} disabled={playing}>
            {playing ? 'Écoute…' : 'Écouter la suite'}
          </button>
        </>
      ) : (
        <>
          <p className="game-prompt">Remets les cartes dans l’ordre entendu</p>

          <div className="order-row">
            {sequence.map((_, index) => {
              const card = option[index]
              const correct = result && card && card.id === sequence[index].id
              const wrong = result && card && card.id !== sequence[index].id
              return (
                <div
                  key={index}
                  className={`order-slot${correct ? ' order-slot--correct' : ''}${
                    wrong ? ' order-slot--wrong' : ''
                  }`}
                >
                  <span className="order-slot__rank">{index + 1}</span>
                  {card ? <Pictogram id={card.pictogram} size={52} title={card.label} /> : null}
                </div>
              )
            })}
          </div>

          <div className="token-row">
            {cards.map((card) => {
              const placed = option.some((item) => item.id === card.id)
              return (
                <button
                  key={card.id}
                  type="button"
                  className={`sound-card${placed ? ' sound-card--placed' : ''}`}
                  disabled={placed || Boolean(result) || playing}
                  aria-label={card.label}
                  onClick={() => add(card)}
                >
                  <Pictogram id={card.pictogram} size={56} />
                  <span className="sound-card__label">{card.label}</span>
                </button>
              )
            })}
          </div>

          {!result && (
            <div className="game-actions">
              <button
                type="button"
                className="btn btn--subtle"
                onClick={listen}
                disabled={playing || replaysLeft <= 0}
              >
                {replaysLeft > 0
                  ? `Réécouter (${replaysLeft} restante${replaysLeft > 1 ? 's' : ''})`
                  : 'Plus de réécoute'}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setOption([])}
                disabled={option.length === 0 || playing}
              >
                Effacer
              </button>
            </div>
          )}

          {result && (
            <>
              <Feedback
                status={result}
                message={
                  result === 'correct'
                    ? 'Suite reconstituée dans le bon ordre !'
                    : `Ordre entendu : ${sequence.map((item) => item.label).join(', ')}.`
                }
              />
              <div className="game-actions">
                <button type="button" className="btn btn--lg" onClick={nextRound}>
                  Suite suivante
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
