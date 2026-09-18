/**
 * Game page: two moments of the same screen.
 *
 * The practitioner's settings first, then the patient's board. The switch is
 * abrupt on purpose: the board is not mounted before « Démarrer », so the
 * patient sees neither the material nor the expected answer, and the settings
 * disappear once the game starts.
 */
import { Suspense, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import BoardBar from '../components/BoardBar.jsx'
import CategoryShape from '../components/CategoryShape.jsx'
import GameBrief from '../components/GameBrief.jsx'
import GameCompanion from '../components/GameCompanion.jsx'
import GameSetup, { defaultConfig } from '../components/GameSetup.jsx'
import Icon from '../components/Icon.jsx'
import { getGame } from '../games/registry.js'
import { categoryStyle, getCategory } from '../lib/categories.js'
import { useGameSession } from '../hooks/useGameSession.js'
import { settingsFromParams } from '../lib/share-settings.js'
import NotFoundPage from './NotFoundPage.jsx'

export default function GamePage() {
  const { gameId } = useParams()
  // The key remounts the whole page when moving from one game to another:
  // without it, the previous game's settings and score would carry over.
  return <GameScreen key={gameId} gameId={gameId} />
}

function GameScreen({ gameId }) {
  const game = getGame(gameId)
  // `null` until the game starts, which means the settings screen is showing.
  const [config, setConfig] = useState(null)
  const [runKey, setRunKey] = useState(0)
  const [briefOpen, setBriefOpen] = useState(false)
  const session = useGameSession()
  const [searchParams] = useSearchParams()

  // Réglages reçus par un lien partagé : lus une fois, jamais réécrits dans
  // l'URL, et sans effet sur rien d'autre qu'un champ manquant, qui garde le
  // défaut du jeu.
  const shared = useMemo(
    () => (game ? settingsFromParams(game.settings, searchParams) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [game],
  )

  if (!game) return <NotFoundPage />

  const category = getCategory(game.category)
  const GameComponent = game.component
  const initialSettings = shared ? { ...defaultConfig(game.settings), ...shared } : defaultConfig(game.settings)

  const start = (settings) => {
    session.reset()
    setConfig(settings)
    setRunKey((key) => key + 1)
  }

  // Leaving a game is immediate: no confirmation, no end screen. The
  // practitioner cuts a game short more often than they finish it.
  const quit = () => {
    session.reset()
    setConfig(null)
  }

  if (config !== null) {
    return (
      <div className="board" style={categoryStyle(category)}>
        <BoardBar title={game.title} session={session} onQuit={quit} />

        <div className="board__area">
          <div className="board__content">
            <Suspense fallback={<p className="muted">Chargement du jeu…</p>}>
              <GameComponent key={runKey} config={config} session={session} />
            </Suspense>
          </div>

          <GameCompanion session={session} />
        </div>
      </div>
    )
  }

  return (
    <div className="screen" style={categoryStyle(category)}>
      <header className="screen-bar">
        <Link to="/" className="icon-round" aria-label="Retour à la galerie">
          <Icon name="back" size={22} filled={false} />
        </Link>

        <h1 className="screen-bar__title">{game.title}</h1>

        <span className="domain-pill">
          <CategoryShape shape={category.shape} size={10} />
          {category.label}
        </span>

        <button
          type="button"
          className="screen-bar__brief"
          aria-expanded={briefOpen}
          onClick={() => setBriefOpen((open) => !open)}
        >
          Consignes et objectifs
          <Icon
            name="chevron"
            size={16}
            filled={false}
            className={briefOpen ? 'icon--flipped' : ''}
          />
        </button>
      </header>

      {briefOpen && <GameBrief game={game} />}

      <GameSetup
        game={game}
        initial={initialSettings}
        sharedApplied={Boolean(shared)}
        onStart={start}
      />
    </div>
  )
}
