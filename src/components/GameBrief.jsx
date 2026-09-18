/**
 * Instructions and objectives of a game, folded into the header.
 *
 * They left the gallery card, where they were read once in a lifetime, and
 * live here instead: reachable when picking a game up, out of the way the
 * rest of the time. Never a block under the board.
 */
export default function GameBrief({ game }) {
  return (
    <div className="brief">
      {game.instructions && (
        <div className="brief__block">
          <h2 className="brief__title">Consigne</h2>
          <p className="brief__text">{game.instructions}</p>
        </div>
      )}

      {game.objectives.length > 0 && (
        <div className="brief__block">
          <h2 className="brief__title">Objectifs</h2>
          <ul className="brief__list">
            {game.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>
      )}

      {game.materials.length > 0 && (
        <div className="brief__block">
          <h2 className="brief__title">Variantes et matériel</h2>
          <ul className="brief__list">
            {game.materials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="brief__block">
        <h2 className="brief__title">Public</h2>
        <p className="brief__text">{game.ages}</p>
      </div>
    </div>
  )
}
