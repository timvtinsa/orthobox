import { useCountdown } from '../hooks/useCountdown.js'

/**
 * Phase de mémorisation : le matériel est affiché pendant une durée fixée,
 * avec un compte à rebours visible, puis la main passe à la phase de test.
 * Le bouton « J'ai fini » permet d'écourter sans attendre.
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
