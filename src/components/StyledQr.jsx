/**
 * A QR code drawn in the house style rather than handed off as a bitmap.
 *
 * `qrcode` only supplies the bit matrix (`create`, no canvas, no `fs`): every
 * mark on the page — the rounded modules, the three eyes, the badge at the
 * centre — is drawn here as plain SVG, the same rule the drawing bank
 * follows. Each module keeps close to its full square (softened corners, not
 * a plain circle): a circle's four gaps are exactly where a camera's
 * binarizer starts losing the grid on a dense code, which a real « share
 * these settings » link can produce on a game with several fields. The badge
 * stays modest (16 % of the grid) and sits inside the level-H error budget
 * (up to 30 % of the code may be obscured), so it never costs the code its
 * ability to scan.
 */
import { useMemo } from 'react'
import { create } from 'qrcode'
import { BrandMarkShapes } from './BrandMark.jsx'

// L'encre du bandeau (le rond bleu foncé du sigle), pour que les points du
// code et l'écusson central appartiennent à la même identité — aucun
// dégradé qui n'existerait nulle part ailleurs dans l'application.
const INK = '#35608f'

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
      <rect width="7" height="7" rx="2" fill={INK} />
      <rect x="1" y="1" width="5" height="5" rx="1.3" fill="#fff" />
      <rect x="2.3" y="2.3" width="2.4" height="2.4" rx="0.6" fill={INK} />
    </g>
  )
}

/** The Orthobox mark from the header banner, redrawn at badge scale. */
function Badge({ span }) {
  const inset = span * 0.16
  const inner = span - inset * 2
  return (
    <g>
      <rect width={span} height={span} rx={span * 0.24} fill="#fff" />
      <rect
        width={span}
        height={span}
        rx={span * 0.24}
        fill="none"
        stroke={INK}
        strokeWidth={span * 0.04}
      />
      <g transform={`translate(${inset} ${inset}) scale(${inner / 40})`}>
        <BrandMarkShapes />
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
  const rawSpan = Math.floor(n * 0.16)
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
      // A rounded square rather than a circle: softened corners for the
      // « stylisé » look, but close to full module coverage, which a plain
      // circle does not give — its four corner gaps are exactly where a
      // real camera's binarizer starts to lose the grid on a dense code.
      dots.push(
        <rect
          key={`${x}-${y}`}
          x={x + 0.02}
          y={y + 0.02}
          width={0.96}
          height={0.96}
          rx={0.18}
          fill={INK}
        />,
      )
    }
  }

  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      className={`styled-qr${className ? ` ${className}` : ''}`}
      role="img"
      aria-label="Code QR : lien vers ces réglages"
    >
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
