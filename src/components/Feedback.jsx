/**
 * Shared "well done / almost" feedback line.
 * `status` is 'correct', 'wrong' or null (nothing is displayed).
 */
export default function Feedback({ status, message }) {
  const modifier = status ? ` feedback--${status}` : ''
  const fallback = status === 'correct' ? 'Bravo !' : status === 'wrong' ? 'Presque…' : ''
  return (
    <p className={`feedback${modifier}`} role="status" aria-live="polite">
      {message ?? fallback}
    </p>
  )
}
