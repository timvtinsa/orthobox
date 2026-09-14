/**
 * Orthobox's little fox, the child-mode companion.
 *
 * Three moods, drawn from the same shapes so that it is clearly the same
 * animal changing expression:
 *   idle      : attentive, breathing gently
 *   cheer     : narrowed eyes and a wide smile, jumping
 *   tryAgain  : worried eyebrows, swaying, never looking cross
 *
 * Expressions rely on line work only: no colour changes from one mood to the
 * next, so success is never signalled by colour alone.
 */
const FUR = '#f2a882'
const FUR_DARK = '#d9825c'
const BELLY = '#fdf1e9'
const OUTLINE = '#5c4638'
const CHEEK = '#f28e8e'

function Eyes({ mood }) {
  if (mood === 'cheer') {
    // Eyes narrowed with delight.
    return (
      <g fill="none" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round">
        <path d="M40 52c3-5 9-5 12 0" />
        <path d="M68 52c3-5 9-5 12 0" />
      </g>
    )
  }
  return (
    <g>
      <circle cx="46" cy="53" r="5.5" fill={OUTLINE} />
      <circle cx="74" cy="53" r="5.5" fill={OUTLINE} />
      <circle cx="48" cy="51" r="1.8" fill="#fff" />
      <circle cx="76" cy="51" r="1.8" fill="#fff" />
      {mood === 'tryAgain' && (
        <g fill="none" stroke={OUTLINE} strokeWidth="3.4" strokeLinecap="round">
          <path d="M38 46l12 -5" />
          <path d="M82 46l-12 -5" />
        </g>
      )}
    </g>
  )
}

function Mouth({ mood }) {
  if (mood === 'cheer') {
    return (
      <path
        d="M51 69c4 8 14 8 18 0z"
        fill={OUTLINE}
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    )
  }
  if (mood === 'tryAgain') {
    return (
      <path d="M54 74c2-3 10-3 12 0" fill="none" stroke={OUTLINE} strokeWidth="3.4" strokeLinecap="round" />
    )
  }
  return (
    <path d="M53 69c3 4 11 4 14 0" fill="none" stroke={OUTLINE} strokeWidth="3.4" strokeLinecap="round" />
  )
}

export default function Mascot({ mood = 'idle', size = 120, className = '' }) {
  return (
    <span className={`mascot mascot--${mood} ${className}`.trim()} style={{ width: size }}>
      <svg viewBox="0 0 120 124" width="100%" aria-hidden="true" focusable="false">
        {/* Tail, behind the body, curled forward */}
        <path
          d="M88 104c14 2 22-6 22-17 0-9-7-15-14-13-6 2-8 9-4 13"
          fill={FUR}
          stroke={FUR_DARK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M96 87c4-2 8 1 8 6s-4 8-8 7c2-4 2-9 0-13z" fill={BELLY} />

        {/* Seated body */}
        <ellipse cx="60" cy="99" rx="29" ry="20" fill={FUR} />
        <ellipse cx="60" cy="103" rx="19" ry="15" fill={BELLY} />
        <ellipse cx="45" cy="114" rx="9" ry="6" fill={BELLY} stroke={FUR_DARK} strokeWidth="2" />
        <ellipse cx="75" cy="114" rx="9" ry="6" fill={BELLY} stroke={FUR_DARK} strokeWidth="2" />

        {/* Ears */}
        <path d="M29 38l3-24 21 13z" fill={FUR} stroke={FUR_DARK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M91 38l-3-24-21 13z" fill={FUR} stroke={FUR_DARK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M36 32l1-10 8 5z" fill={CHEEK} opacity=".65" />
        <path d="M84 32l-1-10-8 5z" fill={CHEEK} opacity=".65" />

        {/* Head */}
        <ellipse cx="60" cy="55" rx="34" ry="29" fill={FUR} />
        <path
          d="M60 84c-13 0-24-7-28-17 8 4 17 6 28 6s20-2 28-6c-4 10-15 17-28 17z"
          fill={BELLY}
        />
        <ellipse cx="60" cy="67" rx="15" ry="11" fill={BELLY} />
        <ellipse cx="60" cy="60" rx="4.6" ry="3.4" fill={OUTLINE} />

        <circle cx="34" cy="63" r="6" fill={CHEEK} opacity=".45" />
        <circle cx="86" cy="63" r="6" fill={CHEEK} opacity=".45" />

        <Eyes mood={mood} />
        <Mouth mood={mood} />
      </svg>

      {mood === 'cheer' && (
        <span className="mascot__sparkles" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <svg key={index} className={`sparkle sparkle--${index}`} viewBox="0 0 24 24" width="18">
              <path
                d="M12 2l2.7 6.2 6.7.6-5 4.4 1.5 6.6L12 16.4 6.1 19.8l1.5-6.6-5-4.4 6.7-.6z"
                fill="#f4dfa8"
                stroke="#c9a03f"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </span>
      )}
    </span>
  )
}
