/**
 * Pièces et billets en euros, dessinés en SVG.
 * Les valeurs sont exprimées en centimes pour éviter tout arrondi flottant.
 */
export const PIECES = [
  { valeur: 1, label: '1 centime', type: 'cuivre' },
  { valeur: 2, label: '2 centimes', type: 'cuivre' },
  { valeur: 5, label: '5 centimes', type: 'cuivre' },
  { valeur: 10, label: '10 centimes', type: 'or' },
  { valeur: 20, label: '20 centimes', type: 'or' },
  { valeur: 50, label: '50 centimes', type: 'or' },
  { valeur: 100, label: '1 euro', type: 'bicolore' },
  { valeur: 200, label: '2 euros', type: 'bicolore' },
  { valeur: 500, label: '5 euros', type: 'billet-gris' },
  { valeur: 1000, label: '10 euros', type: 'billet-rouge' },
  { valeur: 2000, label: '20 euros', type: 'billet-bleu' },
]

const TEINTES = {
  cuivre: { fond: '#e8b79a', bord: '#b97d56' },
  or: { fond: '#f2dda6', bord: '#c0a15c' },
  bicolore: { fond: '#f2dda6', bord: '#a8b0b8' },
  'billet-gris': { fond: '#dfe2e6', bord: '#9aa2ab' },
  'billet-rouge': { fond: '#f3c4c0', bord: '#c1756f' },
  'billet-bleu': { fond: '#c3d6ee', bord: '#7492b8' },
}

/** Montant en centimes présenté à la française : « 2,50 € ». */
export function formaterMontant(centimes) {
  return `${(centimes / 100).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`
}

/** Texte court inscrit sur la pièce ou le billet. */
function inscription(piece) {
  return piece.valeur < 100 ? `${piece.valeur} c` : `${piece.valeur / 100} €`
}

export function Piece({ piece, size = 62 }) {
  const teinte = TEINTES[piece.type]
  const billet = piece.type.startsWith('billet')
  const largeur = billet ? size * 1.6 : size

  return (
    <svg
      width={largeur}
      height={size}
      viewBox={`0 0 ${billet ? 100 : 64} 64`}
      aria-hidden="true"
      focusable="false"
    >
      {billet ? (
        <rect x="2" y="10" width="96" height="44" rx="5" fill={teinte.fond} stroke={teinte.bord} strokeWidth="3" />
      ) : (
        <>
          <circle cx="32" cy="32" r="29" fill={teinte.fond} stroke={teinte.bord} strokeWidth="3" />
          {piece.type === 'bicolore' && (
            <circle cx="32" cy="32" r="18" fill="#e6e9ec" stroke={teinte.bord} strokeWidth="2" />
          )}
        </>
      )}
      <text
        x={billet ? 50 : 32}
        y={billet ? 38 : 39}
        textAnchor="middle"
        fontFamily="Atkinson Hyperlegible, Nunito, sans-serif"
        fontSize={billet ? 22 : 20}
        fontWeight="700"
        fill="#4a4453"
      >
        {inscription(piece)}
      </text>
    </svg>
  )
}
