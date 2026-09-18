/**
 * Corner pictogram of a correction state.
 *
 * A state never rests on its colour alone: it carries a border stroke, this
 * pictogram and a tint. Remove the colour and the state still reads, which is
 * what makes a board usable in greyscale.
 */
const MARKS = {
  ok: {
    label: 'juste',
    path: (
      <path
        d="M5 13l4.5 4.5L19 7"
        fill="none"
        stroke="#fff"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  err: {
    label: 'faux',
    path: (
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
    ),
  },
  expected: {
    label: 'réponse attendue',
    path: <circle cx="12" cy="12" r="6.5" fill="none" stroke="#fff" strokeWidth="3" />,
  },
}

export default function StateMark({ state, size = 32 }) {
  const mark = MARKS[state]
  if (!mark) return null

  return (
    <span className={`state-mark state-mark--${state}`} style={{ width: size, height: size }}>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {mark.path}
      </svg>
      <span className="visually-hidden">{mark.label}</span>
    </span>
  )
}
