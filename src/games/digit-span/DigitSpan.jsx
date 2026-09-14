/**
 * Digit span: forward or backward numeric span.
 *
 * The answer is typed on a keypad, and the comparison is shown digit by digit.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import StudyPhase from '../../components/StudyPhase.jsx'
import { digitSequence } from '../../lib/lexicon.js'

export default function DigitSpan({ config, session }) {
  const [phase, setPhase] = useState('study')
  const [sequence, setSequence] = useState(() => digitSequence(config.length))
  const [input, setInput] = useState([])
  const [correct, setCorrect] = useState(null)

  const expected = config.direction === 'backward' ? [...sequence].reverse() : sequence

  const restart = () => {
    setSequence(digitSequence(config.length))
    setInput([])
    setCorrect(null)
    setPhase('study')
  }

  const validate = () => {
    const exact =
      input.length === expected.length && input.every((digit, i) => digit === expected[i])
    session.register(exact)
    setCorrect(exact)
    setPhase('result')
  }

  if (phase === 'study') {
    return (
      <StudyPhase
        seconds={config.duration}
        instruction="Retiens bien cette suite"
        onDone={() => setPhase('test')}
      >
        <div className="digit-row">
          {sequence.map((digit, index) => (
            <span key={`${digit}-${index}`} className="digit">
              {digit}
            </span>
          ))}
        </div>
      </StudyPhase>
    )
  }

  if (phase === 'test') {
    return (
      <div className="game-board">
        <p className="game-round">Restitution</p>
        <p className="game-prompt">
          {config.direction === 'backward'
            ? 'Retape la suite À L’ENVERS'
            : 'Retape la suite dans le même ordre'}
        </p>

        <div className="digit-row" aria-live="polite">
          {Array.from({ length: expected.length }, (_, index) => (
            <span key={index} className={`digit${input[index] === undefined ? ' digit--empty' : ''}`}>
              {input[index] ?? '·'}
            </span>
          ))}
        </div>

        <div className="keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
            <button
              key={digit}
              type="button"
              className="keypad__key"
              disabled={input.length >= expected.length}
              onClick={() => setInput([...input, digit])}
            >
              {digit}
            </button>
          ))}
        </div>

        <div className="game-actions">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={input.length === 0}
            onClick={() => setInput(input.slice(0, -1))}
          >
            Effacer
          </button>
          <button
            type="button"
            className="btn btn--lg"
            disabled={input.length !== expected.length}
            onClick={validate}
          >
            Valider
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-final">
      <p className="game-round">Résultat</p>
      <Feedback
        status={correct ? 'correct' : 'wrong'}
        message={correct ? 'Suite exacte, bravo !' : 'Ce n’est pas tout à fait la suite.'}
      />

      <div className="stack" style={{ alignItems: 'center' }}>
        <p className="muted">Suite affichée</p>
        <div className="digit-row">
          {sequence.map((digit, index) => (
            <span key={`expected-${index}`} className="digit">
              {digit}
            </span>
          ))}
        </div>
        <p className="muted">
          Réponse {config.direction === 'backward' ? '(à l’envers)' : ''}
        </p>
        <div className="digit-row">
          {input.map((digit, index) => (
            <span
              key={`input-${index}`}
              className={`digit ${digit === expected[index] ? 'digit--correct' : 'digit--wrong'}`}
            >
              {digit}
            </span>
          ))}
        </div>
      </div>

      <div className="game-actions">
        <button type="button" className="btn btn--lg" onClick={restart}>
          Nouvelle suite
        </button>
      </div>
    </div>
  )
}
