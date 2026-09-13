/**
 * Le calcul éclair : une opération, quatre résultats possibles.
 *
 * Les propositions fausses ne sont pas tirées au hasard : elles reprennent les
 * erreurs de calcul fréquentes, pour que le choix demande une vraie
 * vérification plutôt qu'une élimination visuelle.
 */
import { useEffect, useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { pick, randomInt, shuffle } from '../../lib/random.js'

/** Bornes des opérandes selon la plage choisie. */
const PLAGES = {
  dix: { max: 10, tables: [2, 3, 4, 5] },
  vingt: { max: 20, tables: [2, 3, 4, 5, 6, 10] },
  cent: { max: 100, tables: [2, 3, 4, 5, 6, 7, 8, 9, 10] },
}

/**
 * Leurres plausibles : les erreurs fréquentes sont le voisin immédiat, la
 * retenue oubliée (écart de 10) et l'opération inverse.
 */
function leurres(resultat, ecarts) {
  const candidats = new Set()
  for (const ecart of shuffle(ecarts)) {
    const valeur = resultat + ecart
    if (valeur >= 0 && valeur !== resultat) candidats.add(valeur)
    if (candidats.size >= 3) break
  }
  let voisin = resultat + 1
  while (candidats.size < 3) {
    if (voisin !== resultat && voisin >= 0) candidats.add(voisin)
    voisin += 1
  }
  return [...candidats].slice(0, 3)
}

function construireOperation(config) {
  const plage = PLAGES[config.plage] ?? PLAGES.dix
  const operation =
    config.operation === 'melange'
      ? pick(['addition', 'soustraction'])
      : config.operation

  if (operation === 'multiplication') {
    const a = pick(plage.tables)
    const b = randomInt(2, 10)
    return { enonce: `${a} × ${b}`, resultat: a * b, ecarts: [a, -a, b, -b, 1, -1, 10, -10] }
  }
  if (operation === 'soustraction') {
    const a = randomInt(Math.ceil(plage.max / 2), plage.max)
    const b = randomInt(1, a)
    return { enonce: `${a} − ${b}`, resultat: a - b, ecarts: [1, -1, 2, -2, 10, -10] }
  }
  const a = randomInt(1, plage.max)
  const b = randomInt(1, Math.max(1, plage.max - a))
  return { enonce: `${a} + ${b}`, resultat: a + b, ecarts: [1, -1, 2, -2, 10, -10] }
}

function construireManche(config) {
  const operation = construireOperation(config)
  return {
    ...operation,
    propositions: shuffle([operation.resultat, ...leurres(operation.resultat, operation.ecarts)]),
  }
}

export default function CalculEclair({ config, session }) {
  const rounds = useRounds(config.manches)
  const [manche, setManche] = useState(() => construireManche(config))
  const [choix, setChoix] = useState(null)
  const lock = useAnswerLock()
  const debut = useRef(performance.now())
  const temps = useRef([])

  useEffect(() => {
    debut.current = performance.now()
  }, [manche])

  const repondre = (valeur) => {
    if (!lock.take()) return
    temps.current.push(performance.now() - debut.current)
    setChoix(valeur)
    session.register(valeur === manche.resultat)
  }

  const suivant = () => {
    lock.release()
    rounds.next()
    setManche(construireManche(config))
    setChoix(null)
  }

  const rejouer = () => {
    lock.release()
    session.reset()
    rounds.restart()
    temps.current = []
    setManche(construireManche(config))
    setChoix(null)
  }

  if (rounds.isOver) {
    const moyenne =
      temps.current.length > 0
        ? temps.current.reduce((somme, valeur) => somme + valeur, 0) / temps.current.length / 1000
        : 0
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={rejouer}>
        <p className="muted">Temps de réponse moyen : {moyenne.toFixed(1)} s</p>
      </GameOver>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Calcul {rounds.round + 1} sur {rounds.total}
      </p>

      <p className="calcul-enonce">
        {manche.enonce} <span className="calcul-enonce__egal">=</span>
      </p>

      <div className="choice-grid">
        {manche.propositions.map((valeur) => {
          let modifier = ''
          if (choix !== null) {
            if (valeur === manche.resultat) modifier = ' choice--correct'
            else if (valeur === choix) modifier = ' choice--wrong'
            else modifier = ' choice--dim'
          }
          return (
            <button
              key={valeur}
              type="button"
              className={`choice choice--nombre${modifier}`}
              disabled={choix !== null}
              onClick={() => repondre(valeur)}
            >
              {valeur}
            </button>
          )
        })}
      </div>

      {choix !== null && (
        <>
          <Feedback
            status={choix === manche.resultat ? 'correct' : 'wrong'}
            message={
              choix === manche.resultat
                ? undefined
                : `${manche.enonce} = ${manche.resultat}`
            }
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={suivant}>
              Calcul suivant
            </button>
          </div>
        </>
      )}
    </div>
  )
}
