import Confetti from './Confetti.jsx'
import Mascot from './Mascot.jsx'
import { useMode } from './ModeProvider.jsx'

/**
 * Shared end-of-game screen: score, comment, replay.
 *
 * In child mode the mascot comes to greet the result, and confetti is kept
 * for successful games so that it keeps its meaning.
 */
export default function GameOver({ correct, total, onReplay, children }) {
  const { isChild } = useMode()
  const ratio = total === 0 ? 0 : correct / total
  const comment =
    ratio === 1
      ? 'Sans faute, bravo !'
      : ratio >= 0.75
        ? 'Très bonne série.'
        : ratio >= 0.5
          ? 'C’est en bonne voie, on continue ?'
          : 'On recommence tranquillement ?'

  const succeeded = total > 0 && ratio >= 0.5

  return (
    <div className="game-final">
      {isChild && succeeded && <Confetti />}
      {isChild && (
        <Mascot mood={succeeded ? 'cheer' : 'tryAgain'} size={132} className="mascot--final" />
      )}
      <p className="game-round">Partie terminée</p>
      <p className="game-final__score">
        {correct} / {total}
      </p>
      <p className="muted">{comment}</p>
      {children}
      <button type="button" className="btn btn--lg" onClick={onReplay}>
        Rejouer
      </button>
    </div>
  )
}
