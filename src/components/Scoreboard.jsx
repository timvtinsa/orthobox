/**
 * Score de la partie en cours, affiché dans l'en-tête du jeu.
 *
 * Reste masqué tant qu'aucune réponse n'a été donnée, pour ne pas afficher
 * un « 0 / 0 » au patient avant même de commencer.
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
