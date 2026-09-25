/**
 * Session planning: put together and order a sequence of games.
 */
import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GameSetup, { defaultConfig } from '../components/GameSetup.jsx'
import Icon from '../components/Icon.jsx'
import StyledQr from '../components/StyledQr.jsx'
import { GAMES, getGame } from '../games/registry.js'
import { categoryStyle, getCategory } from '../lib/categories.js'
import {
  createStep,
  moveItem,
  readSessionPlan,
  summariseConfig,
  writeSessionPlan,
} from '../lib/session-plan.js'
import { sessionShareLink } from '../lib/share-session.js'
import { useDragSequence } from '../hooks/useDragSequence.js'

export default function SessionBuilderPage() {
  const navigate = useNavigate()
  const [steps, setSteps] = useState(readSessionPlan)
  const [openSettings, setOpenSettings] = useState(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const save = (plan) => {
    setSteps(plan)
    writeSessionPlan(plan)
  }

  const addGame = (gameId, position = steps.length) => {
    const game = getGame(gameId)
    if (!game) return
    const plan = [...steps]
    plan.splice(position, 0, createStep(gameId, defaultConfig(game.settings)))
    save(plan)
  }

  const handleDrop = useCallback(({ type, gameId, from, to }) => {
    if (type === 'add') {
      const game = getGame(gameId)
      if (!game) return
      setSteps((current) => {
        const plan = [...current]
        plan.splice(to, 0, createStep(gameId, defaultConfig(game.settings)))
        writeSessionPlan(plan)
        return plan
      })
    } else {
      setSteps((current) => {
        const plan = moveItem(current, from, to)
        writeSessionPlan(plan)
        return plan
      })
    }
  }, [])

  const { drag, target, zone, start, registerItem } = useDragSequence({ onDrop: handleDrop })

  const remove = (id) => save(steps.filter((step) => step.id !== id))

  const shift = (index, direction) => {
    const to = index + direction
    if (to < 0 || to >= steps.length) return
    save(moveItem(steps, index, to))
  }

  const applySettings = (id, config) => {
    save(steps.map((step) => (step.id === id ? { ...step, config } : step)))
    setOpenSettings(null)
  }

  const shareLink = steps.length > 0 ? sessionShareLink(steps) : ''

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé, permission
      // refusée) : le champ reste sélectionnable à la main.
      setCopied(false)
    }
  }

  return (
    <div className="stack session-page">
      <section className="hero">
        <h1 className="hero__title">Préparer une séance</h1>
        <p className="hero__text">
          Composez une suite de jeux : glissez-les depuis la liste de droite, ou touchez-les pour
          les ajouter à la fin. L’ordre se modifie par glissement, et chaque jeu garde ses propres
          réglages. À la fin de la séance, un récapitulatif reprend tous les scores.
        </p>
      </section>

      <div className="session-layout">
        <section className="session-column">
          <header className="session-column__header">
            <h2 className="session-column__title">La séance</h2>
            {steps.length > 0 && (
              <span className="badge">
                {steps.length} jeu{steps.length > 1 ? 'x' : ''}
              </span>
            )}
          </header>

          <ol className={`sequence${drag ? ' sequence--hover' : ''}`} ref={zone}>
            {steps.length === 0 && (
              <li className="sequence__empty">
                Aucun jeu pour l’instant. Ajoutez-en depuis la liste des jeux.
              </li>
            )}

            {steps.map((step, index) => {
              const game = getGame(step.gameId)
              if (!game) return null
              const category = getCategory(game.category)
              const beingMoved = drag?.type === 'move' && drag.from === index
              return (
                <li
                  key={step.id}
                  ref={(element) => registerItem(index, element)}
                  className={`sequence__item${target === index ? ' sequence__item--target' : ''}${
                    beingMoved ? ' sequence__item--ghost' : ''
                  }`}
                  style={categoryStyle(category)}
                >
                  <button
                    type="button"
                    className="sequence__handle"
                    aria-label={`Déplacer ${game.title}`}
                    onPointerDown={(event) =>
                      start(event, { type: 'move', from: index, gameId: step.gameId })
                    }
                  >
                    <span className="sequence__rank">{index + 1}</span>
                    <span className="sequence__grip" aria-hidden="true" />
                  </button>

                  <img className="sequence__cover" src={game.cover} alt="" width="320" height="200" />

                  <div className="sequence__text">
                    <h3 className="sequence__name">{game.title}</h3>
                    <p className="sequence__settings">{summariseConfig(game, step.config)}</p>
                  </div>

                  <div className="sequence__actions">
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Monter ${game.title}`}
                      disabled={index === 0}
                      onClick={() => shift(index, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Descendre ${game.title}`}
                      disabled={index === steps.length - 1}
                      onClick={() => shift(index, 1)}
                    >
                      ↓
                    </button>
                    {game.settings.length > 0 && (
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`Régler ${game.title}`}
                        onClick={() => setOpenSettings(openSettings === step.id ? null : step.id)}
                      >
                        <Icon name="settings" size={18} filled={false} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      aria-label={`Retirer ${game.title}`}
                      onClick={() => remove(step.id)}
                    >
                      <Icon name="cross" size={18} filled={false} />
                    </button>
                  </div>

                  {openSettings === step.id && (
                    <div className="sequence__panel">
                      <GameSetup
                        game={game}
                        initial={step.config}
                        actionLabel="Valider les réglages"
                        onStart={(config) => applySettings(step.id, config)}
                      />
                    </div>
                  )}
                </li>
              )
            })}

            {target === steps.length && <li className="sequence__marker" aria-hidden="true" />}
          </ol>

          <div className="game-actions">
            <button
              type="button"
              className="btn btn--lg"
              disabled={steps.length === 0}
              onClick={() => navigate('/session/run')}
            >
              Lancer la séance
            </button>
            {steps.length > 0 && (
              <button
                type="button"
                className="btn btn--ghost"
                aria-expanded={shareOpen}
                onClick={() => setShareOpen((open) => !open)}
              >
                Partager la séance
              </button>
            )}
            {steps.length > 0 && (
              <button type="button" className="btn btn--ghost" onClick={() => save([])}>
                Tout effacer
              </button>
            )}
          </div>

          {shareOpen && steps.length > 0 && (
            <div className="share-panel">
              <StyledQr
                value={shareLink}
                className="share-panel__qr"
                label="Code QR : lien vers cette séance"
              />

              <div className="share-panel__details">
                <p className="share-panel__note">
                  Le code et le lien ne contiennent que la liste des jeux et leurs réglages :
                  aucune donnée patient, aucun résultat n’y est attaché. À faire scanner par le
                  patient, ou à lui envoyer, pour qu’il retrouve la même séance chez lui.
                </p>

                <div className="share-panel__link-row">
                  <input
                    className="share-panel__link"
                    type="text"
                    readOnly
                    value={shareLink}
                    onFocus={(event) => event.target.select()}
                    aria-label="Lien vers cette séance"
                  />
                  <button type="button" className="btn btn--subtle" onClick={copyLink}>
                    {copied ? 'Copié' : 'Copier le lien'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="session-column">
          <header className="session-column__header">
            <h2 className="session-column__title">Les jeux</h2>
            <Link to="/" className="breadcrumb__back">
              Voir la galerie
            </Link>
          </header>

          <ul className="session-catalog">
            {GAMES.map((game) => {
              const category = getCategory(game.category)
              return (
                <li key={game.id} style={categoryStyle(category)}>
                  <button
                    type="button"
                    className="catalog-item"
                    onPointerDown={(event) => start(event, { type: 'add', gameId: game.id })}
                    onClick={() => addGame(game.id)}
                  >
                    <img src={game.cover} alt="" width="320" height="200" />
                    <span className="catalog-item__text">
                      <span className="catalog-item__name">{game.title}</span>
                      <span className="badge badge--category">{category.short}</span>
                    </span>
                    <span className="catalog-item__plus" aria-hidden="true">
                      +
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      {drag && (
        <div className="drag-ghost" style={{ left: drag.x, top: drag.y }}>
          {getGame(drag.gameId)?.title}
        </div>
      )}
    </div>
  )
}
