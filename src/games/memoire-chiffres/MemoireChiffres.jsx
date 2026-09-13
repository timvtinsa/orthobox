import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import StudyPhase from '../../components/StudyPhase.jsx'
import { suiteDeChiffres } from '../../lib/lexique.js'

export default function MemoireChiffres({ config, session }) {
  const [phase, setPhase] = useState('memorisation')
  const [suite, setSuite] = useState(() => suiteDeChiffres(config.longueur))
  const [saisie, setSaisie] = useState([])
  const [juste, setJuste] = useState(null)

  const attendue = config.sens === 'inverse' ? [...suite].reverse() : suite

  const demarrer = () => {
    setSuite(suiteDeChiffres(config.longueur))
    setSaisie([])
    setJuste(null)
    setPhase('memorisation')
  }

  const valider = () => {
    const exact =
      saisie.length === attendue.length && saisie.every((chiffre, i) => chiffre === attendue[i])
    session.register(exact)
    setJuste(exact)
    setPhase('resultats')
  }

  if (phase === 'memorisation') {
    return (
      <StudyPhase
        seconds={config.duree}
        instruction="Retiens bien cette suite"
        onDone={() => setPhase('test')}
      >
        <div className="digit-row">
          {suite.map((chiffre, index) => (
            <span key={`${chiffre}-${index}`} className="digit">
              {chiffre}
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
          {config.sens === 'inverse'
            ? 'Retape la suite À L’ENVERS'
            : 'Retape la suite dans le même ordre'}
        </p>

        <div className="digit-row" aria-live="polite">
          {Array.from({ length: attendue.length }, (_, index) => (
            <span key={index} className={`digit${saisie[index] === undefined ? ' digit--vide' : ''}`}>
              {saisie[index] ?? '·'}
            </span>
          ))}
        </div>

        <div className="keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((chiffre) => (
            <button
              key={chiffre}
              type="button"
              className="keypad__key"
              disabled={saisie.length >= attendue.length}
              onClick={() => setSaisie([...saisie, chiffre])}
            >
              {chiffre}
            </button>
          ))}
        </div>

        <div className="game-actions">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={saisie.length === 0}
            onClick={() => setSaisie(saisie.slice(0, -1))}
          >
            Effacer
          </button>
          <button
            type="button"
            className="btn btn--lg"
            disabled={saisie.length !== attendue.length}
            onClick={valider}
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
        status={juste ? 'correct' : 'wrong'}
        message={juste ? 'Suite exacte, bravo !' : 'Ce n’est pas tout à fait la suite.'}
      />

      <div className="stack" style={{ alignItems: 'center' }}>
        <p className="muted">Suite affichée</p>
        <div className="digit-row">
          {suite.map((chiffre, index) => (
            <span key={`attendu-${index}`} className="digit">
              {chiffre}
            </span>
          ))}
        </div>
        <p className="muted">
          Réponse {config.sens === 'inverse' ? '(à l’envers)' : ''}
        </p>
        <div className="digit-row">
          {saisie.map((chiffre, index) => (
            <span
              key={`saisi-${index}`}
              className={`digit ${chiffre === attendue[index] ? 'digit--juste' : 'digit--faux'}`}
            >
              {chiffre}
            </span>
          ))}
        </div>
      </div>

      <div className="game-actions">
        <button type="button" className="btn btn--lg" onClick={demarrer}>
          Nouvelle suite
        </button>
      </div>
    </div>
  )
}
