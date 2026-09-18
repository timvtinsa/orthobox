/**
 * The bar above a board, in patient territory.
 *
 * It keeps the strict minimum: a way out, the name of the game, the rank of
 * the item and the run of results. No domain badge, no cover, and above all
 * no total score next to the material.
 */
import Icon from './Icon.jsx'
import ResultFrieze from './ResultFrieze.jsx'

export default function BoardBar({ title, session, onQuit, quitLabel = 'Quitter la partie' }) {
  const total = session.total
  const rank = Math.min(session.index + 1, total ?? Number.MAX_SAFE_INTEGER)

  return (
    <div className="board-bar">
      <button type="button" className="icon-round" aria-label={quitLabel} onClick={onQuit}>
        <Icon name="cross" size={22} filled={false} />
      </button>

      <span className="board-bar__title">{title}</span>

      <span className="board-bar__progress">
        {total ? (
          <span className="board-bar__rank">
            Item {rank} sur {total}
          </span>
        ) : (
          session.attempts > 0 && <span className="board-bar__rank">Item {session.attempts}</span>
        )}
        <ResultFrieze results={session.results} total={total} />
      </span>
    </div>
  )
}
