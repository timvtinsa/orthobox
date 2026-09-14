/**
 * Session run: games follow one another, then the summary.
 */
import { Suspense, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GameCompanion from '../components/GameCompanion.jsx'
import Icon from '../components/Icon.jsx'
import Scoreboard from '../components/Scoreboard.jsx'
import { getGame } from '../games/registry.js'
import { categoryStyle, getCategory } from '../lib/categories.js'
import { useGameSession } from '../hooks/useGameSession.js'
import { readSessionPlan, successRate } from '../lib/session-plan.js'

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
      number={index + 1}
      total={steps.length}
      onFinish={finishStep}
    />
  )
}

function SessionStep({ step, number, total, onFinish }) {
  const session = useGameSession()
  const game = getGame(step.gameId)
  const [runKey, setRunKey] = useState(0)

  if (!game) {
    return (
      <div className="panel stack empty">
        <p className="muted">Ce jeu n’existe plus dans la galerie.</p>
        <button
          type="button"
          className="btn"
          onClick={() => onFinish({ gameId: step.gameId, correct: 0, attempts: 0, skipped: true })}
        >
          Passer
        </button>
      </div>
    )
  }

  const category = getCategory(game.category)
  const GameComponent = game.component

  const finish = () =>
    onFinish({
      gameId: game.id,
      correct: session.correct,
      attempts: session.attempts,
      skipped: session.attempts === 0,
    })

  return (
    <div className="stack game-page" style={categoryStyle(category)}>
      <div className="session-bar">
        <div className="session-bar__text">
          <span className="game-round">
            Séance, jeu {number} sur {total}
          </span>
          <strong className="session-bar__title">{game.title}</strong>
        </div>

        <ol
          className="progress-steps session-bar__steps"
          aria-label={`Progression : jeu ${number} sur ${total}`}
        >
          {Array.from({ length: total }, (_, position) => {
            const state =
              position < number - 1 ? 'done' : position === number - 1 ? 'current' : 'todo'
            return (
              <li key={position} className={`progress-step progress-step--${state}`}>
                <span className="progress-step__dot">{position + 1}</span>
                <span className="visually-hidden">
                  {state === 'done' ? 'terminé' : state === 'current' ? 'en cours' : 'à venir'}
                </span>
              </li>
            )
          })}
        </ol>

        <div className="session-bar__actions">
          <Scoreboard session={session} />
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              session.reset()
              setRunKey((key) => key + 1)
            }}
          >
            Recommencer
          </button>
          <button type="button" className="btn" onClick={finish}>
            {number === total ? 'Terminer la séance' : 'Jeu suivant'}
            <Icon name="check" size={18} filled={false} />
          </button>
        </div>
      </div>

      <section className="panel game-panel">
        <Suspense fallback={<p className="muted">Chargement du jeu…</p>}>
          <GameComponent key={runKey} config={step.config} session={session} />
        </Suspense>
      </section>

      <GameCompanion session={session} />

      <p className="game-instruction session-note">
        Le passage au jeu suivant se fait quand vous le décidez : le score obtenu jusque-là est
        conservé dans le récapitulatif.
      </p>
    </div>
  )
}

function Summary({ steps, results, onRestart, onEdit }) {
  const played = results.filter((result) => !result.skipped)
  const totalCorrect = played.reduce((sum, result) => sum + result.correct, 0)
  const totalAttempts = played.reduce((sum, result) => sum + result.attempts, 0)
  const overall = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null

  return (
    <div className="stack summary">
      <header className="hero">
        <h1 className="hero__title">Récapitulatif de la séance</h1>
        <p className="hero__text">
          {steps.length} jeu{steps.length > 1 ? 'x' : ''} enchaîné
          {steps.length > 1 ? 's' : ''}
          {overall !== null
            ? ` · ${totalCorrect} réussites sur ${totalAttempts} essais (${overall} %)`
            : ''}
        </p>
      </header>

      <div className="table-wrap">
        <table className="summary-table">
          <thead>
            <tr>
              <th scope="col">Jeu</th>
              <th scope="col">Domaine</th>
              <th scope="col">Réussites</th>
              <th scope="col">Taux</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, position) => {
              const game = getGame(result.gameId)
              const category = game ? getCategory(game.category) : null
              const rate = successRate(result)
              return (
                <tr key={`${result.gameId}-${position}`}>
                  <th scope="row">{game?.title ?? result.gameId}</th>
                  <td>
                    {category && (
                      <span className="badge badge--category" style={categoryStyle(category)}>
                        {category.short}
                      </span>
                    )}
                  </td>
                  <td className="summary-table__number">
                    {result.skipped ? '·' : `${result.correct} / ${result.attempts}`}
                  </td>
                  <td className="summary-table__number">
                    {rate === null ? (
                      <span className="muted">non joué</span>
                    ) : (
                      <span className="summary-rate">
                        <span className="summary-rate__bar">
                          <span className="summary-rate__fill" style={{ width: `${rate}%` }} />
                        </span>
                        {rate} %
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="muted">
        Ces scores ne sont pas enregistrés : ils disparaissent en quittant la page. Utilisez
        l’impression si vous souhaitez les conserver.
      </p>

      <div className="game-actions no-print">
        <button type="button" className="btn btn--lg" onClick={onRestart}>
          Refaire la séance
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => window.print()}>
          Imprimer le récapitulatif
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
