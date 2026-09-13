/**
 * Range les nombres : cliquer une suite de nombres dans l'ordre.
 *
 * Une suite ne compte comme réussie que si elle est terminée sans aucune
 * erreur, ce qui distingue le rangement maîtrisé du tâtonnement.
 */
import { useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import { sample, shuffle } from '../../lib/random.js'

const PLAGES = {
  vingt: { min: 1, max: 20, pas: 1 },
  cent: { min: 1, max: 100, pas: 1 },
  mille: { min: 1, max: 1000, pas: 1 },
  decimaux: { min: 1, max: 100, pas: 0.1 },
}

const formate = (valeur, pas) =>
  pas < 1 ? valeur.toLocaleString('fr-FR', { minimumFractionDigits: 1 }) : String(valeur)

function buildRound(config) {
  const plageConfig = PLAGES[config.plage] ?? PLAGES.vingt
  const plage = Array.from(
    { length: plageConfig.max - plageConfig.min + 1 },
    (_, index) => plageConfig.min + index,
  )
  const valeurs = sample(plage, config.quantite).map((valeur) =>
    plageConfig.pas < 1 ? Math.round(valeur * plageConfig.pas * 10) / 10 : valeur,
  )
  const sens = config.sens === 'decroissant' ? 'décroissant' : 'croissant'
  const ordonnes = [...valeurs].sort((a, b) => (sens === 'croissant' ? a - b : b - a))
  return {
    sens,
    pas: plageConfig.pas,
    attendu: ordonnes,
    jetons: shuffle(valeurs),
  }
}

export default function ChaineNumerique({ config, session }) {
  const rounds = useRounds(config.manches)
  const [round, setRound] = useState(() => buildRound(config))
  const [places, setPlaces] = useState([])
  const [erreur, setErreur] = useState(null)
  const [sansFaute, setSansFaute] = useState(true)
  const [termine, setTermine] = useState(false)
  // Miroir synchrone de `places` : protège des clics plus rapides qu'un rendu.
  const placesRef = useRef([])
  const finiRef = useRef(false)
  const sansFauteRef = useRef(true)

  const clic = (valeur) => {
    if (finiRef.current) return
    const deja = placesRef.current
    if (valeur === round.attendu[deja.length]) {
      const suite = [...deja, valeur]
      placesRef.current = suite
      setPlaces(suite)
      setErreur(null)
      if (suite.length === round.attendu.length) {
        finiRef.current = true
        session.register(sansFauteRef.current)
        setTermine(true)
      }
    } else {
      setErreur(valeur)
      sansFauteRef.current = false
      setSansFaute(false)
    }
  }

  const reinitialiser = () => {
    placesRef.current = []
    finiRef.current = false
    sansFauteRef.current = true
    setPlaces([])
    setErreur(null)
    setSansFaute(true)
    setTermine(false)
  }

  const goNext = () => {
    rounds.next()
    setRound(buildRound(config))
    reinitialiser()
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    setRound(buildRound(config))
    reinitialiser()
  }

  if (rounds.isOver) {
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">Le score compte les suites terminées sans aucune erreur.</p>
      </GameOver>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Suite {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">
        Clique sur les nombres dans l’ordre {round.sens}
      </p>

      <div className="token-row">
        {round.jetons.map((valeur) => {
          const rang = places.indexOf(valeur)
          const estPlace = rang !== -1
          return (
            <button
              key={valeur}
              type="button"
              className={`token${estPlace ? ' token--placed' : ''}${
                erreur === valeur ? ' token--error' : ''
              }`}
              disabled={estPlace || termine}
              onClick={() => clic(valeur)}
            >
              {formate(valeur, round.pas)}
              {estPlace && <span className="token__rank">{rang + 1}</span>}
            </button>
          )
        })}
      </div>

      {erreur !== null && !termine && (
        <Feedback status="wrong" message="Pas encore celui-là : cherche le suivant." />
      )}

      {termine && (
        <>
          <Feedback
            status={sansFaute ? 'correct' : 'wrong'}
            message={
              sansFaute
                ? `Suite complète : ${round.attendu.map((v) => formate(v, round.pas)).join(' · ')}`
                : `Suite terminée, avec quelques essais : ${round.attendu
                    .map((v) => formate(v, round.pas))
                    .join(' · ')}`
            }
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Suite suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
