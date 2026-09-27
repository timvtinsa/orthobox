/**
 * Dice sum: throw the dice, then write down what they add up to.
 *
 * The throw is the point: the patient presses the cup themselves, the dice
 * tumble in 3D for a moment, and the quantity to add up is one they produced
 * rather than one that was handed to them. The values are drawn before the
 * tumble: the cube's rotation only animates toward an answer already fixed,
 * so what the eye follows during the throw never changes what has to be
 * added up, regardless of when the animation happens to settle.
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
import Die from './Die.jsx'
import { FACE_ROTATION, isCorrectAnswer, maxSum, rollDice, sumOf, tumbleRotation } from './logic.js'

// Kept in step with the cube's own transition duration in game.css.
const TUMBLE_MS = 1500

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
  const [rotations, setRotations] = useState([])
  const [typed, setTyped] = useState('')
  const [result, setResult] = useState(null)
  const lock = useAnswerLock()

  // The pad never needs more digits than the largest reachable sum.
  const maxDigits = String(maxSum(config)).length

  useEffect(() => {
    if (phase !== 'tumbling') return undefined
    // Setting the target rotation a frame after the neutral one is what
    // makes the CSS transition actually animate, rather than jumping there.
    const frame = requestAnimationFrame(() => {
      setRotations(roll.map((die) => tumbleRotation(die.value)))
    })
    const settle = setTimeout(() => setPhase('answer'), TUMBLE_MS)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(settle)
    }
  }, [phase, roll])

  const throwDice = () => {
    const nextRoll = rollDice(config)
    setRoll(nextRoll)
    if (prefersReducedMotion()) {
      setRotations(nextRoll.map((die) => FACE_ROTATION[die.value]))
      setPhase('answer')
      return
    }
    setRotations(nextRoll.map(() => ({ x: 0, y: 0 })))
    setPhase('tumbling')
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

  return (
    <div className="game-board">
      <p className="game-round">
        Lancer {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">
        {phase === 'ready' ? 'Lance les dés' : 'Écris la somme des dés'}
      </p>

      <div className="dice-tray" aria-live={phase === 'answer' ? 'polite' : 'off'}>
        {roll === null
          ? Array.from({ length: config.dice }, (_, index) => (
              <span key={index} className="die-resting" aria-hidden="true" />
            ))
          : roll.map((die, index) => (
              <Die
                key={die.id}
                rotation={rotations[index]}
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
