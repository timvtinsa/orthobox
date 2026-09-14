/**
 * Memory pairs: a classic concentration game.
 *
 * Every attempted pair counts as one try, so the number of tries can be
 * compared with the theoretical minimum at the end of the game.
 */
import { useEffect, useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { PICTOGRAMS, Pictogram } from '../../lib/pictograms.jsx'
import { sample, shuffle } from '../../lib/random.js'

const PAIRS = { easy: 3, medium: 6, hard: 10 }
const COLUMNS = { easy: 3, medium: 4, hard: 5 }

function deal(level) {
  const count = PAIRS[level] ?? PAIRS.easy
  const drawn = sample(PICTOGRAMS, count)
  return shuffle(
    drawn.flatMap((pictogram, index) => [
      { key: `${pictogram.id}-a`, pictogram, pair: index },
      { key: `${pictogram.id}-b`, pictogram, pair: index },
    ]),
  )
}

export default function MemoryPairs({ config, session }) {
  const [cards, setCards] = useState(() => deal(config.level))
  const [flipped, setFlipped] = useState([])
  const [found, setFound] = useState([])
  const [moves, setMoves] = useState(0)
  const timeout = useRef(null)

  const columns = COLUMNS[config.level] ?? 3
  const total = PAIRS[config.level] ?? PAIRS.easy
  const finished = found.length === total

  // Flips the two unmatched cards back once the reveal time is over.
  useEffect(() => {
    if (flipped.length < 2) return undefined
    const [a, b] = flipped
    const won = a.pair === b.pair
    session.register(won)
    setMoves((count) => count + 1)
    if (won) {
      setFound((current) => [...current, a.pair])
      setFlipped([])
      return undefined
    }
    timeout.current = window.setTimeout(() => setFlipped([]), config.reveal * 100)
    return () => window.clearTimeout(timeout.current)
    // session is stable, and config.reveal never changes during a game.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped])

  const flip = (card) => {
    if (flipped.length >= 2) return
    if (flipped.some((item) => item.key === card.key)) return
    if (found.includes(card.pair)) return
    setFlipped([...flipped, card])
  }

  const replay = () => {
    window.clearTimeout(timeout.current)
    session.reset()
    setCards(deal(config.level))
    setFlipped([])
    setFound([])
    setMoves(0)
  }

  if (finished) {
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">
          {total} paires retrouvées en {moves} essais, le minimum possible étant {total}.
        </p>
      </GameOver>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        {found.length} paire{found.length > 1 ? 's' : ''} sur {total} · {moves} essai
        {moves > 1 ? 's' : ''}
      </p>
      <p className="game-prompt">Retrouve les paires</p>

      <div className="memory-grid" style={{ '--columns': columns }}>
        {cards.map((card) => {
          const visible =
            found.includes(card.pair) || flipped.some((item) => item.key === card.key)
          return (
            <button
              key={card.key}
              type="button"
              className={`memory-card${visible ? ' memory-card--face' : ''}${
                found.includes(card.pair) ? ' memory-card--found' : ''
              }`}
              aria-label={visible ? card.pictogram.label : 'Carte face cachée'}
              onClick={() => flip(card)}
            >
              {visible ? (
                <Pictogram id={card.pictogram.id} size="72%" />
              ) : (
                <span className="memory-card__back" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>

      <Feedback
        status={flipped.length === 2 ? (flipped[0].pair === flipped[1].pair ? 'correct' : 'wrong') : null}
        message={flipped.length === 2 ? undefined : ' '}
      />
    </div>
  )
}
