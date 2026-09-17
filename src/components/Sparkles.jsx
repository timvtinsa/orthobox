/**
 * The few stars that pop next to the fox on a right answer.
 *
 * The small celebration, the one that fits inside an item: it says well done
 * without emptying the confetti of its meaning, which stays for the end of a
 * game. Purely decorative, and it catches no click.
 */
// Aux quatre coins de la boîte du renard, là où la silhouette est vide :
// une étoile posée sur un oeil cache justement ce qu'on veut faire regarder.
const STARS = [
  { left: -9, top: -8, delay: 0, size: 20 },
  { left: 84, top: -6, delay: 130, size: 24 },
  { left: 88, top: 68, delay: 260, size: 18 },
  { left: -11, top: 64, delay: 80, size: 22 },
]

export default function Sparkles() {
  return (
    <span className="sparkles" aria-hidden="true">
      {STARS.map((star) => (
        <svg
          key={star.left}
          className="sparkle"
          viewBox="0 0 24 24"
          width={star.size}
          height={star.size}
          style={{ left: `${star.left}%`, top: `${star.top}%`, animationDelay: `${star.delay}ms` }}
        >
          <path
            d="M12 2l2.7 6.2 6.7.6-5 4.4 1.5 6.6L12 16.4 6.1 19.8l1.5-6.6-5-4.4 6.7-.6z"
            fill="#f4dfa8"
            stroke="#8a6a18"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  )
}
