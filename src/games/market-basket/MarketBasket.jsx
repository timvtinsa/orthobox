/**
 * Market basket: reproduce an order of fruit and vegetables by taking them
 * from the stall.
 *
 * The stall always shows the eight kinds, whatever the order asks for: the
 * work is to pick the right ones out, not to copy a row. Tapping a kind on
 * the stall adds one to the basket, tapping it in the basket takes one back,
 * so a miscount is corrected without emptying everything.
 *
 * With the model hidden, the same board becomes a working-memory task: the
 * order is shown during a timed study phase, then only the stall remains.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import StateMark from '../../components/StateMark.jsx'
import StudyPhase from '../../components/StudyPhase.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { Pictogram } from '../../lib/pictograms.jsx'
import { stateClass } from '../../lib/answer-state.js'
import { PRODUCE, quantityLabel } from './data.js'
import { basketMatches, buildOrder, kindState, orderSize } from './logic.js'

function Item({ item, count, state, onClick, label, disabled }) {
  return (
    <button
      type="button"
      className={`token token--shape${stateClass(state)}`}
      onClick={onClick}
      disabled={disabled || !onClick}
      aria-label={label}
    >
      {state && <StateMark state={state} size={26} />}
      <Pictogram id={item.id} size={52} />
      <span className="token__label">{item.one}</span>
      {count > 1 && (
        // The state mark sits in the same corner: pushed aside, the count
        // stays readable, which is the whole point of the correction.
        <span className={`token__rank${state ? ' token__rank--left' : ''}`}>{count}</span>
      )}
    </button>
  )
}

export default function MarketBasket({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [order, setOrder] = useState(() => buildOrder(config))
  const [phase, setPhase] = useState(config.model === 'hidden' ? 'study' : 'shop')
  const [basket, setBasket] = useState({})
  const [result, setResult] = useState(null)
  const lock = useAnswerLock()

  const add = (item) => {
    if (result) return
    setBasket((current) => ({ ...current, [item.id]: (current[item.id] ?? 0) + 1 }))
  }

  const remove = (item) => {
    if (result) return
    setBasket((current) => {
      const left = (current[item.id] ?? 0) - 1
      const next = { ...current }
      if (left > 0) next[item.id] = left
      else delete next[item.id]
      return next
    })
  }

  const validate = () => {
    if (!lock.take()) return
    const isCorrect = basketMatches(order, basket)
    setResult(isCorrect ? 'correct' : 'wrong')
    session.register(isCorrect)
  }

  const startRound = (nextOrder) => {
    setOrder(nextOrder)
    setBasket({})
    setResult(null)
    lock.release()
    setPhase(config.model === 'hidden' ? 'study' : 'shop')
  }

  const retry = () => {
    setBasket({})
    setResult(null)
    lock.release()
  }

  const goNext = () => {
    rounds.next()
    startRound(buildOrder(config))
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    startRound(buildOrder(config))
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  const orderList = (withState) => (
    <div className="token-row">
      {order.map((item) => (
        <Item
          key={item.id}
          item={item}
          count={item.count}
          state={withState ? kindState(item.id, order, basket) : null}
          label={quantityLabel(item, item.count)}
          disabled
        />
      ))}
    </div>
  )

  if (phase === 'study') {
    return (
      <StudyPhase
        seconds={config.duration}
        instruction="Retiens bien cette commande"
        onDone={() => setPhase('shop')}
      >
        {orderList(false)}
      </StudyPhase>
    )
  }

  const taken = Object.values(basket).reduce((total, count) => total + count, 0)
  const basketItems = PRODUCE.filter((item) => basket[item.id] > 0)

  return (
    <div className="game-board">
      <p className="game-round">
        Panier {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">
        {config.model === 'hidden'
          ? 'Remplis le panier avec la commande mémorisée'
          : 'Remplis le panier exactement comme la commande'}
      </p>

      {config.model === 'visible' && !result && (
        <section className="basket-panel">
          <p className="basket-panel__title">La commande</p>
          {orderList(false)}
        </section>
      )}

      <section className="basket-panel">
        <p className="basket-panel__title">Mon panier</p>
        <div className={`word-slot${result ? ` word-slot--${result}` : ''}`}>
          {basketItems.length === 0 ? (
            <span className="word-slot__hint">Touche les fruits et légumes de l’étal…</span>
          ) : (
            basketItems.map((item) => (
              <Item
                key={item.id}
                item={item}
                count={basket[item.id]}
                state={result ? kindState(item.id, order, basket) : null}
                onClick={result ? undefined : () => remove(item)}
                label={`Retirer 1 ${item.one} (${quantityLabel(item, basket[item.id])} dans le panier)`}
              />
            ))
          )}
        </div>
      </section>

      {!result && (
        <>
          <section className="basket-panel">
            <p className="basket-panel__title">L’étal</p>
            <div className="token-row">
              {PRODUCE.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  count={0}
                  onClick={() => add(item)}
                  label={`Ajouter 1 ${item.one} au panier`}
                />
              ))}
            </div>
          </section>

          <div className="game-actions">
            <button
              type="button"
              className="btn btn--ghost"
              disabled={taken === 0}
              onClick={() => setBasket({})}
            >
              Vider le panier
            </button>
            <button type="button" className="btn btn--lg" disabled={taken === 0} onClick={validate}>
              Valider le panier
            </button>
          </div>
        </>
      )}

      {result === 'correct' && (
        <>
          <Feedback status="correct" message="Le panier est exactement celui de la commande." />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Panier suivant
            </button>
          </div>
        </>
      )}

      {result === 'wrong' && (
        <>
          <Feedback
            status="wrong"
            message={`Ce n’est pas tout à fait la commande. Elle demandait ${orderSize(order)} article${orderSize(order) > 1 ? 's' : ''} :`}
          />
          {orderList(true)}
          <div className="game-actions">
            <button type="button" className="btn btn--subtle" onClick={retry}>
              Réessayer
            </button>
            <button type="button" className="btn" onClick={goNext}>
              Panier suivant
            </button>
          </div>
        </>
      )}
    </div>
  )
}
