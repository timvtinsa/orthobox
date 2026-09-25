/**
 * Landing page for a session shared as a QR code or link (see
 * `share-session.js`): shows what the link contains before it silently
 * replaces whatever plan may already be in progress on this device, rather
 * than jumping straight to the board.
 */
import { useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getGame } from '../games/registry.js'
import { categoryStyle, getCategory } from '../lib/categories.js'
import { summariseConfig, writeSessionPlan } from '../lib/session-plan.js'
import { decodeSessionSteps } from '../lib/share-session.js'

export default function SessionSharedPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const steps = useMemo(() => decodeSessionSteps(searchParams.get('p')), [searchParams])

  if (!steps) {
    return (
      <div className="panel stack empty">
        <h1>Lien de séance invalide</h1>
        <p className="muted">
          Ce lien ne correspond à aucune séance utilisable : il est incomplet, ou les jeux qu’il
          propose ne sont plus dans la galerie.
        </p>
        <p>
          <Link to="/session" className="btn">
            Préparer une séance
          </Link>
        </p>
      </div>
    )
  }

  const start = () => {
    writeSessionPlan(steps)
    navigate('/session/run', { replace: true })
  }

  const edit = () => {
    writeSessionPlan(steps)
    navigate('/session', { replace: true })
  }

  return (
    <div className="stack session-page">
      <section className="hero">
        <h1 className="hero__title">Séance reçue</h1>
        <p className="hero__text">
          {steps.length} jeu{steps.length > 1 ? 'x' : ''} préparé{steps.length > 1 ? 's' : ''}{' '}
          pour vous. La démarrer remplace la séance éventuellement déjà en préparation sur cet
          appareil.
        </p>
      </section>

      <ol className="sequence">
        {steps.map((step, index) => {
          const game = getGame(step.gameId)
          const category = getCategory(game.category)
          return (
            <li key={step.id} className="sequence__item" style={categoryStyle(category)}>
              <span className="sequence__handle sequence__handle--static" aria-hidden="true">
                <span className="sequence__rank">{index + 1}</span>
              </span>

              <img className="sequence__cover" src={game.cover} alt="" width="320" height="200" />

              <div className="sequence__text">
                <h3 className="sequence__name">{game.title}</h3>
                <p className="sequence__settings">{summariseConfig(game, step.config)}</p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="game-actions">
        <button type="button" className="btn btn--lg" onClick={start}>
          Commencer la séance
        </button>
        <button type="button" className="btn btn--ghost" onClick={edit}>
          Modifier avant de commencer
        </button>
        <Link to="/" className="btn btn--ghost">
          Retour à la galerie
        </Link>
      </div>
    </div>
  )
}
