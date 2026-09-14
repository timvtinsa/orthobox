/**
 * Score of the current game, shown in the game header.
 *
 * Stays hidden until an answer has been given, so the patient is not shown a
 * "0 / 0" before even starting.
 */
export default function Scoreboard({ session }) {
  if (session.attempts === 0) return null

  return (
    <div className="scoreboard" aria-live="polite">
      <span className="scoreboard__score">
        {session.correct} / {session.attempts}
      </span>
      <span className="scoreboard__label">réussites</span>
      {session.bestStreak > 1 && (
        <span className="badge" title="Meilleure série de bonnes réponses">
          série {session.bestStreak}
        </span>
      )}
    </div>
  )
}
