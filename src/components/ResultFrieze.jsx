/**
 * The run of results so far, one mark per answer.
 *
 * It says how the game is going without ever putting a score next to the
 * material: the practitioner reads the run, the patient sees marks.
 */
export default function ResultFrieze({ results, total }) {
  const length = Math.max(results.length, total ?? 0)
  if (length === 0) return null

  const marks = Array.from({ length }, (_, index) => results[index] ?? null)
  const correct = results.filter((result) => result === 'ok').length

  return (
    <span className="frieze" role="img" aria-label={`${correct} réussites sur ${results.length}`}>
      {marks.map((mark, index) => (
        <span key={index} className={`frieze__mark${mark ? ` frieze__mark--${mark}` : ''}`} />
      ))}
    </span>
  )
}
