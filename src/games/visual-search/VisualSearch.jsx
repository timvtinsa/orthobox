/**
 * Visual search: spot a target object inside a crowded scene.
 *
 * The target appears only once, and a round counts as correct only when it is
 * picked without any miss.
 */
import { useEffect, useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import { PICTOGRAMS, Pictogram } from '../../lib/pictograms.jsx'
import { scatterOnGrid } from '../../lib/layout.js'
import { pick, randomInt, shuffle } from '../../lib/random.js'

const VARIATIONS = {
  aligned: { rotation: 0, minSize: 100, maxSize: 100 },
  varied: { rotation: 0, minSize: 80, maxSize: 116 },
  rotated: { rotation: 26, minSize: 70, maxSize: 120 },
}

/**
 * Builds a scene: the target shows up exactly once, hidden among distractors
 * spread over a slightly jittered grid.
 */
function buildScene(config) {
  const variation = VARIATIONS[config.variation] ?? VARIATIONS.aligned
  const target = pick(PICTOGRAMS)
  const others = PICTOGRAMS.filter((pictogram) => pictogram.id !== target.id)

  const distractors = Array.from({ length: config.items - 1 }, () => pick(others))
  const drawn = shuffle([target, ...distractors])

  const { cellWidth, positions } = scatterOnGrid(drawn.length)

  const items = drawn.map((pictogram, index) => ({
    key: `${pictogram.id}-${index}`,
    pictogram,
    isTarget: pictogram.id === target.id,
    ...positions[index],
    size: (cellWidth * randomInt(variation.minSize, variation.maxSize)) / 100,
    rotation: variation.rotation === 0 ? 0 : randomInt(-variation.rotation, variation.rotation),
  }))

  return { target, items }
}

export default function VisualSearch({ config, session }) {
  const rounds = useRounds(config.rounds)
  const [scene, setScene] = useState(() => buildScene(config))
  const [found, setFound] = useState(false)
  const [errors, setErrors] = useState(0)
  const [totalErrors, setTotalErrors] = useState(0)
  const start = useRef(performance.now())
  const times = useRef([])

  useEffect(() => {
    start.current = performance.now()
  }, [scene])

  const pickItem = (item) => {
    if (found) return
    if (item.isTarget) {
      times.current.push(performance.now() - start.current)
      // The round counts as correct only when the target is picked at once.
      session.register(errors === 0)
      setFound(true)
    } else {
      setErrors(errors + 1)
      setTotalErrors(totalErrors + 1)
    }
  }

  const goNext = () => {
    rounds.next()
    setScene(buildScene(config))
    setFound(false)
    setErrors(0)
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    times.current = []
    setScene(buildScene(config))
    setFound(false)
    setErrors(0)
    setTotalErrors(0)
  }

  if (rounds.isOver) {
    const average =
      times.current.length > 0
        ? times.current.reduce((sum, value) => sum + value, 0) / times.current.length / 1000
        : 0
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">
          Temps de recherche moyen : {average.toFixed(1)} s · {totalErrors} clic
          {totalErrors > 1 ? 's' : ''} à côté
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
        <Pictogram id={scene.target.id} size={56} title={scene.target.label} />
        <span className="target-preview__label">Trouve : {scene.target.label}</span>
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
              width: `${item.size}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            }}
            disabled={found}
            aria-label={item.pictogram.label}
            onClick={() => pickItem(item)}
          >
            <Pictogram id={item.pictogram.id} />
          </button>
        ))}

        {found && (
          <span
            className="scene__halo"
            style={{
              left: `${scene.items.find((item) => item.isTarget).left}%`,
              top: `${scene.items.find((item) => item.isTarget).top}%`,
              width: `${scene.items.find((item) => item.isTarget).size * 1.6}%`,
              aspectRatio: '1',
            }}
          />
        )}
      </div>

      {found ? (
        <>
          <Feedback
            status={errors === 0 ? 'correct' : 'wrong'}
            message={
              errors === 0
                ? 'Trouvé du premier coup !'
                : `Trouvé, après ${errors} clic${errors > 1 ? 's' : ''} à côté.`
            }
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Objet suivant
            </button>
          </div>
        </>
      ) : (
        <Feedback
          status={errors > 0 ? 'wrong' : null}
          message={errors > 0 ? 'Ce n’est pas le bon objet, continue de chercher.' : ' '}
        />
      )}
    </div>
  )
}
