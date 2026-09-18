/**
 * A QR code drawn in the house style rather than handed off as a bitmap.
 *
 * `qrcode` only supplies the bit matrix (`create`, no canvas, no `fs`): every
 * mark on the page — the rounded dots, the three eyes, the badge at the
 * centre — is drawn here as plain SVG, the same rule the drawing bank
 * follows. The badge sits inside the level-H error budget (up to 30 % of the
 * code may be obscured), so it never costs the code its ability to scan.
 */
import { useMemo } from 'react'
import { create } from 'qrcode'

const BRAND_LIGHT = '#5b74e8'
const BRAND_DARK = '#353fa8'
const GRADIENT_ID = 'orthobox-qr-brand'

// Marge de silence : la lecture par une caméra de téléphone y compte, même
// si la carte qui entoure le code ajoute elle-même de la marge blanche.
const QUIET = 4

function inCorner(x, y, cx, cy) {
  return x >= cx && x < cx + 7 && y >= cy && y < cy + 7
}

function isFinderZone(x, y, size) {
  return inCorner(x, y, 0, 0) || inCorner(x, y, size - 7, 0) || inCorner(x, y, 0, size - 7)
}

/** One of the three position markers, as a ring rather than a solid square. */
function Eye({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="7" height="7" rx="2" fill={`url(#${GRADIENT_ID})`} />
      <rect x="1" y="1" width="5" height="5" rx="1.3" fill="#fff" />
      <rect x="2.3" y="2.3" width="2.4" height="2.4" rx="0.6" fill={`url(#${GRADIENT_ID})`} />
    </g>
  )
}

/** The Orthobox mark, redrawn at badge scale from the same paths as the favicon. */
function Badge({ span }) {
  const inset = span * 0.14
  const inner = span - inset * 2
  return (
    <g>
      <rect width={span} height={span} rx={span * 0.24} fill="#fff" />
      <rect
        width={span}
        height={span}
        rx={span * 0.24}
        fill="none"
        stroke={`url(#${GRADIENT_ID})`}
        strokeWidth={span * 0.045}
      />
      <g transform={`translate(${inset} ${inset}) scale(${inner / 512})`}>
        <path
          d="M256 104c-93 0-168 59-168 132 0 41 24 78 62 102l-14 66 78-46c14 2 28 4 42 4 93 0 168-59 168-126S349 104 256 104Z"
          fill={`url(#${GRADIENT_ID})`}
        />
        <g fill="#fff">
          <circle cx="186" cy="236" r="26" />
          <circle cx="256" cy="236" r="26" />
          <circle cx="326" cy="236" r="26" />
        </g>
      </g>
    </g>
  )
}

export default function StyledQr({ value, withLogo = true, className = '' }) {
  const qr = useMemo(() => create(value, { errorCorrectionLevel: 'H' }), [value])
  const { modules } = qr
  const n = modules.size
  const total = n + QUIET * 2

  // Case centrale réservée à l'écusson : une taille impaire pour rester
  // centrée sur une case, et jamais plus de son propre quart de la grille.
  const rawSpan = Math.floor(n * 0.22)
  const logoSpan = withLogo ? (rawSpan % 2 === 0 ? rawSpan + 1 : rawSpan) : 0
  const logoStart = (n - logoSpan) / 2

  const inLogoZone = (x, y) =>
    withLogo &&
    x >= logoStart - 1 &&
    x < logoStart + logoSpan + 1 &&
    y >= logoStart - 1 &&
    y < logoStart + logoSpan + 1

  const dots = []
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      // BitMatrix#get takes (row, col): y is the row, x the column.
      if (!modules.get(y, x)) continue
      if (isFinderZone(x, y, n) || inLogoZone(x, y)) continue
      dots.push(<circle key={`${x}-${y}`} cx={x + 0.5} cy={y + 0.5} r={0.44} fill={`url(#${GRADIENT_ID})`} />)
    }
  }

  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      className={`styled-qr${className ? ` ${className}` : ''}`}
      role="img"
      aria-label="Code QR : lien vers ces réglages"
    >
      <defs>
        <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BRAND_LIGHT} />
          <stop offset="1" stopColor={BRAND_DARK} />
        </linearGradient>
      </defs>
      <rect width={total} height={total} rx={QUIET} fill="#fff" />
      <g transform={`translate(${QUIET} ${QUIET})`}>
        {dots}
        <Eye x={0} y={0} />
        <Eye x={n - 7} y={0} />
        <Eye x={0} y={n - 7} />
        {withLogo && (
          <g transform={`translate(${logoStart} ${logoStart})`}>
            <Badge span={logoSpan} />
          </g>
        )}
      </g>
    </svg>
  )
}
