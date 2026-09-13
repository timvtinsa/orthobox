/**
 * Compter la monnaie : composer un montant exact.
 *
 * Les montants sont manipulés en centimes, jamais en euros décimaux, pour
 * éviter toute erreur d'arrondi en virgule flottante.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import { randomInt } from '../../lib/random.js'
import { PIECES, Piece, formaterMontant } from './pieces.jsx'

/** Montant maximal proposé, en centimes, selon le réglage. */
const PLAFONDS = { cinq: 500, vingt: 2000, cinquante: 5000 }

function tirerPrix(config) {
  const plafond = PLAFONDS[config.plafond] ?? PLAFONDS.cinq
  if (config.centimes === 'sans') return randomInt(1, plafond / 100) * 100
  // Avec centimes : on évite les montants trop retors (multiples de 5 c).
  return randomInt(1, plafond / 5) * 5
}

function piecesDisponibles(config) {
  const plafond = PLAFONDS[config.plafond] ?? PLAFONDS.cinq
  return PIECES.filter(
    (piece) =>
      piece.valeur <= Math.max(200, plafond) &&
      (config.centimes === 'avec' || piece.valeur >= 100),
  )
}

export default function LaMonnaie({ config, session }) {
  const rounds = useRounds(config.manches)
  const [prix, setPrix] = useState(() => tirerPrix(config))
  const [choisies, setChoisies] = useState([])
  const [resultat, setResultat] = useState(null)

  const disponibles = piecesDisponibles(config)
  const total = choisies.reduce((somme, piece) => somme + piece.valeur, 0)

  const ajouter = (piece) => {
    if (resultat) return
    setChoisies([...choisies, { ...piece, cle: `${piece.valeur}-${Date.now()}-${choisies.length}` }])
  }

  const retirer = (cle) => {
    if (resultat) return
    setChoisies(choisies.filter((piece) => piece.cle !== cle))
  }

  const valider = () => {
    if (resultat) return
    const exact = total === prix
    session.register(exact)
    setResultat(exact ? 'correct' : 'wrong')
  }

  const suivant = () => {
    rounds.next()
    setPrix(tirerPrix(config))
    setChoisies([])
    setResultat(null)
  }

  const rejouer = () => {
    session.reset()
    rounds.restart()
    setPrix(tirerPrix(config))
    setChoisies([])
    setResultat(null)
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={rejouer} />
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Achat {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">Compose exactement {formaterMontant(prix)}</p>

      <div className={`porte-monnaie${resultat ? ` porte-monnaie--${resultat}` : ''}`}>
        {choisies.length === 0 ? (
          <span className="word-slot__hint">Touche les pièces à ajouter</span>
        ) : (
          choisies.map((piece) => (
            <button
              key={piece.cle}
              type="button"
              className="piece-btn"
              aria-label={`Retirer ${piece.label}`}
              onClick={() => retirer(piece.cle)}
            >
              <Piece piece={piece} size={52} />
            </button>
          ))
        )}
      </div>

      <p className="monnaie-total">
        Total : <strong>{formaterMontant(total)}</strong>
        {resultat === 'wrong' && (
          <span className="monnaie-total__ecart">
            {total > prix
              ? ` (${formaterMontant(total - prix)} de trop)`
              : ` (il manque ${formaterMontant(prix - total)})`}
          </span>
        )}
      </p>

      <div className="tiroir">
        {disponibles.map((piece) => (
          <button
            key={piece.valeur}
            type="button"
            className="piece-btn"
            disabled={Boolean(resultat)}
            aria-label={`Ajouter ${piece.label}`}
            onClick={() => ajouter(piece)}
          >
            <Piece piece={piece} />
          </button>
        ))}
      </div>

      {resultat ? (
        <>
          <Feedback
            status={resultat}
            message={
              resultat === 'correct'
                ? `Exactement ${formaterMontant(prix)} !`
                : `Il fallait ${formaterMontant(prix)}.`
            }
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={suivant}>
              Achat suivant
            </button>
          </div>
        </>
      ) : (
        <div className="game-actions">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={choisies.length === 0}
            onClick={() => setChoisies([])}
          >
            Vider
          </button>
          <button
            type="button"
            className="btn btn--lg"
            disabled={choisies.length === 0}
            onClick={valider}
          >
            Valider
          </button>
        </div>
      )}
    </div>
  )
}
