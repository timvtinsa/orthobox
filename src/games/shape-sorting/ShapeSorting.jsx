/**
 * Shape sorting: file objects according to one criterion.
 *
 * The « changing rule » setting flips the criterion halfway through, which
 * tests flexibility rather than plain categorisation.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { shuffle } from '../../lib/random.js'
import { COLORS, SHAPES, ColoredShape } from './shapes.jsx'

/**
 * Latin square layout: from four objects on, all four shapes and all four
 * colours are present, so every bin is used whatever the sorting criterion.
 */
function deal(count) {
  const items = []
  for (let i = 0; i < count; i += 1) {
    items.push({
      key: `item-${i}`,
      shape: SHAPES[i % SHAPES.length].id,
      color: COLORS[(i + Math.floor(i / SHAPES.length)) % COLORS.length].id,
    })
  }
  return shuffle(items)
}

export default function ShapeSorting({ config, session }) {
  const [items, setItems] = useState(() => deal(config.count))
  const [sorted, setSorted] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState(null)

  // In « changing rule » mode, sort by colour first, then by shape.
  const switchPoint = Math.ceil(config.count / 2)
  const criterion =
    config.criterion === 'switching'
      ? sorted.length < switchPoint
        ? 'color'
        : 'shape'
      : config.criterion
  const justSwitched = config.criterion === 'switching' && sorted.length === switchPoint

  const bins = criterion === 'color' ? COLORS : SHAPES

  const drop = (bin) => {
    if (!selected) return
    const correct = (criterion === 'color' ? selected.color : selected.shape) === bin.id
    session.register(correct)
    if (correct) {
      setSorted([...sorted, { ...selected, bin: bin.id, criterion }])
      setItems(items.filter((item) => item.key !== selected.key))
      setSelected(null)
      setError(null)
    } else {
      setError(bin.id)
      setSelected(null)
    }
  }

  const replay = () => {
    session.reset()
    setItems(deal(config.count))
    setSorted([])
    setSelected(null)
    setError(null)
  }

  if (items.length === 0) {
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">
          {config.count} objets classés en {session.attempts} dépôts.
        </p>
      </GameOver>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        {sorted.length} objet{sorted.length > 1 ? 's' : ''} classé
        {sorted.length > 1 ? 's' : ''} sur {config.count}
      </p>
      <p className="game-prompt">
        {criterion === 'color' ? 'Range les objets par couleur' : 'Range les objets par forme'}
      </p>

      {justSwitched && (
        <p className="rule-change">
          Attention, la règle change : on ne trie plus par couleur, mais par forme.
        </p>
      )}

      <p className="game-instruction">
        Choisis un objet, puis touche le bac où il doit aller.
      </p>

      <div className="sorting-tray">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`sorting-item${selected?.key === item.key ? ' sorting-item--selected' : ''}`}
            aria-pressed={selected?.key === item.key}
            aria-label={`${SHAPES.find((s) => s.id === item.shape).label} ${
              COLORS.find((c) => c.id === item.color).label
            }`}
            onClick={() => {
              setSelected(item)
              setError(null)
            }}
          >
            <ColoredShape shape={item.shape} color={item.color} />
          </button>
        ))}
      </div>

      <div className="sorting-bins">
        {bins.map((bin) => {
          const content = sorted.filter((item) => item.bin === bin.id && item.criterion === criterion)
          return (
            <button
              key={bin.id}
              type="button"
              className={`sorting-bin${error === bin.id ? ' sorting-bin--error' : ''}${
                selected ? ' sorting-bin--active' : ''
              }`}
              disabled={!selected}
              onClick={() => drop(bin)}
            >
              <span className="sorting-bin__title">{bin.plural}</span>
              <span className="sorting-bin__preview">
                {criterion === 'color' ? (
                  <ColoredShape shape="circle" color={bin.id} size={30} />
                ) : (
                  <ColoredShape shape={bin.id} color="blue" size={30} />
                )}
              </span>
              <span className="sorting-bin__count">{content.length}</span>
            </button>
          )
        })}
      </div>

      <Feedback
        status={error ? 'wrong' : null}
        message={error ? 'Pas dans ce bac : regarde bien la consigne.' : ' '}
      />
    </div>
  )
}
