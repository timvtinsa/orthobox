/**
 * Session run: games follow one another, then the printed summary.
 *
 * A persistent banner is the only place where progress shows, and it does not
 * follow the patient onto the board. « Jeu suivant » is a proposal, never an
 * obligation: the practitioner cuts a game short whenever they want, the
 * milestone is then marked interrupted and the session carries on.
 */
import { Suspense, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GameCompanion from '../components/GameCompanion.jsx'
import { getGame } from '../games/registry.js'
import { categoryStyle, getCategory } from '../lib/categories.js'
import { useGameSession } from '../hooks/useGameSession.js'
import { readSessionPlan } from '../lib/session-plan.js'
import {
  missesLabel,
  reportDomains,
  reportRows,
  reportText,
  scoreLabel,
} from '../lib/session-report.js'

export default function SessionRunPage() {
  const navigate = useNavigate()
  const [steps] = useState(readSessionPlan)
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState([])

  if (steps.length === 0) {
    return (
      <div className="panel stack empty">
        <h1>Aucune séance préparée</h1>
        <p className="muted">Composez d’abord une suite de jeux.</p>
        <p>
          <Link to="/session" className="btn">
            Préparer une séance
          </Link>
        </p>
      </div>
    )
  }

  const finishStep = (result) => {
    setResults((current) => [...current, result])
    setIndex(index + 1)
  }

  const restart = () => {
    setResults([])
    setIndex(0)
  }

  if (index >= steps.length) {
    return (
      <Summary
        steps={steps}
        results={results}
        onRestart={restart}
        onEdit={() => navigate('/session')}
      />
    )
  }

  return (
    <SessionStep
      key={steps[index].id}
      step={steps[index]}
      steps={steps}
      index={index}
      onFinish={finishStep}
    />
  )
}

function SessionStep({ step, steps, index, onFinish }) {
  const session = useGameSession()
  const game = getGame(step.gameId)

  if (!game) {
    return (
      <div className="panel stack empty">
        <p className="muted">Ce jeu n’existe plus dans la galerie.</p>
        <button
          type="button"
          className="btn"
          onClick={() => onFinish({ gameId: step.gameId, correct: 0, attempts: 0, played: false })}
        >
          Passer
        </button>
      </div>
    )
  }

  const category = getCategory(game.category)
  const GameComponent = game.component
  const next = steps[index + 1]

  const finish = () =>
    onFinish({
      gameId: game.id,
      config: step.config,
      correct: session.correct,
      attempts: session.attempts,
      played: session.attempts > 0,
      misses: session.misses,
      // A game left before its last item is interrupted, which the summary
      // writes out rather than hiding behind a partial score.
      completed: session.total === null ? null : session.index >= session.total,
    })

  return (
    <div className="session" style={categoryStyle(category)}>
      <div className="session-banner">
        <span className="session-banner__rank">
          {index + 1} sur {steps.length}
        </span>
        <span className="session-banner__current">{game.title}</span>
        <span className="session-banner__next">
          Puis : {next ? getGame(next.gameId)?.title ?? 'jeu retiré' : 'fin de séance'}
        </span>
        <button type="button" className="session-banner__advance" onClick={finish}>
          {next ? 'Jeu suivant' : 'Terminer la séance'}
        </button>
      </div>

      <ol className="milestones" aria-label={`Jeu ${index + 1} sur ${steps.length}`}>
        {steps.map((entry, position) => {
          const state = position < index ? 'done' : position === index ? 'current' : 'todo'
          const title = getGame(entry.gameId)?.title ?? entry.gameId
          return (
            <li key={entry.id} className={`milestone milestone--${state}`}>
              <span className="milestone__bar" />
              <span className="milestone__name">{title}</span>
              <span className="visually-hidden">
                {state === 'done' ? 'fait' : state === 'current' ? 'en cours' : 'à venir'}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="board__area">
        <Suspense fallback={<p className="muted">Chargement du jeu…</p>}>
          <GameComponent config={step.config} session={session} />
        </Suspense>
      </div>

      <GameCompanion session={session} />
    </div>
  )
}

/**
 * Printed summary: black on white, black rules, no flat colour that would
 * drink the ink. Photographed askew, the table stays readable, and the shape
 * of the domain keeps saying the domain once the colour is gone.
 *
 * It doubles as the session report: what to go over again under each game,
 * the result per domain, and two free fields (the patient's initials and the
 * practitioner's observations) that are printed with it. None of it is stored.
 */
function Summary({ steps, results, onRestart, onEdit }) {
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
  const [patient, setPatient] = useState('')
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)

  const rows = reportRows(steps, results)
  const domains = reportDomains(rows)
  const text = () => reportText({ rows, domains, date: today, patient: patient.trim(), note })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked: the download below does the same job.
    }
  }

  const download = () => {
    const url = URL.createObjectURL(new Blob([text()], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'bilan-de-seance.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="stack summary">
      <header className="hero no-print">
        <h1 className="hero__title">Bilan de la séance</h1>
        <p className="hero__text">
          À imprimer, copier ou enregistrer. Ces scores ne sont pas conservés par l’application :
          ils disparaissent en quittant la page.
        </p>
      </header>

      <div className="recap">
        <div className="recap__head">
          <div className="recap__title">
            Séance du {today}
            {patient.trim() && ` · ${patient.trim()}`}
          </div>
          <div className="recap__meta">
            {steps.length} jeu{steps.length > 1 ? 'x' : ''}
          </div>
        </div>

        {rows.map((row) => (
          <div key={steps[row.rank - 1].id} className="recap__row">
            <span className="recap__rank">{row.rank}</span>
            <span className="recap__text">
              <strong>{row.title}</strong>
              <br />
              {row.settings}
              {row.misses.length > 0 && (
                <>
                  <br />
                  <span className="recap__misses">À revoir : {missesLabel(row)}</span>
                </>
              )}
            </span>
            <span className="recap__score">{scoreLabel(row)}</span>
          </div>
        ))}

        {domains.length > 0 && (
          <div className="recap__domains">
            <strong>Par domaine</strong>
            {domains.map((domain) => (
              <div key={domain.category} className="recap__domain">
                <span>{domain.label}</span>
                <span>
                  {domain.correct} / {domain.attempts} ({domain.rate} %)
                </span>
              </div>
            ))}
          </div>
        )}

        {note.trim() && (
          <div className="recap__note">
            <strong>Observations</strong>
            <p>{note.trim()}</p>
          </div>
        )}
      </div>

      <div className="recap-fields no-print">
        <label className="field">
          <span className="field__label">Patient (initiales, facultatif)</span>
          <input
            className="field__input"
            type="text"
            maxLength={30}
            value={patient}
            onChange={(event) => setPatient(event.target.value)}
          />
        </label>
        <label className="field">
          <span className="field__label">Observations (facultatif)</span>
          <textarea
            className="field__input"
            rows={4}
            maxLength={1000}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
      </div>

      <div className="game-actions no-print">
        <button type="button" className="btn btn--lg" onClick={() => window.print()}>
          Imprimer le bilan
        </button>
        <button type="button" className="btn btn--ghost" onClick={copy}>
          {copied ? 'Copié' : 'Copier le bilan'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={download}>
          Télécharger (.txt)
        </button>
        <button type="button" className="btn btn--ghost" onClick={onRestart}>
          Refaire la séance
        </button>
        <button type="button" className="btn btn--ghost" onClick={onEdit}>
          Modifier la séance
        </button>
        <Link to="/" className="btn btn--ghost">
          Retour à la galerie
        </Link>
      </div>
    </div>
  )
}
