/**
 * Cherche et trouve : repérer un objet cible dans un décor encombré.
 *
 * La cible n'apparaît qu'une fois, et la manche n'est réussie que si elle est
 * désignée sans clic à côté.
 */
import { useEffect, useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import { PICTOS, Picto } from '../../lib/pictos.jsx'
import { placerSurGrille } from '../../lib/disposition.js'
import { pick, randomInt, shuffle } from '../../lib/random.js'

const VARIATIONS = {
  alignes: { rotation: 0, tailleMin: 100, tailleMax: 100 },
  varies: { rotation: 0, tailleMin: 80, tailleMax: 116 },
  tournes: { rotation: 26, tailleMin: 70, tailleMax: 120 },
}

/**
 * Compose un décor : la cible apparaît une seule fois, noyée parmi des
 * objets distracteurs répartis sur une grille légèrement bousculée.
 */
function construireScene(config) {
  const variation = VARIATIONS[config.variations] ?? VARIATIONS.alignes
  const cible = pick(PICTOS)
  const autres = PICTOS.filter((picto) => picto.id !== cible.id)

  const distracteurs = Array.from({ length: config.objets - 1 }, () => pick(autres))
  const objets = shuffle([cible, ...distracteurs])

  const { largeurCellule, positions } = placerSurGrille(objets.length)

  const items = objets.map((picto, index) => ({
    key: `${picto.id}-${index}`,
    picto,
    estCible: picto.id === cible.id,
    ...positions[index],
    taille: (largeurCellule * randomInt(variation.tailleMin, variation.tailleMax)) / 100,
    rotation: variation.rotation === 0 ? 0 : randomInt(-variation.rotation, variation.rotation),
  }))

  return { cible, items }
}

export default function RechercheVisuelle({ config, session }) {
  const rounds = useRounds(config.manches)
  const [scene, setScene] = useState(() => construireScene(config))
  const [trouve, setTrouve] = useState(false)
  const [erreurs, setErreurs] = useState(0)
  const [erreursTotal, setErreursTotal] = useState(0)
  const debut = useRef(performance.now())
  const temps = useRef([])

  useEffect(() => {
    debut.current = performance.now()
  }, [scene])

  const cliquer = (item) => {
    if (trouve) return
    if (item.estCible) {
      temps.current.push(performance.now() - debut.current)
      // La manche est réussie si la cible a été désignée du premier coup.
      session.register(erreurs === 0)
      setTrouve(true)
    } else {
      setErreurs(erreurs + 1)
      setErreursTotal(erreursTotal + 1)
    }
  }

  const suivant = () => {
    rounds.next()
    setScene(construireScene(config))
    setTrouve(false)
    setErreurs(0)
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    temps.current = []
    setScene(construireScene(config))
    setTrouve(false)
    setErreurs(0)
    setErreursTotal(0)
  }

  if (rounds.isOver) {
    const moyenne =
      temps.current.length > 0
        ? temps.current.reduce((sum, value) => sum + value, 0) / temps.current.length / 1000
        : 0
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">
          Temps de recherche moyen : {moyenne.toFixed(1)} s · {erreursTotal} clic
          {erreursTotal > 1 ? 's' : ''} à côté
        </p>
      </GameOver>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Recherche {rounds.round + 1} sur {rounds.total} · {scene.items.length} objets
      </p>

      <div className="target-preview">
        <Picto id={scene.cible.id} size={56} title={scene.cible.label} />
        <span className="target-preview__label">Trouve : {scene.cible.label}</span>
      </div>

      <div className="scene">
        {scene.items.map((item) => (
          <button
            key={item.key}
            type="button"
            className="scene__item"
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              width: `${item.taille}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            }}
            disabled={trouve}
            aria-label={item.picto.label}
            onClick={() => cliquer(item)}
          >
            <Picto id={item.picto.id} />
          </button>
        ))}

        {trouve && (
          <span
            className="scene__halo"
            style={{
              left: `${scene.items.find((item) => item.estCible).left}%`,
              top: `${scene.items.find((item) => item.estCible).top}%`,
              width: `${scene.items.find((item) => item.estCible).taille * 1.6}%`,
              aspectRatio: '1',
            }}
          />
        )}
      </div>

      {trouve ? (
        <>
          <Feedback
            status={erreurs === 0 ? 'correct' : 'wrong'}
            message={
              erreurs === 0
                ? 'Trouvé du premier coup !'
                : `Trouvé, après ${erreurs} clic${erreurs > 1 ? 's' : ''} à côté.`
            }
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={suivant}>
              Objet suivant
            </button>
          </div>
        </>
      ) : (
        <Feedback
          status={erreurs > 0 ? 'wrong' : null}
          message={erreurs > 0 ? 'Ce n’est pas le bon objet, continue de chercher.' : ' '}
        />
      )}
    </div>
  )
}
