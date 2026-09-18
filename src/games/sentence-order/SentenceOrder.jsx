/**
 * Scrambled sentence: rebuild it word by word.
 *
 * The sibling of « Le mot en morceaux », one level up: there the units were
 * syllables inside a word, here they are words inside a sentence. Every tile
 * carries its own identifier, because a sentence may reuse the same word
 * twice (an article, most often).
 */
import { useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import { pick, shuffle } from '../../lib/random.js'
import { SENTENCES } from './data.js'

const SIZE_BY_SETTING = { four: 4, five: 5, six: 6 }

function capitalize(sentence) {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}

function buildRound(config) {
  const size = SIZE_BY_SETTING[config.words] ?? 4
  const words = pick(SENTENCES[size] ?? SENTENCES[4])
  // One identifier per tile: the same word (an article, most often) may
  // appear twice in the same sentence.
  const tiles = words.map((text, index) => ({ id: `${index}-${text}`, text }))
  let shuffled = shuffle(tiles)
  // Never hand over the sentence already in the right order.
  if (shuffled.every((tile, index) => tile.id === tiles[index].id)) {
    shuffled = [...shuffled.slice(1), shuffled[0]]
  }
  return { sentence: words.join(' '), tiles: shuffled, size }
}

export default function SentenceOrder({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [round, setRound] = useState(() => buildRound(config))
  const [placed, setPlaced] = useState([])
  const [result, setResult] = useState(null)
  // Synchronous mirror of `placed`: two taps in the same frame would
  // otherwise read the same state twice and skew the validation.
  const placedRef = useRef([])

  const attempt = placed.map((tile) => tile.text).join(' ')

  const updatePlaced = (next) => {
    placedRef.current = next
    setPlaced(next)
  }

  const place = (tile) => {
    if (result) return
    if (placedRef.current.some((item) => item.id === tile.id)) return
    const next = [...placedRef.current, tile]
    updatePlaced(next)
    if (next.length === round.size) {
      const sentence = next.map((item) => item.text).join(' ')
      const isCorrect = sentence === round.sentence
      setResult(isCorrect ? 'correct' : 'wrong')
      session.register(isCorrect)
    }
  }

  const remove = (tile) => {
    if (result) return
    updatePlaced(placedRef.current.filter((item) => item.id !== tile.id))
  }

  const retry = () => {
    updatePlaced([])
    setResult(null)
  }

  const goNext = () => {
    rounds.next()
    setRound(buildRound(config))
    updatePlaced([])
    setResult(null)
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    setRound(buildRound(config))
    updatePlaced([])
    setResult(null)
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  const remaining = round.tiles.filter(
    (tile) => !placed.some((item) => item.id === tile.id),
  )

  return (
    <div className="game-board">
      <p className="game-round">
        Phrase {rounds.round + 1} sur {rounds.total} · {round.size} mots
      </p>
      <p className="game-prompt">Remets les mots dans l’ordre</p>

      <div className={`word-slot${result ? ` word-slot--${result}` : ''}`}>
        {placed.length === 0 ? (
          <span className="word-slot__hint">Clique sur les mots ci-dessous…</span>
        ) : (
          placed.map((tile) => (
            <button
              key={tile.id}
              type="button"
              className="token"
              onClick={() => remove(tile)}
              aria-label={`Retirer le mot ${tile.text}`}
            >
              {tile.text}
            </button>
          ))
        )}
      </div>

      <div className="token-row">
        {remaining.map((tile) => (
          <button key={tile.id} type="button" className="token" onClick={() => place(tile)}>
            {tile.text}
          </button>
        ))}
      </div>

      {result === 'correct' && (
        <>
          <Feedback status="correct" message={`Bravo : ${capitalize(round.sentence)}.`} />
          <div className="game-actions">
            <SpeakButton text={round.sentence} label="Écouter la phrase" />
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Phrase suivante
            </button>
          </div>
        </>
      )}

      {result === 'wrong' && (
        <>
          <Feedback
            status="wrong"
            message={`« ${capitalize(attempt)} » ne va pas. La phrase était : ${capitalize(round.sentence)}.`}
          />
          <div className="game-actions">
            <button type="button" className="btn btn--subtle" onClick={retry}>
              Réessayer
            </button>
            <button type="button" className="btn" onClick={goNext}>
              Phrase suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
