/**
 * Scrambled syllables: rebuild a word syllable by syllable.
 *
 * Every tile carries its own identifier, because a single word may contain
 * two identical syllables.
 */
import { useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import { noRepeatSeries, shuffle } from '../../lib/random.js'
import { WORDS } from './data.js'

function buildRoundFor(syllables) {
  // One identifier per tile: two identical syllables may coexist.
  const tiles = syllables.map((text, index) => ({ id: `${index}-${text}`, text }))
  let shuffled = shuffle(tiles)
  // Never hand over the word already in the right order — except at two
  // syllables, where forcing a swap would always produce the same single
  // possible arrangement, turning the answer into a fixed gesture (always
  // tap the second tile first) rather than an actual read of the word.
  if (syllables.length > 2 && shuffled.every((tile, index) => tile.id === tiles[index].id)) {
    shuffled = [...shuffled.slice(1), shuffled[0]]
  }
  return { word: syllables.join(''), tiles: shuffled, size: syllables.length }
}

/** The whole session's words, drawn upfront so the same word cannot come
 * back twice within a series while the bucket has enough to avoid it. */
function buildSeries(config) {
  const pool = WORDS[config.syllables] ?? WORDS[2]
  return noRepeatSeries(pool, config.rounds).map(buildRoundFor)
}

export default function ScrambledSyllables({ config, session }) {
  const [series, setSeries] = useState(() => buildSeries(config))
  const rounds = useRounds(series.length, session)
  const round = series[rounds.round]
  const [placed, setPlaced] = useState([])
  const [result, setResult] = useState(null)
  // Synchronous mirror of `placed`: two clicks in the same frame would
  // otherwise read the same state twice and skew the validation.
  const placedRef = useRef([])

  const option = placed.map((tile) => tile.text).join('')

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
      const word = next.map((item) => item.text).join('')
      const isCorrect = word === round.word
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
    updatePlaced([])
    setResult(null)
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    setSeries(buildSeries(config))
    updatePlaced([])
    setResult(null)
  }

  if (rounds.isOver || !round) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  const remaining = round.tiles.filter(
    (tile) => !placed.some((item) => item.id === tile.id),
  )

  return (
    <div className="game-board">
      <p className="game-round">
        Mot {rounds.round + 1} sur {rounds.total} · {round.size} syllabes
      </p>
      <p className="game-prompt">Remets les syllabes dans l’ordre</p>

      <div className={`word-slot${result ? ` word-slot--${result}` : ''}`}>
        {placed.length === 0 ? (
          <span className="word-slot__hint">Clique sur les syllabes ci-dessous…</span>
        ) : (
          placed.map((tile) => (
            <button
              key={tile.id}
              type="button"
              className="token"
              onClick={() => remove(tile)}
              aria-label={`Retirer la syllabe ${tile.text}`}
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
          <Feedback status="correct" message={`Bravo : ${round.word}`} />
          <div className="game-actions">
            <SpeakButton text={round.word} label="Écouter le mot" />
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Mot suivant
            </button>
          </div>
        </>
      )}

      {result === 'wrong' && (
        <>
          <Feedback status="wrong" message={`« ${option} » n’existe pas. Le mot était : ${round.word}`} />
          <div className="game-actions">
            <button type="button" className="btn btn--subtle" onClick={retry}>
              Réessayer
            </button>
            <button type="button" className="btn" onClick={goNext}>
              Mot suivant
            </button>
          </div>
        </>
      )}
    </div>
  )
}
