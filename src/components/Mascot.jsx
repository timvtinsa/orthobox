/**
 * Orthobox's little fox, the child-mode companion.
 *
 * Drawn to the same rule as the patient bank, in three layers: the local
 * colour of the animal, a single shadow plane on the side away from the light,
 * and a constant black outline. A child has to be able to recognise a fox, not
 * a round shape with ears, so the drawing carries what actually makes a fox: a
 * bushy white-tipped tail, black stockings, tall pointed ears with a dark
 * back, a cheek ruff tapering to the chin, a small dark nose, and whiskers.
 *
 * One mood per outcome would get repetitive across a whole series, so each
 * outcome has three: a shared face (the fox is happy, or it is encouraging —
 * never sad), carried by three different bits of motion, picked at random by
 * `GameCompanion`.
 *   idle                          sitting, watching, breathing
 *   cheer, twirl, bounce          happy face: narrowed eyes, open smile
 *   tryAgain, nudge, wiggle       encouraging face: raised brows, a paw held out
 *
 * Expressions rely on line work only: nothing changes colour from one mood to
 * the next, so success is never signalled by colour alone, and the failed mood
 * encourages instead of telling off. No frown, no tear, no red.
 */
const FUR = '#f6bdab'
const FUR_INK = '#a44a28'
const BELLY = '#ffffff'
const FEATURE = '#33303a'

const HAPPY_MOODS = ['cheer', 'twirl', 'bounce']
const ENCOURAGING_MOODS = ['tryAgain', 'nudge', 'wiggle']

function Eyes({ mood }) {
  if (HAPPY_MOODS.includes(mood)) {
    return (
      <g fill="none" stroke={FEATURE} strokeWidth="4" strokeLinecap="round">
        <path d="M39 42q7-7 14 0" />
        <path d="M67 42q7-7 14 0" />
      </g>
    )
  }
  return (
    <g>
      <circle cx="46" cy="43" r="5" fill={FEATURE} />
      <circle cx="74" cy="43" r="5" fill={FEATURE} />
      {/* Le reflet est ce qui rend un oeil vivant plutôt que dessiné. */}
      <circle cx="47.8" cy="41.2" r="1.7" fill="#fff" />
      <circle cx="75.8" cy="41.2" r="1.7" fill="#fff" />
      {ENCOURAGING_MOODS.includes(mood) && (
        <g fill="none" stroke={FEATURE} strokeWidth="3.6" strokeLinecap="round">
          <path d="M37 37l12-5" />
          <path d="M83 37l-12-5" />
        </g>
      )}
    </g>
  )
}

function Mouth({ mood }) {
  if (HAPPY_MOODS.includes(mood)) {
    return (
      <path
        d="M49 64q11 12 22 0z"
        fill={FEATURE}
        stroke={FEATURE}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    )
  }
  return (
    <path
      d={ENCOURAGING_MOODS.includes(mood) ? 'M51 64q9 6 18 0' : 'M51 63q9 8 18 0'}
      fill="none"
      stroke={FEATURE}
      strokeWidth="4"
      strokeLinecap="round"
    />
  )
}

/** Three short, fine strokes per cheek: enough to read as whiskers at this
 * size without competing with the face. */
function Whiskers() {
  return (
    <g stroke={FEATURE} strokeWidth="1.6" strokeLinecap="round" opacity=".35">
      <path d="M40 58h-11M39 62h-10.5M40 66h-9.5" />
      <path d="M80 58h11M81 62h10.5M80 66h9.5" />
    </g>
  )
}

export default function Mascot({ mood = 'idle', size = 88, className = '' }) {
  return (
    <span className={`mascot mascot--${mood} ${className}`.trim()} style={{ width: size }}>
      <svg viewBox="0 0 120 120" width="100%" aria-hidden="true" focusable="false">
        <ellipse cx="60" cy="112" rx="36" ry="5" fill={FEATURE} opacity=".12" />

        {/* Queue touffue, derrière le corps, à bout blanc : une touffe de
            plus qu'avant, pour une silhouette qui se lit comme du poil
            plutôt que comme une seule goutte de couleur. */}
        <g className="mascot__tail">
          <ellipse
            cx="93"
            cy="78"
            rx="15"
            ry="25"
            fill={FUR}
            stroke={FEATURE}
            strokeWidth="4.5"
            transform="rotate(28 93 78)"
          />
          <ellipse
            cx="88"
            cy="58"
            rx="10.5"
            ry="14"
            fill={FUR}
            stroke={FEATURE}
            strokeWidth="4"
            transform="rotate(14 88 58)"
          />
          <ellipse cx="103" cy="56" rx="12" ry="13" fill={BELLY} stroke={FEATURE} strokeWidth="4.5" transform="rotate(28 103 56)" />
          <path d="M97 92a15 25 0 0 0 11-26 15 25 0 0 1-11 26z" fill={FEATURE} opacity=".16" />
        </g>

        {/* Corps assis */}
        <path
          d="M58 56c17 0 29 15 29 31 0 12-5 19-12 19H41c-7 0-12-7-12-19 0-16 12-31 29-31z"
          fill={FUR}
          stroke={FEATURE}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M64 57c13 3 23 17 23 30 0 12-5 19-12 19H60c9 0 14-7 14-19 0-13-4-26-10-30z"
          fill={FEATURE}
          opacity=".14"
        />
        <path
          d="M58 70c10 0 16 9 16 19s-6 17-16 17-16-7-16-17 6-19 16-19z"
          fill={BELLY}
          stroke={FEATURE}
          strokeWidth="4.5"
        />

        {/* Chaussettes noires, la marque du renard roux */}
        <ellipse cx="45" cy="103" rx="9" ry="6" fill={FEATURE} />
        <ellipse cx="71" cy="103" rx="9" ry="6" fill={FEATURE} />

        {/* Oreilles hautes et pointues, à revers sombre et pointe noire :
            plus dressées que rondes, pour un air aux aguets plutôt qu'en
            peluche. */}
        <path d="M35 29L24 2l26 14z" fill={FUR} stroke={FEATURE} strokeWidth="5" strokeLinejoin="round" />
        <path d="M35 24L29 9l14 7z" fill={FUR_INK} />
        <path d="M24 2l13 6-5 10z" fill={FEATURE} />
        <path d="M85 29L96 2 70 16z" fill={FUR} stroke={FEATURE} strokeWidth="5" strokeLinejoin="round" />
        <path d="M85 24L91 9l-14 7z" fill={FUR_INK} />
        <path d="M96 2l-13 6 5 10z" fill={FEATURE} />

        {/* Tête, collerette et museau */}
        <path
          d="M60 14c16 0 27 12 27 27 0 9-3 17-9 23-5 5-11 8-18 8s-13-3-18-8c-6-6-9-14-9-23 0-15 11-27 27-27z"
          fill={FUR}
          stroke={FEATURE}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M72 18c9 5 15 13 15 23 0 9-3 17-9 23-5 5-11 8-18 8 11 0 18-14 18-31 0-10-2-18-6-23z"
          fill={FEATURE}
          opacity=".16"
        />
        <path
          d="M60 50c9 0 16 5 16 12 0 7-7 13-16 13s-16-6-16-13c0-7 7-12 16-12z"
          fill={BELLY}
          stroke={FEATURE}
          strokeWidth="4.5"
        />

        <Whiskers />
        <Eyes mood={mood} />
        <ellipse cx="60" cy="55" rx="6.5" ry="5" fill={FEATURE} />
        <ellipse cx="58" cy="53.3" rx="1.4" ry="1" fill="#fff" opacity=".65" />
        <Mouth mood={mood} />

        {/* Patte tendue : l'humeur ratée encourage, elle ne gronde pas. */}
        {ENCOURAGING_MOODS.includes(mood) && (
          <g className="mascot__paw">
            <ellipse cx="30" cy="80" rx="9" ry="7" fill={FUR} stroke={FEATURE} strokeWidth="4.5" transform="rotate(-25 30 80)" />
          </g>
        )}
      </svg>
    </span>
  )
}
