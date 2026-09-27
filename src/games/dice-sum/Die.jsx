/**
 * One die, drawn as an actual six-face cube so the throw can tumble it in
 * 3D rather than just flicker between faces. Always shown as a constellation
 * of pips: recognising a five without counting it is exactly the skill being
 * worked on, and the familiar layout is what makes that possible.
 */
const PIPS = {
  1: [[50, 50]],
  2: [[30, 30], [70, 70]],
  3: [[30, 30], [50, 50], [70, 70]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
  6: [[30, 28], [70, 28], [30, 50], [70, 50], [30, 72], [70, 72]],
}

/** The value shown on each face of the cube: opposite faces sum to seven,
 * matching `FACE_ROTATION` in `logic.js`. */
const FACE_VALUES = { front: 1, back: 6, right: 2, left: 5, top: 3, bottom: 4 }

function Face({ position, value }) {
  return (
    <svg className={`die-face die-face--${position}`} viewBox="0 0 100 100">
      <rect className="die__face" x="5" y="5" width="90" height="90" rx="18" />
      {PIPS[value].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} className="die__pip" cx={cx} cy={cy} r="9" />
      ))}
    </svg>
  )
}

export default function Die({ rotation = { x: 0, y: 0 }, label }) {
  return (
    <div className="die-scene" role="img" aria-label={label}>
      <div
        className="die-cube"
        style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
      >
        {Object.entries(FACE_VALUES).map(([position, value]) => (
          <Face key={position} position={position} value={value} />
        ))}
      </div>
    </div>
  )
}
