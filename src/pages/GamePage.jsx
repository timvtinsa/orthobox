/**
 * Page d'un jeu : réglages, puis partie, avec le score et le retour aux réglages.
 */
import { Suspense, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CompagnonDeJeu from '../components/CompagnonDeJeu.jsx'
import GameSetup, { defaultConfig } from '../components/GameSetup.jsx'
import Icon from '../components/Icon.jsx'
import Scoreboard from '../components/Scoreboard.jsx'
import { getGame } from '../games/registry.js'
import { categoryStyle, getCategory } from '../lib/categories.js'
import { useGameSession } from '../hooks/useGameSession.js'
import NotFoundPage from './NotFoundPage.jsx'

export default function GamePage() {
  const { gameId } = useParams()
  // La clé remonte toute la page quand on passe d'un jeu à l'autre : sans
  // cela, les réglages et le score du jeu précédent seraient conservés.
  return <GameScreen key={gameId} gameId={gameId} />
}

function GameScreen({ gameId }) {
  const game = getGame(gameId)
  // `null` tant que la partie n'est pas lancée : on est alors sur les réglages.
  const [config, setConfig] = useState(null)
  const [runKey, setRunKey] = useState(0)
  const session = useGameSession()

  if (!game) return <NotFoundPage />

  const category = getCategory(game.category)
  const GameComponent = game.component

  const lancer = (reglages) => {
    session.reset()
    setConfig(reglages)
    setRunKey((key) => key + 1)
  }

  return (
    <div className="game-page stack" style={categoryStyle(category)}>
      <nav className="breadcrumb">
        <Link to="/" className="breadcrumb__back">
          <Icon name="back" size={18} filled={false} />
          Galerie
        </Link>
        <span className="badge badge--category">{category.label}</span>
      </nav>

      <header className="game-header">
        <img className="game-header__cover" src={game.cover} alt="" width="320" height="200" />
        <div className="game-header__text">
          <h1 className="game-header__title">{game.title}</h1>
          <p className="muted">{game.tagline}</p>
        </div>
        {config && (
          <div className="game-header__controls">
            <Scoreboard session={session} />
            <button type="button" className="btn btn--ghost" onClick={() => lancer(config)}>
              Recommencer
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                session.reset()
                setConfig(null)
              }}
            >
              <Icon name="settings" size={18} filled={false} />
              Réglages
            </button>
          </div>
        )}
      </header>

      <section className="panel game-panel">
        {config === null ? (
          <GameSetup
            game={game}
            initial={defaultConfig(game.settings)}
            onStart={lancer}
            actionLabel="Démarrer"
          />
        ) : (
          <Suspense fallback={<p className="muted">Chargement du jeu…</p>}>
            <GameComponent key={runKey} config={config} session={session} />
          </Suspense>
        )}
      </section>

      {config && <CompagnonDeJeu session={session} />}

      <details className="game-notes">
        <summary>Consignes et objectifs</summary>
        <div className="stack">
          {game.instructions && <p>{game.instructions}</p>}
          {game.objectives.length > 0 && (
            <div>
              <h2 className="game-notes__title">Objectifs travaillés</h2>
              <ul>
                {game.objectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </div>
          )}
          {game.materials.length > 0 && (
            <div>
              <h2 className="game-notes__title">Variantes et matériel</h2>
              <ul>
                {game.materials.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="muted">Public : {game.ages}</p>
        </div>
      </details>
    </div>
  )
}
