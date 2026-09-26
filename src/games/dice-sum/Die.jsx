/**
 * One die, shown either as a constellation of pips or as a digit.
 *
 * The pip layout is the familiar one, because recognising a five on a die
 * without counting it is exactly the skill being worked on: an invented
 * arrangement would turn subitizing back into counting.
 */
const PIPS = {
  1: [[50, 50]],
  2: [[30, 30], [70, 70]],
  3: [[30, 30], [50, 50], [70, 70]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
  6: [[30, 28], [70, 28], [30, 50], [70, 50], [30, 72], [70, 72]],
}

export default function Die({ value, shown = 'pips', label }) {
  return (
    <svg
      className="die"
      viewBox="0 0 100 100"
      role="img"
      aria-label={label ?? `dé de ${value}`}
    >
      <rect className="die__face" x="5" y="5" width="90" height="90" rx="18" />
      {shown === 'digits' ? (
        <text className="die__digit" x="50" y="50" textAnchor="middle" dominantBaseline="central">
          {value}
        </text>
      ) : (
        PIPS[value].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} className="die__pip" cx={cx} cy={cy} r="9" />
        ))
      )}
    </svg>
  )
}
