import { useCountdown } from '../hooks/useCountdown.js'

/**
 * Study phase: the material is shown for a set time, with a visible
 * countdown, then the test phase takes over. The "I'm done" button cuts the
 * wait short.
 */
export default function StudyPhase({ seconds, instruction, onDone, children }) {
  const remaining = useCountdown(seconds, { onExpire: onDone })

  return (
    <div className="study">
      <p className="game-round">Mémorisation</p>
      {instruction && <p className="game-prompt">{instruction}</p>}

      <div className="study__timer" aria-live="off">
        <span>{remaining} s</span>
        <div
          className="progress"
          role="progressbar"
          aria-label="Temps de mémorisation restant"
          aria-valuenow={remaining}
          aria-valuemin={0}
          aria-valuemax={seconds}
        >
          <div className="progress__bar" style={{ width: `${(remaining / seconds) * 100}%` }} />
        </div>
      </div>

      {children}

      <button type="button" className="btn btn--ghost" onClick={onDone}>
        J’ai fini, passer au test
      </button>
    </div>
  )
}
