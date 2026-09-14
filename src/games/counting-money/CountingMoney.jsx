/**
 * Counting money: make up an exact amount.
 *
 * Amounts are handled in cents, never in decimal euros, so no floating point
 * rounding error can slip in.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import { randomInt } from '../../lib/random.js'
import { COINS, Coin, formatAmount } from './coins.jsx'

/** Highest amount offered, in cents, for each setting. */
const CAPS = { five: 500, twenty: 2000, fifty: 5000 }

function drawPrice(config) {
  const cap = CAPS[config.maxAmount] ?? CAPS.five
  if (config.cents === 'without') return randomInt(1, cap / 100) * 100
  // With cents: stick to multiples of 5 c so amounts stay reachable.
  return randomInt(1, cap / 5) * 5
}

function availableCoins(config) {
  const cap = CAPS[config.maxAmount] ?? CAPS.five
  return COINS.filter(
    (coin) => coin.value <= Math.max(200, cap) && (config.cents === 'with' || coin.value >= 100),
  )
}

export default function CountingMoney({ config, session }) {
  const rounds = useRounds(config.rounds)
  const [price, setPrice] = useState(() => drawPrice(config))
  const [chosen, setChosen] = useState([])
  const [result, setResult] = useState(null)

  const available = availableCoins(config)
  const total = chosen.reduce((sum, coin) => sum + coin.value, 0)

  const add = (coin) => {
    if (result) return
    setChosen([...chosen, { ...coin, key: `${coin.value}-${Date.now()}-${chosen.length}` }])
  }

  const remove = (key) => {
    if (result) return
    setChosen(chosen.filter((coin) => coin.key !== key))
  }

  const validate = () => {
    if (result) return
    const exact = total === price
    session.register(exact)
    setResult(exact ? 'correct' : 'wrong')
  }

  const goNext = () => {
    rounds.next()
    setPrice(drawPrice(config))
    setChosen([])
    setResult(null)
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    setPrice(drawPrice(config))
    setChosen([])
    setResult(null)
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Achat {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">Compose exactement {formatAmount(price)}</p>

      <div className={`wallet${result ? ` wallet--${result}` : ''}`}>
        {chosen.length === 0 ? (
          <span className="word-slot__hint">Touche les pièces à ajouter</span>
        ) : (
          chosen.map((coin) => (
            <button
              key={coin.key}
              type="button"
              className="coin-btn"
              aria-label={`Retirer ${coin.label}`}
              onClick={() => remove(coin.key)}
            >
              <Coin coin={coin} size={52} />
            </button>
          ))
        )}
      </div>

      <p className="money-total">
        Total : <strong>{formatAmount(total)}</strong>
        {result === 'wrong' && (
          <span className="money-total__gap">
            {total > price
              ? ` (${formatAmount(total - price)} de trop)`
              : ` (il manque ${formatAmount(price - total)})`}
          </span>
        )}
      </p>

      <div className="coin-drawer">
        {available.map((coin) => (
          <button
            key={coin.value}
            type="button"
            className="coin-btn"
            disabled={Boolean(result)}
            aria-label={`Ajouter ${coin.label}`}
            onClick={() => add(coin)}
          >
            <Coin coin={coin} />
          </button>
        ))}
      </div>

      {result ? (
        <>
          <Feedback
            status={result}
            message={
              result === 'correct'
                ? `Exactement ${formatAmount(price)} !`
                : `Il fallait ${formatAmount(price)}.`
            }
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Achat suivant
            </button>
          </div>
        </>
      ) : (
        <div className="game-actions">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={chosen.length === 0}
            onClick={() => setChosen([])}
          >
            Vider
          </button>
          <button
            type="button"
            className="btn btn--lg"
            disabled={chosen.length === 0}
            onClick={validate}
          >
            Valider
          </button>
        </div>
      )}
    </div>
  )
}
