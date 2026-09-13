import { useEffect, useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { PICTOS, Picto } from '../../lib/pictos.jsx'
import { sample, shuffle } from '../../lib/random.js'

const PAIRES = { facile: 3, moyen: 6, difficile: 10 }
const COLONNES = { facile: 3, moyen: 4, difficile: 5 }

function distribuer(difficulte) {
  const nombre = PAIRES[difficulte] ?? PAIRES.facile
  const choisis = sample(PICTOS, nombre)
  return shuffle(
    choisis.flatMap((picto, index) => [
      { cle: `${picto.id}-a`, picto, paire: index },
      { cle: `${picto.id}-b`, picto, paire: index },
    ]),
  )
}

export default function MemoryPaires({ config, session }) {
  const [cartes, setCartes] = useState(() => distribuer(config.difficulte))
  const [retournees, setRetournees] = useState([])
  const [trouvees, setTrouvees] = useState([])
  const [coups, setCoups] = useState(0)
  const attente = useRef(null)

  const colonnes = COLONNES[config.difficulte] ?? 3
  const total = PAIRES[config.difficulte] ?? PAIRES.facile
  const termine = trouvees.length === total

  // Retourne les deux cartes non appariées après le temps d'observation.
  useEffect(() => {
    if (retournees.length < 2) return undefined
    const [a, b] = retournees
    const gagne = a.paire === b.paire
    session.register(gagne)
    setCoups((nombre) => nombre + 1)
    if (gagne) {
      setTrouvees((current) => [...current, a.paire])
      setRetournees([])
      return undefined
    }
    attente.current = window.setTimeout(() => setRetournees([]), config.observation * 100)
    return () => window.clearTimeout(attente.current)
    // session est stable, config.observation ne change pas en cours de partie.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retournees])

  const retourner = (carte) => {
    if (retournees.length >= 2) return
    if (retournees.some((item) => item.cle === carte.cle)) return
    if (trouvees.includes(carte.paire)) return
    setRetournees([...retournees, carte])
  }

  const rejouer = () => {
    window.clearTimeout(attente.current)
    session.reset()
    setCartes(distribuer(config.difficulte))
    setRetournees([])
    setTrouvees([])
    setCoups(0)
  }

  if (termine) {
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={rejouer}>
        <p className="muted">
          {total} paires retrouvées en {coups} essais — le minimum possible est {total}.
        </p>
      </GameOver>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        {trouvees.length} paire{trouvees.length > 1 ? 's' : ''} sur {total} · {coups} essai
        {coups > 1 ? 's' : ''}
      </p>
      <p className="game-prompt">Retrouve les paires</p>

      <div
        className="memory-grid"
        style={{ gridTemplateColumns: `repeat(${colonnes}, minmax(74px, 130px))` }}
      >
        {cartes.map((carte) => {
          const visible =
            trouvees.includes(carte.paire) || retournees.some((item) => item.cle === carte.cle)
          return (
            <button
              key={carte.cle}
              type="button"
              className={`memory-card${visible ? ' memory-card--face' : ''}${
                trouvees.includes(carte.paire) ? ' memory-card--trouvee' : ''
              }`}
              aria-label={visible ? carte.picto.label : 'Carte face cachée'}
              onClick={() => retourner(carte)}
            >
              {visible ? (
                <Picto id={carte.picto.id} size="72%" />
              ) : (
                <span className="memory-card__dos" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>

      <Feedback
        status={retournees.length === 2 ? (retournees[0].paire === retournees[1].paire ? 'correct' : 'wrong') : null}
        message={retournees.length === 2 ? undefined : ' '}
      />
    </div>
  )
}
