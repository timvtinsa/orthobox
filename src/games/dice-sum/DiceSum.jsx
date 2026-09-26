/**
 * Dice sum: throw the dice, then write down what they add up to.
 *
 * The throw is the point: the patient presses the cup themselves, the dice
 * tumble for a moment, and the quantity to add up is one they produced
 * rather than one that was handed to them. The values are drawn before the
 * tumble, so what flickers is only decoration.
 *
 * The answer is typed on the shared keypad rather than picked from options:
 * with four choices a wrong sum can be found by elimination, which is not
 * the same exercise as computing it.
 */
import { useEffect, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { randomInt } from '../../lib/random.js'
import Die from './Die.jsx'
import { FACES, isCorrectAnswer, maxSum, rollDice, sumOf } from './logic.js'

const TUMBLE_MS = 650
const FRAME_MS = 90

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  )
}

export default function DiceSum({ config, session }) {
  const rounds = useRounds(config.rounds, session)
  const [roll, setRoll] = useState(null)
  const [phase, setPhase] = useState('ready') // ready -> tumbling -> answer
  const [tumble, setTumble] = useState([])
  const [typed, setTyped] = useState('')
  const [result, setResult] = useState(null)
  const lock = useAnswerLock()

  // The pad never needs more digits than the largest reachable sum.
  const maxDigits = String(maxSum(config)).length

  useEffect(() => {
    if (phase !== 'tumbling') return undefined
    const spin = setInterval(() => {
      setTumble(roll.map(() => randomInt(1, FACES)))
    }, FRAME_MS)
    const settle = setTimeout(() => setPhase('answer'), TUMBLE_MS)
    return () => {
      clearInterval(spin)
      clearTimeout(settle)
    }
  }, [phase, roll])

  const throwDice = () => {
    setRoll(rollDice(config))
    setPhase(prefersReducedMotion() ? 'answer' : 'tumbling')
  }

  const validate = () => {
    if (typed === '' || !lock.take()) return
    const isCorrect = isCorrectAnswer(typed, roll)
    setResult(isCorrect ? 'correct' : 'wrong')
    session.register(isCorrect)
  }

  const goNext = () => {
    rounds.next()
    setRoll(null)
    setTyped('')
    setResult(null)
    setPhase('ready')
    lock.release()
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    setRoll(null)
    setTyped('')
    setResult(null)
    setPhase('ready')
    lock.release()
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  const shownRoll =
    phase === 'tumbling' && tumble.length === roll.length
      ? roll.map((die, index) => ({ ...die, value: tumble[index] }))
      : roll

  return (
    <div className="game-board">
      <p className="game-round">
        Lancer {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">
        {phase === 'ready' ? 'Lance les dés' : 'Écris la somme des dés'}
      </p>

      <div className="dice-tray" aria-live={phase === 'answer' ? 'polite' : 'off'}>
        {shownRoll === null
          ? Array.from({ length: config.dice }, (_, index) => (
              <span key={index} className="die die--resting" aria-hidden="true" />
            ))
          : shownRoll.map((die) => (
              <Die
                key={die.id}
                value={die.value}
                shown={die.shown}
                label={phase === 'answer' ? `dé de ${die.value}` : 'dé qui roule'}
              />
            ))}
      </div>

      {phase === 'ready' && (
        <div className="game-actions">
          <button type="button" className="btn btn--lg" onClick={throwDice}>
            Lancer les dés
          </button>
        </div>
      )}

      {phase === 'answer' && (
        <>
          <div className={`sum-slot${result ? ` sum-slot--${result}` : ''}`} aria-live="polite">
            {typed === '' ? <span className="sum-slot__hint">…</span> : typed}
          </div>

          {!result && (
            <>
              <div className="keypad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    className="keypad__key"
                    disabled={typed.length >= maxDigits}
                    onClick={() => setTyped(typed + digit)}
                  >
                    {digit}
                  </button>
                ))}
              </div>

              <div className="game-actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  disabled={typed === ''}
                  onClick={() => setTyped(typed.slice(0, -1))}
                >
                  Effacer
                </button>
                <button
                  type="button"
                  className="btn btn--lg"
                  disabled={typed === ''}
                  onClick={validate}
                >
                  Valider
                </button>
              </div>
            </>
          )}

          {result && (
            <>
              <Feedback
                status={result}
                message={
                  result === 'correct'
                    ? `${roll.map((die) => die.value).join(' + ')} = ${sumOf(roll)}, bravo !`
                    : `La somme était ${roll.map((die) => die.value).join(' + ')} = ${sumOf(roll)}.`
                }
              />
              <div className="game-actions">
                <button type="button" className="btn btn--lg" onClick={goNext}>
                  Lancer à nouveau
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
