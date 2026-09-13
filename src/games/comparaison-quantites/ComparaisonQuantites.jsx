/**
 * Le plus grand tas : comparer deux collections de points.
 *
 * La taille des points varie à l'intérieur d'une collection, pour que la
 * surface occupée ne trahisse pas la quantité.
 */
import { useEffect, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { placerSurGrille } from '../../lib/disposition.js'
import { randomInt } from '../../lib/random.js'

const MATERIEL = {
  subitizing: { min: 1, max: 6, ecartMin: 2, duree: null, mixte: false },
  moyennes: { min: 4, max: 14, ecartMin: 2, duree: null, mixte: false },
  estimation: { min: 10, max: 28, ecartMin: 2, duree: 1200, mixte: false },
  transcodage: { min: 2, max: 12, ecartMin: 1, duree: null, mixte: true },
}

/** Une collection : des points dispersés, de tailles volontairement inégales. */
function collection(nombre) {
  return placerSurGrille(nombre, { ratio: 2.2, jitter: 0.55 }).positions.map(
    (position, index) => ({
      id: index,
      ...position,
      // Tailles variables : la surface totale ne doit pas trahir la réponse.
      taille: randomInt(16, 30),
    }),
  )
}

function buildRound(config) {
  const materiel = MATERIEL[config.materiel] ?? MATERIEL.subitizing
  const gauche = randomInt(materiel.min, materiel.max)
  let droite = randomInt(materiel.min, materiel.max)
  while (Math.abs(droite - gauche) < materiel.ecartMin) {
    droite = randomInt(materiel.min, materiel.max)
  }
  return {
    duree: materiel.duree,
    // En mode transcodage, un des deux côtés est écrit en chiffres.
    chiffre: materiel.mixte ? (Math.random() < 0.5 ? 'gauche' : 'droite') : null,
    gauche: { total: gauche, points: collection(gauche) },
    droite: { total: droite, points: collection(droite) },
  }
}

export default function ComparaisonQuantites({ config, session }) {
  const rounds = useRounds(config.manches)
  const [round, setRound] = useState(() => buildRound(config))
  const [picked, setPicked] = useState(null)
  const [cache, setCache] = useState(false)
  const lock = useAnswerLock()

  // Niveau « estimation » : les collections disparaissent après un court instant.
  useEffect(() => {
    setCache(false)
    if (!round.duree) return undefined
    const id = window.setTimeout(() => setCache(true), round.duree)
    return () => window.clearTimeout(id)
  }, [round])

  const gagnant = round.gauche.total > round.droite.total ? 'gauche' : 'droite'

  const answer = (cote) => {
    if (!lock.take()) return
    setPicked(cote)
    session.register(cote === gagnant)
  }

  const goNext = () => {
    lock.release()
    rounds.next()
    setRound(buildRound(config))
    setPicked(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setRound(buildRound(config))
    setPicked(null)
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  const renderCote = (cote) => {
    const collection = round[cote]
    const enChiffre = round.chiffre === cote
    let modifier = ''
    if (picked) {
      if (cote === gagnant) modifier = ' quantity--correct'
      else if (cote === picked) modifier = ' quantity--wrong'
    }

    return (
      <button
        type="button"
        className={`quantity${modifier}`}
        disabled={Boolean(picked)}
        onClick={() => answer(cote)}
        aria-label={`Choisir la collection de ${cote === 'gauche' ? 'gauche' : 'droite'}`}
      >
        {enChiffre ? (
          <span className="quantity__number">{collection.total}</span>
        ) : cache ? (
          <span className="quantity__hidden" aria-hidden="true">
            ?
          </span>
        ) : (
          collection.points.map((point) => (
            <span
              key={point.id}
              className="dot quantity__dot"
              style={{
                left: `${point.left}%`,
                top: `${point.top}%`,
                width: point.taille,
                height: point.taille,
              }}
            />
          ))
        )}
        {picked && <span className="quantity__total">{collection.total}</span>}
      </button>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Comparaison {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">Où y en a-t-il le plus ?</p>

      <div className="quantity-pair">
        {renderCote('gauche')}
        <span className="quantity-vs" aria-hidden="true">
          ou
        </span>
        {renderCote('droite')}
      </div>

      {picked && (
        <>
          <Feedback
            status={picked === gagnant ? 'correct' : 'wrong'}
            message={`${round.gauche.total} et ${round.droite.total} : le plus grand est ${Math.max(
              round.gauche.total,
              round.droite.total,
            )}.`}
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Comparaison suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
