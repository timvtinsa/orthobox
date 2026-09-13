/**
 * Le rappel de liste : restitution libre d'une liste de mots.
 *
 * La comparaison ignore la casse et les accents : c'est la mémoire qui est
 * évaluée, pas l'orthographe.
 */
import { useRef, useState } from 'react'
import StudyPhase from '../../components/StudyPhase.jsx'
import { MOTS_COURANTS, memeMot } from '../../lib/lexique.js'
import { sample } from '../../lib/random.js'

export default function MemoireRappel({ config, session }) {
  const [phase, setPhase] = useState('memorisation')
  const [liste, setListe] = useState(() => sample(MOTS_COURANTS, config.nombre))
  const [saisie, setSaisie] = useState('')
  const [rappeles, setRappeles] = useState([])
  const champ = useRef(null)

  const demarrer = () => {
    setListe(sample(MOTS_COURANTS, config.nombre))
    setRappeles([])
    setSaisie('')
    setPhase('memorisation')
  }

  const ajouter = (event) => {
    event.preventDefault()
    const mot = saisie.trim()
    if (!mot) return
    // Un mot déjà proposé ne compte pas deux fois.
    if (rappeles.some((item) => memeMot(item, mot))) {
      setSaisie('')
      return
    }
    setRappeles([...rappeles, mot])
    setSaisie('')
    champ.current?.focus()
  }

  const terminer = () => {
    // Un point par mot de la liste : retrouvé ou non.
    for (const mot of liste) {
      session.register(rappeles.some((propose) => memeMot(propose, mot)))
    }
    setPhase('resultats')
  }

  if (phase === 'memorisation') {
    return (
      <StudyPhase
        seconds={config.duree}
        instruction="Retiens bien ces mots"
        onDone={() => setPhase('rappel')}
      >
        <ul className="word-list">
          {liste.map((mot) => (
            <li key={mot} className="word-list__item">
              {mot}
            </li>
          ))}
        </ul>
      </StudyPhase>
    )
  }

  if (phase === 'rappel') {
    return (
      <div className="game-board">
        <p className="game-round">Rappel</p>
        <p className="game-prompt">Quels mots étaient dans la liste ?</p>
        <p className="game-instruction">
          Le praticien peut saisir les mots dictés par le patient. L’ordre n’a pas d’importance ;
          l’orthographe et les accents ne sont pas pris en compte.
        </p>

        <form className="recall-form" onSubmit={ajouter}>
          <label htmlFor="rappel-mot" className="visually-hidden">
            Mot rappelé
          </label>
          <input
            id="rappel-mot"
            ref={champ}
            className="text-input"
            type="text"
            autoComplete="off"
            placeholder="Un mot, puis Entrée…"
            value={saisie}
            onChange={(event) => setSaisie(event.target.value)}
          />
          <button type="submit" className="btn" disabled={saisie.trim() === ''}>
            Ajouter
          </button>
        </form>

        <div className="recall-chips">
          {rappeles.map((mot) => (
            <span key={mot} className="chip">
              {mot}
              <button
                type="button"
                className="chip__remove"
                aria-label={`Retirer ${mot}`}
                onClick={() => setRappeles(rappeles.filter((item) => item !== mot))}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <button type="button" className="btn btn--lg" onClick={terminer}>
          Terminer le rappel ({rappeles.length}/{liste.length})
        </button>
      </div>
    )
  }

  const retrouves = liste.filter((mot) => rappeles.some((propose) => memeMot(propose, mot)))
  const oublies = liste.filter((mot) => !retrouves.includes(mot))
  const intrus = rappeles.filter((propose) => !liste.some((mot) => memeMot(propose, mot)))

  return (
    <div className="game-final">
      <p className="game-round">Résultats</p>
      <p className="game-final__score">
        {retrouves.length} / {liste.length}
      </p>
      <p className="muted">
        {oublies.length === 0
          ? 'Liste restituée en entier.'
          : `${oublies.length} mot${oublies.length > 1 ? 's' : ''} non rappelé${oublies.length > 1 ? 's' : ''}.`}
        {intrus.length > 0 &&
          ` ${intrus.length} mot${intrus.length > 1 ? 's' : ''} ajouté${intrus.length > 1 ? 's' : ''} hors liste.`}
      </p>

      <div className="recall-chips">
        {liste.map((mot) => (
          <span
            key={mot}
            className={`chip ${retrouves.includes(mot) ? 'chip--found' : 'chip--missed'}`}
          >
            {mot}
          </span>
        ))}
        {intrus.map((mot) => (
          <span key={mot} className="chip chip--intruder">
            {mot}
          </span>
        ))}
      </div>

      <div className="game-actions">
        <button type="button" className="btn btn--lg" onClick={demarrer}>
          Nouvelle liste
        </button>
      </div>
    </div>
  )
}
