/**
 * Confetti shower, overlaid on a panel.
 *
 * Purely decorative: the layer catches no click, and is only rendered in
 * child mode, on moments of success.
 */
const COLORS = ['#f6bdab', '#b9d8c2', '#cdc3ec', '#f4dfa8', '#a8c8ec']

/** Positions and delays are fixed on mount, for a stable render. */
function seed(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: Math.round(Math.random() * 100),
    delay: Math.round(Math.random() * 600),
    duration: 1400 + Math.round(Math.random() * 900),
    color: COLORS[index % COLORS.length],
    rotation: Math.round(Math.random() * 360),
    width: 6 + Math.round(Math.random() * 6),
  }))
}

export default function Confetti({ count = 24 }) {
  const pieces = seed(count)

  return (
    <span className="confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti__piece"
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.width * 1.6,
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
