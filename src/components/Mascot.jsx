/**
 * Orthobox's little fox, the child-mode companion.
 *
 * Three moods, drawn from the same shapes so that it is clearly the same
 * animal changing expression:
 *   idle      : present and still, watching
 *   cheer     : narrowed eyes, open smile, one hop
 *   tryAgain  : raised brows, paw held out, mouth still smiling
 *
 * Expressions rely on line work only: nothing changes colour from one mood to
 * the next, so success is never signalled by colour alone, and the failed
 * mood encourages instead of telling off. No frown, no tear, no red.
 *
 * The drawing takes its colours from the palette, like every other drawing in
 * the application: the peach pastel and the ink of the oral language domain.
 */
const FUR = '#f6bdab'
const FUR_INK = '#a44a28'
const BELLY = '#ffffff'
const FEATURE = '#33303a'

function Eyes({ mood }) {
  if (mood === 'cheer') {
    return (
      <g fill="none" stroke={FEATURE} strokeWidth="4.5" strokeLinecap="round">
        <path d="M39 56q7-7 14 0" />
        <path d="M67 56q7-7 14 0" />
      </g>
    )
  }
  return (
    <g>
      <circle cx="46" cy="58" r="5" fill={FEATURE} />
      <circle cx="74" cy="58" r="5" fill={FEATURE} />
      {mood === 'tryAgain' && (
        <g fill="none" stroke={FEATURE} strokeWidth="4" strokeLinecap="round">
          <path d="M36 48l12 5" />
          <path d="M84 48l-12 5" />
        </g>
      )}
    </g>
  )
}

function Mouth({ mood }) {
  const path = mood === 'cheer' ? 'M48 86q12 12 24 0' : 'M50 88q10 8 20 0'
  return (
    <path d={path} fill="none" stroke={FEATURE} strokeWidth="4.5" strokeLinecap="round" />
  )
}

export default function Mascot({ mood = 'idle', size = 88, className = '' }) {
  return (
    <span className={`mascot mascot--${mood} ${className}`.trim()} style={{ width: size }}>
      <svg viewBox="0 0 120 120" width="100%" aria-hidden="true" focusable="false">
        {/* L'ombre au sol pose l'animal, comme sur les dessins patient. */}
        <ellipse cx="60" cy="110" rx="26" ry="5" fill={FEATURE} opacity=".12" />

        {/* Oreilles */}
        <path d="M26 46L20 20l24 14z" fill={FUR} stroke={FUR_INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M94 46L100 20 76 34z" fill={FUR} stroke={FUR_INK} strokeWidth="5" strokeLinejoin="round" />

        {/* Tête et museau */}
        <path
          d="M60 30c22 0 34 16 34 34 0 22-15 36-34 36S26 86 26 64c0-18 12-34 34-34z"
          fill={FUR}
          stroke={FUR_INK}
          strokeWidth="5"
        />
        <path
          d="M60 68c14 0 22 6 22 14 0 10-10 18-22 18s-22-8-22-18c0-8 8-14 22-14z"
          fill={BELLY}
          stroke={FUR_INK}
          strokeWidth="5"
        />

        <Eyes mood={mood} />
        <ellipse cx="60" cy="80" rx="7" ry="5.5" fill={FEATURE} />
        <Mouth mood={mood} />

        {/* Patte tendue : l'humeur ratée encourage, elle ne gronde pas. */}
        {mood === 'tryAgain' && (
          <path
            d="M96 84q10 4 14 12"
            fill="none"
            stroke={FUR_INK}
            strokeWidth="5"
            strokeLinecap="round"
          />
        )}
      </svg>
    </span>
  )
}
