/**
 * Ligne de retour « bravo / presque » commune aux jeux.
 * `status` vaut 'correct', 'wrong' ou null (rien n'est affiché).
 */
export default function Feedback({ status, message }) {
  const modifier = status ? ` feedback--${status}` : ''
  const defaut = status === 'correct' ? 'Bravo !' : status === 'wrong' ? 'Presque…' : ''
  return (
    <p className={`feedback${modifier}`} role="status" aria-live="polite">
      {message ?? defaut}
    </p>
  )
}
