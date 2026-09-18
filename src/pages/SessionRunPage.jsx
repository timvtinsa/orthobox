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
import { readSessionPlan, summariseConfig } from '../lib/session-plan.js'

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
 */
function Summary({ steps, results, onRestart, onEdit }) {
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })

  const score = (result) => {
    if (!result || !result.played) return 'non joué'
    if (result.completed === false) return 'interrompu'
    return `${result.correct} / ${result.attempts}`
  }

  return (
    <div className="stack summary">
      <header className="hero no-print">
        <h1 className="hero__title">Récapitulatif de la séance</h1>
        <p className="hero__text">
          À imprimer ou à photographier. Ces scores ne sont pas enregistrés : ils disparaissent en
          quittant la page.
        </p>
      </header>

      <div className="recap">
        <div className="recap__head">
          <div className="recap__title">Séance du {today}</div>
          <div className="recap__meta">
            {steps.length} jeu{steps.length > 1 ? 'x' : ''}
          </div>
        </div>

        {steps.map((step, position) => {
          const game = getGame(step.gameId)
          const result = results[position]
          return (
            <div key={step.id} className="recap__row">
              <span className="recap__rank">{position + 1}</span>
              <span className="recap__text">
                <strong>{game?.title ?? step.gameId}</strong>
                <br />
                {game ? summariseConfig(game, step.config) : 'jeu retiré de la galerie'}
              </span>
              <span className="recap__score">{score(result)}</span>
            </div>
          )
        })}
      </div>

      <div className="game-actions no-print">
        <button type="button" className="btn btn--lg" onClick={() => window.print()}>
          Imprimer le récapitulatif
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
