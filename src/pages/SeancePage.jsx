import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GameSetup, { defaultConfig } from '../components/GameSetup.jsx'
import Icon from '../components/Icon.jsx'
import { GAMES, getGame } from '../games/registry.js'
import { categoryStyle, getCategory } from '../lib/categories.js'
import { deplacer, ecrireSeance, lireSeance, nouvelleEtape } from '../lib/seance.js'
import { useDragSequence } from '../hooks/useDragSequence.js'

export default function SeancePage() {
  const navigate = useNavigate()
  const [etapes, setEtapes] = useState(lireSeance)
  const [reglageOuvert, setReglageOuvert] = useState(null)

  const enregistrer = (suite) => {
    setEtapes(suite)
    ecrireSeance(suite)
  }

  const ajouter = (gameId, position = etapes.length) => {
    const game = getGame(gameId)
    if (!game) return
    const suite = [...etapes]
    suite.splice(position, 0, nouvelleEtape(gameId, defaultConfig(game.settings)))
    enregistrer(suite)
  }

  const deposer = useCallback(
    ({ type, gameId, depuis, vers }) => {
      if (type === 'ajout') {
        const game = getGame(gameId)
        if (!game) return
        setEtapes((current) => {
          const suite = [...current]
          suite.splice(vers, 0, nouvelleEtape(gameId, defaultConfig(game.settings)))
          ecrireSeance(suite)
          return suite
        })
      } else {
        setEtapes((current) => {
          const suite = deplacer(current, depuis, vers)
          ecrireSeance(suite)
          return suite
        })
      }
    },
    [],
  )

  const { drag, cible, zone, commencer, enregistrerElement } = useDragSequence({ onDrop: deposer })

  const retirer = (id) => enregistrer(etapes.filter((etape) => etape.id !== id))

  const decaler = (index, sens) => {
    const vers = index + sens
    if (vers < 0 || vers >= etapes.length) return
    enregistrer(deplacer(etapes, index, vers))
  }

  const appliquerReglages = (id, config) => {
    enregistrer(etapes.map((etape) => (etape.id === id ? { ...etape, config } : etape)))
    setReglageOuvert(null)
  }

  const dureeEstimee = etapes.reduce((total, etape) => {
    const minutes = parseInt(getGame(etape.gameId)?.duration ?? '5', 10)
    return total + (Number.isNaN(minutes) ? 5 : minutes)
  }, 0)

  return (
    <div className="stack seance-page">
      <section className="hero">
        <h1 className="hero__title">Préparer une séance</h1>
        <p className="hero__text">
          Composez une suite de jeux : glissez-les depuis la liste de droite, ou touchez-les pour
          les ajouter à la fin. L’ordre se modifie par glissement, et chaque jeu garde ses propres
          réglages. À la fin de la séance, un récapitulatif reprend tous les scores.
        </p>
      </section>

      <div className="seance-layout">
        <section className="seance-colonne">
          <header className="seance-colonne__entete">
            <h2 className="seance-colonne__titre">La séance</h2>
            {etapes.length > 0 && (
              <span className="badge">
                {etapes.length} jeu{etapes.length > 1 ? 'x' : ''} · environ {dureeEstimee} min
              </span>
            )}
          </header>

          <ol className={`sequence${drag ? ' sequence--survol' : ''}`} ref={zone}>
            {etapes.length === 0 && (
              <li className="sequence__vide">
                Aucun jeu pour l’instant. Ajoutez-en depuis la liste des jeux.
              </li>
            )}

            {etapes.map((etape, index) => {
              const game = getGame(etape.gameId)
              if (!game) return null
              const category = getCategory(game.category)
              const enDeplacement = drag?.type === 'deplacement' && drag.depuis === index
              return (
                <li
                  key={etape.id}
                  ref={(element) => enregistrerElement(index, element)}
                  className={`sequence__item${cible === index ? ' sequence__item--cible' : ''}${
                    enDeplacement ? ' sequence__item--fantome' : ''
                  }`}
                  style={categoryStyle(category)}
                >
                  <button
                    type="button"
                    className="sequence__poignee"
                    aria-label={`Déplacer ${game.title}`}
                    onPointerDown={(event) =>
                      commencer(event, { type: 'deplacement', depuis: index, gameId: etape.gameId })
                    }
                  >
                    <span className="sequence__rang">{index + 1}</span>
                    <span className="sequence__grip" aria-hidden="true" />
                  </button>

                  <img className="sequence__cover" src={game.cover} alt="" width="320" height="200" />

                  <div className="sequence__texte">
                    <h3 className="sequence__nom">{game.title}</h3>
                    <p className="sequence__reglages">{resumerConfig(game, etape.config)}</p>
                  </div>

                  <div className="sequence__actions">
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Monter ${game.title}`}
                      disabled={index === 0}
                      onClick={() => decaler(index, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Descendre ${game.title}`}
                      disabled={index === etapes.length - 1}
                      onClick={() => decaler(index, 1)}
                    >
                      ↓
                    </button>
                    {game.settings.length > 0 && (
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`Régler ${game.title}`}
                        onClick={() =>
                          setReglageOuvert(reglageOuvert === etape.id ? null : etape.id)
                        }
                      >
                        <Icon name="settings" size={18} filled={false} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      aria-label={`Retirer ${game.title}`}
                      onClick={() => retirer(etape.id)}
                    >
                      <Icon name="cross" size={18} filled={false} />
                    </button>
                  </div>

                  {reglageOuvert === etape.id && (
                    <div className="sequence__panneau">
                      <GameSetup
                        game={game}
                        initial={etape.config}
                        actionLabel="Valider les réglages"
                        onStart={(config) => appliquerReglages(etape.id, config)}
                      />
                    </div>
                  )}
                </li>
              )
            })}

            {cible === etapes.length && <li className="sequence__marqueur" aria-hidden="true" />}
          </ol>

          <div className="game-actions">
            <button
              type="button"
              className="btn btn--lg"
              disabled={etapes.length === 0}
              onClick={() => navigate('/seance/jouer')}
            >
              Lancer la séance
            </button>
            {etapes.length > 0 && (
              <button type="button" className="btn btn--ghost" onClick={() => enregistrer([])}>
                Tout effacer
              </button>
            )}
          </div>
        </section>

        <section className="seance-colonne">
          <header className="seance-colonne__entete">
            <h2 className="seance-colonne__titre">Les jeux</h2>
            <Link to="/" className="breadcrumb__back">
              Voir la galerie
            </Link>
          </header>

          <ul className="seance-catalogue">
            {GAMES.map((game) => {
              const category = getCategory(game.category)
              return (
                <li key={game.id} style={categoryStyle(category)}>
                  <button
                    type="button"
                    className="catalogue-item"
                    onPointerDown={(event) =>
                      commencer(event, { type: 'ajout', gameId: game.id })
                    }
                    onClick={() => ajouter(game.id)}
                  >
                    <img src={game.cover} alt="" width="320" height="200" />
                    <span className="catalogue-item__texte">
                      <span className="catalogue-item__nom">{game.title}</span>
                      <span className="badge badge--category">{category.short}</span>
                    </span>
                    <span className="catalogue-item__plus" aria-hidden="true">
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
        <div className="drag-fantome" style={{ left: drag.x, top: drag.y }}>
          {getGame(drag.gameId)?.title}
        </div>
      )}
    </div>
  )
}

/** Résumé lisible des réglages d'une étape, pour la carte de séquence. */
function resumerConfig(game, config) {
  if (!game.settings.length) return 'Aucun réglage'
  return game.settings
    .map((champ) => {
      const valeur = config?.[champ.id]
      if (champ.type === 'choice') {
        return champ.options.find((option) => option.id === valeur)?.label ?? valeur
      }
      return `${champ.label.toLowerCase()} : ${valeur}${champ.suffix ? ` ${champ.suffix}` : ''}`
    })
    .join(' · ')
}
