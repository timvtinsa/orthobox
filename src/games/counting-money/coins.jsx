/**
 * Euro coins and notes, drawn as SVG.
 * Values are held in cents so no floating point rounding can creep in.
 */
export const COINS = [
  { value: 1, label: '1 centime', type: 'copper' },
  { value: 2, label: '2 centimes', type: 'copper' },
  { value: 5, label: '5 centimes', type: 'copper' },
  { value: 10, label: '10 centimes', type: 'gold' },
  { value: 20, label: '20 centimes', type: 'gold' },
  { value: 50, label: '50 centimes', type: 'gold' },
  { value: 100, label: '1 euro', type: 'bicolour' },
  { value: 200, label: '2 euros', type: 'bicolour' },
  { value: 500, label: '5 euros', type: 'note-grey' },
  { value: 1000, label: '10 euros', type: 'note-red' },
  { value: 2000, label: '20 euros', type: 'note-blue' },
]

const TINTS = {
  copper: { fill: '#e8b79a', stroke: '#b97d56' },
  gold: { fill: '#f2dda6', stroke: '#c0a15c' },
  bicolour: { fill: '#f2dda6', stroke: '#a8b0b8' },
  'note-grey': { fill: '#dfe2e6', stroke: '#9aa2ab' },
  'note-red': { fill: '#f3c4c0', stroke: '#c1756f' },
  'note-blue': { fill: '#c3d6ee', stroke: '#7492b8' },
}

/** Amount in cents, written the French way: « 2,50 € ». */
export function formatAmount(cents) {
  return `${(cents / 100).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`
}

/** Short text printed on the coin or note. */
function inscription(coin) {
  return coin.value < 100 ? `${coin.value} c` : `${coin.value / 100} €`
}

export function Coin({ coin, size = 62 }) {
  const tint = TINTS[coin.type]
  const isNote = coin.type.startsWith('note')
  const width = isNote ? size * 1.6 : size

  return (
    <svg
      width={width}
      height={size}
      viewBox={`0 0 ${isNote ? 100 : 64} 64`}
      aria-hidden="true"
      focusable="false"
    >
      {isNote ? (
        <rect x="2" y="10" width="96" height="44" rx="5" fill={tint.fill} stroke={tint.stroke} strokeWidth="3" />
      ) : (
        <>
          <circle cx="32" cy="32" r="29" fill={tint.fill} stroke={tint.stroke} strokeWidth="3" />
          {coin.type === 'bicolour' && (
            <circle cx="32" cy="32" r="18" fill="#e6e9ec" stroke={tint.stroke} strokeWidth="2" />
          )}
        </>
      )}
      <text
        x={isNote ? 50 : 32}
        y={isNote ? 38 : 39}
        textAnchor="middle"
        fontFamily="Atkinson Hyperlegible, Nunito, sans-serif"
        fontSize={isNote ? 22 : 20}
        fontWeight="700"
        fill="#4a4453"
      >
        {inscription(coin)}
      </text>
    </svg>
  )
}
