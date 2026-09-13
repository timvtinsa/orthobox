/**
 * Déroulé d'une séance : les jeux s'enchaînent, puis le récapitulatif.
 */
import { Suspense, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Scoreboard from '../components/Scoreboard.jsx'
import { getGame } from '../games/registry.js'
import { categoryStyle, getCategory } from '../lib/categories.js'
import { useGameSession } from '../hooks/useGameSession.js'
import { lireSeance, pourcentage } from '../lib/seance.js'

export default function SeanceRunPage() {
  const navigate = useNavigate()
  const [etapes] = useState(lireSeance)
  const [index, setIndex] = useState(0)
  const [resultats, setResultats] = useState([])

  if (etapes.length === 0) {
    return (
      <div className="panel stack empty">
        <h1>Aucune séance préparée</h1>
        <p className="muted">Composez d’abord une suite de jeux.</p>
        <p>
          <Link to="/seance" className="btn">
            Préparer une séance
          </Link>
        </p>
      </div>
    )
  }

  const terminer = (resultat) => {
    setResultats((current) => [...current, resultat])
    setIndex(index + 1)
  }

  const recommencer = () => {
    setResultats([])
    setIndex(0)
  }

  if (index >= etapes.length) {
    return (
      <Recapitulatif
        etapes={etapes}
        resultats={resultats}
        onRecommencer={recommencer}
        onModifier={() => navigate('/seance')}
      />
    )
  }

  return (
    <EtapeSeance
      key={etapes[index].id}
      etape={etapes[index]}
      numero={index + 1}
      total={etapes.length}
      onTerminer={terminer}
    />
  )
}

function EtapeSeance({ etape, numero, total, onTerminer }) {
  const session = useGameSession()
  const game = getGame(etape.gameId)
  const [runKey, setRunKey] = useState(0)

  if (!game) {
    return (
      <div className="panel stack empty">
        <p className="muted">Ce jeu n’existe plus dans la galerie.</p>
        <button
          type="button"
          className="btn"
          onClick={() => onTerminer({ gameId: etape.gameId, correct: 0, attempts: 0, passe: true })}
        >
          Passer
        </button>
      </div>
    )
  }

  const category = getCategory(game.category)
  const GameComponent = game.component

  const finir = (passe) =>
    onTerminer({
      gameId: game.id,
      correct: session.correct,
      attempts: session.attempts,
      passe: passe && session.attempts === 0,
    })

  return (
    <div className="stack game-page" style={categoryStyle(category)}>
      <div className="seance-barre">
        <div className="seance-barre__texte">
          <span className="game-round">
            Séance, jeu {numero} sur {total}
          </span>
          <strong className="seance-barre__titre">{game.title}</strong>
        </div>

        <ol className="jalons seance-barre__jalons" aria-label={`Progression : jeu ${numero} sur ${total}`}>
          {Array.from({ length: total }, (_, position) => {
            const etat =
              position < numero - 1 ? 'fait' : position === numero - 1 ? 'encours' : 'avenir'
            return (
              <li key={position} className={`jalon jalon--${etat}`}>
                <span className="jalon__pastille">{position + 1}</span>
                <span className="visually-hidden">
                  {etat === 'fait' ? 'terminé' : etat === 'encours' ? 'en cours' : 'à venir'}
                </span>
              </li>
            )
          })}
        </ol>

        <div className="seance-barre__actions">
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
          <button type="button" className="btn" onClick={() => finir(true)}>
            {numero === total ? 'Terminer la séance' : 'Jeu suivant'}
            <Icon name="check" size={18} filled={false} />
          </button>
        </div>
      </div>

      <section className="panel game-panel">
        <Suspense fallback={<p className="muted">Chargement du jeu…</p>}>
          <GameComponent key={runKey} config={etape.config} session={session} />
        </Suspense>
      </section>

      <p className="game-instruction seance-note">
        Le passage au jeu suivant se fait quand vous le décidez : le score obtenu jusque-là est
        conservé dans le récapitulatif.
      </p>
    </div>
  )
}

function Recapitulatif({ etapes, resultats, onRecommencer, onModifier }) {
  const joues = resultats.filter((resultat) => !resultat.passe)
  const totalJuste = joues.reduce((somme, resultat) => somme + resultat.correct, 0)
  const totalEssais = joues.reduce((somme, resultat) => somme + resultat.attempts, 0)
  const global = totalEssais > 0 ? Math.round((totalJuste / totalEssais) * 100) : null

  return (
    <div className="stack recap">
      <header className="hero">
        <h1 className="hero__title">Récapitulatif de la séance</h1>
        <p className="hero__text">
          {etapes.length} jeu{etapes.length > 1 ? 'x' : ''} enchaîné
          {etapes.length > 1 ? 's' : ''}
          {global !== null ? ` · ${totalJuste} réussites sur ${totalEssais} essais (${global} %)` : ''}
        </p>
      </header>

      <div className="table-wrap">
        <table className="recap-table">
          <thead>
            <tr>
              <th scope="col">Jeu</th>
              <th scope="col">Domaine</th>
              <th scope="col">Réussites</th>
              <th scope="col">Taux</th>
            </tr>
          </thead>
          <tbody>
            {resultats.map((resultat, position) => {
              const game = getGame(resultat.gameId)
              const category = game ? getCategory(game.category) : null
              const taux = pourcentage(resultat)
              return (
                <tr key={`${resultat.gameId}-${position}`}>
                  <th scope="row">{game?.title ?? resultat.gameId}</th>
                  <td>
                    {category && (
                      <span className="badge badge--category" style={categoryStyle(category)}>
                        {category.short}
                      </span>
                    )}
                  </td>
                  <td className="recap-table__nombre">
                    {resultat.passe ? '·' : `${resultat.correct} / ${resultat.attempts}`}
                  </td>
                  <td className="recap-table__nombre">
                    {taux === null ? (
                      <span className="muted">non joué</span>
                    ) : (
                      <span className="recap-taux">
                        <span className="recap-taux__jauge">
                          <span className="recap-taux__valeur" style={{ width: `${taux}%` }} />
                        </span>
                        {taux} %
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
        <button type="button" className="btn btn--lg" onClick={onRecommencer}>
          Refaire la séance
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => window.print()}>
          Imprimer le récapitulatif
        </button>
        <button type="button" className="btn btn--ghost" onClick={onModifier}>
          Modifier la séance
        </button>
        <Link to="/" className="btn btn--ghost">
          Retour à la galerie
        </Link>
      </div>
    </div>
  )
}
