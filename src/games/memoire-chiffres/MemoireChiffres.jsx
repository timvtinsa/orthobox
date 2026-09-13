import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import SetupPanel from '../../components/SetupPanel.jsx'
import Stepper from '../../components/Stepper.jsx'
import SwitchGroup from '../../components/SwitchGroup.jsx'
import StudyPhase from '../../components/StudyPhase.jsx'
import { suiteDeChiffres } from '../../lib/lexique.js'

const REGLAGES_PAR_DEFAUT = { longueur: 5, duree: 8, sens: 'direct' }

export default function MemoireChiffres({ session }) {
  const [reglages, setReglages] = useState(REGLAGES_PAR_DEFAUT)
  const [phase, setPhase] = useState('reglages')
  const [suite, setSuite] = useState([])
  const [saisie, setSaisie] = useState([])
  const [juste, setJuste] = useState(null)

  const attendue = reglages.sens === 'inverse' ? [...suite].reverse() : suite

  const demarrer = () => {
    setSuite(suiteDeChiffres(reglages.longueur))
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

  if (phase === 'reglages') {
    return (
      <SetupPanel
        title="Réglages de la suite"
        description="Choisissez la longueur de la suite, le temps d’affichage et le sens de restitution."
        onStart={demarrer}
        actionLabel="Afficher la suite"
      >
        <Stepper
          label="Nombre de chiffres"
          hint="Repère : l’empan direct adulte se situe autour de 6 à 7 chiffres."
          value={reglages.longueur}
          min={3}
          max={10}
          onChange={(longueur) => setReglages({ ...reglages, longueur })}
        />
        <Stepper
          label="Temps d’affichage"
          value={reglages.duree}
          min={3}
          max={30}
          step={1}
          suffix="s"
          onChange={(duree) => setReglages({ ...reglages, duree })}
        />
        <SwitchGroup
          label="Sens de restitution"
          hint="L’ordre inverse sollicite davantage la mémoire de travail."
          value={reglages.sens}
          options={[
            { id: 'direct', label: 'À l’endroit' },
            { id: 'inverse', label: 'À l’envers' },
          ]}
          onChange={(sens) => setReglages({ ...reglages, sens })}
        />
      </SetupPanel>
    )
  }

  if (phase === 'memorisation') {
    return (
      <StudyPhase
        seconds={reglages.duree}
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
          {reglages.sens === 'inverse'
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
          Réponse {reglages.sens === 'inverse' ? '(à l’envers)' : ''}
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
        <button type="button" className="btn btn--ghost" onClick={() => setPhase('reglages')}>
          Changer les réglages
        </button>
      </div>
    </div>
  )
}
