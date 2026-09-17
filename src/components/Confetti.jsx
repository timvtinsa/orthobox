/**
 * Confetti shower, overlaid on the companion bar.
 *
 * Kept for a finished game, never for a single item: a reward that fires on
 * every answer stops meaning anything by the third one. Purely decorative, and
 * the layer catches no click.
 *
 * Pieces mix rectangles and discs and fall at different speeds, because
 * confetti that all falls alike reads as a progress bar rather than a party.
 */
const COLORS = ['#f6bdab', '#b9d8c2', '#cdc3ec', '#f4dfa8', '#a8c8ec', '#a44a28']

/** Positions and delays are fixed on mount, for a stable render. */
function seed(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: Math.round(Math.random() * 100),
    delay: Math.round(Math.random() * 700),
    duration: 1500 + Math.round(Math.random() * 600),
    color: COLORS[index % COLORS.length],
    rotation: Math.round(Math.random() * 360),
    width: 7 + Math.round(Math.random() * 7),
    round: index % 3 === 0,
  }))
}

export default function Confetti({ count = 36 }) {
  const pieces = seed(count)

  return (
    <span className="confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className={`confetti__piece${piece.round ? ' confetti__piece--round' : ''}`}
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.round ? piece.width : piece.width * 1.6,
            background: piece.color,
            animationDelay: `${piece.delay}ms`,
            animationDuration: `${piece.duration}ms`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </span>
  )
}
