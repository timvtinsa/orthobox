import { useEffect, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { randomInt, sample } from '../../lib/random.js'

const TOTAL_ROUNDS = 12
const GRILLE = 6 // 36 emplacements possibles par collection

const LEVEL_CONFIG = {
  subitizing: { min: 1, max: 6, ecartMin: 2, duree: null, mixte: false },
  moyennes: { min: 4, max: 14, ecartMin: 2, duree: null, mixte: false },
  estimation: { min: 10, max: 28, ecartMin: 2, duree: 1200, mixte: false },
  transcodage: { min: 2, max: 12, ecartMin: 1, duree: null, mixte: true },
}

/** Positions aléatoires sans chevauchement : une grille dont on tire des cases. */
function positions(nombre) {
  const cases = sample(
    Array.from({ length: GRILLE * GRILLE }, (_, index) => index),
    nombre,
  )
  return cases.map((index) => {
    const colonne = index % GRILLE
    const ligne = Math.floor(index / GRILLE)
    const jitter = () => (Math.random() - 0.5) * 6
    return {
      id: index,
      left: (colonne * 100) / GRILLE + 100 / GRILLE / 2 + jitter(),
      top: (ligne * 100) / GRILLE + 100 / GRILLE / 2 + jitter(),
      // Tailles variables : la surface totale ne doit pas trahir la réponse.
      taille: randomInt(16, 30),
    }
  })
}

function buildRound(level) {
  const config = LEVEL_CONFIG[level] ?? LEVEL_CONFIG.subitizing
  const gauche = randomInt(config.min, config.max)
  let droite = randomInt(config.min, config.max)
  while (Math.abs(droite - gauche) < config.ecartMin) {
    droite = randomInt(config.min, config.max)
  }
  return {
    duree: config.duree,
    // En mode transcodage, un des deux côtés est écrit en chiffres.
    chiffre: config.mixte ? (Math.random() < 0.5 ? 'gauche' : 'droite') : null,
    gauche: { total: gauche, points: positions(gauche) },
    droite: { total: droite, points: positions(droite) },
  }
}

export default function ComparaisonQuantites({ level, session }) {
  const rounds = useRounds(TOTAL_ROUNDS)
  const [round, setRound] = useState(() => buildRound(level))
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
    setRound(buildRound(level))
    setPicked(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setRound(buildRound(level))
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
        Comparaison {rounds.round + 1} sur {TOTAL_ROUNDS}
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
