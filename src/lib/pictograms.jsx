/**
 * Hand-drawn pictograms, used by the visual memory games, the visual search
 * scene and the sound sequence cards.
 *
 * Concrete, easily named objects in flat pastel shapes: they can be memorised
 * visually or put into words, which leaves the practitioner free to choose
 * the strategy being worked on. Labels stay in French, since they are shown
 * to the patient.
 */
const C = {
  peach: '#f6bdab',
  sage: '#b9d8c2',
  lavender: '#cdc3ec',
  sand: '#f4dfa8',
  blue: '#a8c8ec',
  outline: '#5c5566',
}

const DRAWINGS = {
  house: {
    label: 'maison',
    draw: (
      <>
        <path d="M12 30L32 13l20 17v21a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3z" fill={C.peach} />
        <path d="M8 31L32 10l24 21" fill="none" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="27" y="40" width="12" height="14" rx="2" fill={C.outline} opacity=".75" />
      </>
    ),
  },
  tree: {
    label: 'arbre',
    draw: (
      <>
        <circle cx="32" cy="26" r="17" fill={C.sage} />
        <circle cx="21" cy="34" r="10" fill={C.sage} />
        <circle cx="43" cy="34" r="10" fill={C.sage} />
        <rect x="28" y="38" width="8" height="18" rx="3" fill={C.outline} opacity=".75" />
      </>
    ),
  },
  fish: {
    label: 'poisson',
    draw: (
      <>
        <path d="M40 32c0 9-8 15-17 15S8 41 8 32s6-15 15-15 17 6 17 15z" fill={C.blue} />
        <path d="M40 32l16-11v22z" fill={C.blue} />
        <circle cx="18" cy="28" r="3" fill={C.outline} />
      </>
    ),
  },
  key: {
    label: 'clé',
    draw: (
      <>
        <circle cx="20" cy="26" r="12" fill="none" stroke={C.sand} strokeWidth="7" />
        <path d="M28 34l24 22" stroke={C.sand} strokeWidth="7" strokeLinecap="round" />
        <path d="M44 42l-7 7M50 48l-6 6" stroke={C.outline} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  cup: {
    label: 'tasse',
    draw: (
      <>
        <path d="M14 22h30v20a12 12 0 0 1-12 12h-6a12 12 0 0 1-12-12z" fill={C.peach} />
        <path d="M44 27h6a7 7 0 0 1 0 14h-6" fill="none" stroke={C.outline} strokeWidth="3.5" />
        <rect x="14" y="22" width="30" height="6" fill={C.outline} opacity=".25" />
      </>
    ),
  },
  umbrella: {
    label: 'parapluie',
    draw: (
      <>
        <path d="M8 34a24 24 0 0 1 48 0z" fill={C.lavender} />
        <path d="M8 34a12 12 0 0 1 24 0 12 12 0 0 1 24 0" fill="none" stroke={C.outline} strokeWidth="3" />
        <path d="M32 34v16a6 6 0 0 0 12 0" fill="none" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" />
      </>
    ),
  },
  balloon: {
    label: 'ballon',
    draw: (
      <>
        <circle cx="32" cy="30" r="18" fill={C.peach} />
        <path d="M32 12c8 10 8 26 0 36M14 30h36" fill="none" stroke={C.outline} strokeWidth="3" />
        <path d="M32 48v9" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  star: {
    label: 'étoile',
    draw: <path d="M32 10l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill={C.sand} stroke={C.outline} strokeWidth="3" strokeLinejoin="round" />,
  },
  moon: {
    label: 'lune',
    draw: <path d="M42 12a22 22 0 1 0 10 30A24 24 0 0 1 42 12z" fill={C.blue} stroke={C.outline} strokeWidth="3" strokeLinejoin="round" />,
  },
  flower: {
    label: 'fleur',
    draw: (
      <>
        <g fill={C.lavender}>
          <circle cx="32" cy="16" r="9" /><circle cx="46" cy="27" r="9" />
          <circle cx="41" cy="42" r="9" /><circle cx="23" cy="42" r="9" /><circle cx="18" cy="27" r="9" />
        </g>
        <circle cx="32" cy="30" r="7" fill={C.sand} />
        <path d="M32 44v14" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" />
      </>
    ),
  },
  car: {
    label: 'voiture',
    draw: (
      <>
        <path d="M10 40l5-13a5 5 0 0 1 5-3h24a5 5 0 0 1 5 3l5 13v6H10z" fill={C.blue} />
        <circle cx="20" cy="47" r="6" fill={C.outline} />
        <circle cx="44" cy="47" r="6" fill={C.outline} />
        <path d="M18 38l3-9h22l3 9z" fill="#fff" opacity=".7" />
      </>
    ),
  },
  boat: {
    label: 'bateau',
    draw: (
      <>
        <path d="M32 8l16 26H32z" fill={C.peach} />
        <path d="M30 8v26H16z" fill={C.sand} />
        <path d="M10 40h44l-7 13H17z" fill={C.outline} opacity=".8" />
      </>
    ),
  },
  book: {
    label: 'livre',
    draw: (
      <>
        <path d="M32 18c-6-5-14-5-20-3v30c6-2 14-2 20 3z" fill={C.sage} />
        <path d="M32 18c6-5 14-5 20-3v30c-6-2-14-2-20 3z" fill={C.blue} />
        <path d="M32 18v30" stroke={C.outline} strokeWidth="3" />
      </>
    ),
  },
  scissors: {
    label: 'ciseaux',
    draw: (
      <>
        <path d="M18 14l28 30M46 14L18 44" stroke={C.outline} strokeWidth="4" strokeLinecap="round" />
        <circle cx="18" cy="50" r="7" fill="none" stroke={C.peach} strokeWidth="5" />
        <circle cx="46" cy="50" r="7" fill="none" stroke={C.peach} strokeWidth="5" />
      </>
    ),
  },
  cake: {
    label: 'gâteau',
    draw: (
      <>
        <rect x="12" y="30" width="40" height="24" rx="5" fill={C.peach} />
        <rect x="12" y="36" width="40" height="6" fill="#fff" opacity=".65" />
        <path d="M22 30v-8M32 30v-8M42 30v-8" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />
        <g fill={C.sand}>
          <circle cx="22" cy="18" r="4" /><circle cx="32" cy="18" r="4" /><circle cx="42" cy="18" r="4" />
        </g>
      </>
    ),
  },
  watch: {
    label: 'montre',
    draw: (
      <>
        <circle cx="32" cy="32" r="17" fill={C.sand} stroke={C.outline} strokeWidth="3.5" />
        <path d="M32 22v11l8 5" fill="none" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 16l2-8h12l2 8M24 48l2 8h12l2-8" fill={C.lavender} />
      </>
    ),
  },
  lamp: {
    label: 'lampe',
    draw: (
      <>
        <path d="M32 10a14 14 0 0 1 8 25c-2 2-3 4-3 6H27c0-2-1-4-3-6a14 14 0 0 1 8-25z" fill={C.sand} />
        <rect x="27" y="45" width="10" height="8" rx="3" fill={C.outline} opacity=".75" />
        <path d="M32 4v-2M50 14l2-2M14 14l-2-2" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  cloud: {
    label: 'nuage',
    draw: (
      <>
        <path d="M20 42a10 10 0 0 1 0-20 14 14 0 0 1 26-3 9 9 0 0 1 2 23z" fill={C.blue} />
        <path d="M24 50l-3 6M34 50l-3 6M44 50l-3 6" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  apple: {
    label: 'pomme',
    draw: (
      <>
        <path d="M32 20c8-6 22-2 22 12s-12 22-22 22S10 46 10 32 24 14 32 20z" fill={C.peach} />
        <path d="M32 20c0-6 3-10 8-11" fill="none" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M32 14c5-4 11-3 11-3s-1 6-7 7" fill={C.sage} />
      </>
    ),
  },
  shoe: {
    label: 'chaussure',
    draw: (
      <>
        <path d="M10 42V24h10l8 8h16a10 10 0 0 1 10 10v4H14a4 4 0 0 1-4-4z" fill={C.lavender} />
        <path d="M10 40h44" stroke={C.outline} strokeWidth="3" />
        <path d="M28 32l4 6M36 32l4 6" stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  },
  suitcase: {
    label: 'valise',
    draw: (
      <>
        <rect x="10" y="24" width="44" height="28" rx="6" fill={C.sage} />
        <path d="M24 24v-5a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v5" fill="none" stroke={C.outline} strokeWidth="3.5" />
        <rect x="10" y="34" width="44" height="6" fill={C.outline} opacity=".25" />
      </>
    ),
  },
  bell: {
    label: 'cloche',
    draw: (
      <>
        <path d="M32 12a14 14 0 0 1 14 14v12l4 6H14l4-6V26a14 14 0 0 1 14-14z" fill={C.sand} />
        <circle cx="32" cy="50" r="5" fill={C.outline} opacity=".8" />
        <path d="M32 12V8" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  ladder: {
    label: 'échelle',
    draw: (
      <>
        <path d="M20 8v48M44 8v48" stroke={C.peach} strokeWidth="6" strokeLinecap="round" />
        <path d="M20 20h24M20 32h24M20 44h24" stroke={C.outline} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  phone: {
    label: 'téléphone',
    draw: (
      <>
        <rect x="20" y="8" width="24" height="48" rx="6" fill={C.blue} stroke={C.outline} strokeWidth="3" />
        <rect x="25" y="15" width="14" height="24" rx="2" fill="#fff" />
        <circle cx="32" cy="48" r="4" fill={C.outline} />
      </>
    ),
  },
  drum: {
    label: 'tambour',
    draw: (
      <>
        <rect x="12" y="26" width="40" height="24" rx="4" fill={C.peach} />
        <ellipse cx="32" cy="26" rx="20" ry="7" fill={C.sand} stroke={C.outline} strokeWidth="3" />
        <path d="M14 30l36 14M50 30L14 44" stroke={C.outline} strokeWidth="2.5" />
        <path d="M20 22l-6-12M44 22l6-12" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" />
      </>
    ),
  },
  whistle: {
    label: 'sifflet',
    draw: (
      <>
        <path d="M10 26h26a12 12 0 0 1 0 24H22a12 12 0 0 1-12-12z" fill={C.sage} stroke={C.outline} strokeWidth="3" />
        <rect x="36" y="30" width="18" height="8" rx="4" fill={C.outline} opacity=".8" />
        <path d="M44 18a10 10 0 0 1 8-6M46 12a14 14 0 0 1 10-4" fill="none" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  cat: {
    label: 'chat',
    draw: (
      <>
        <path d="M14 24l2-14 12 8h8l12-8 2 14z" fill={C.lavender} />
        <circle cx="32" cy="36" r="20" fill={C.lavender} />
        <g fill={C.outline}>
          <circle cx="24" cy="33" r="3" /><circle cx="40" cy="33" r="3" />
          <path d="M32 40l-4 4h8z" />
        </g>
        <path d="M8 38h12M44 38h12" stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  },
  dog: {
    label: 'chien',
    draw: (
      <>
        <path d="M12 20a8 8 0 0 1 8-8v20z" fill={C.sand} />
        <path d="M52 20a8 8 0 0 0-8-8v20z" fill={C.sand} />
        <rect x="18" y="16" width="28" height="30" rx="13" fill={C.sand} />
        <ellipse cx="32" cy="46" rx="12" ry="9" fill="#fff" opacity=".55" />
        <g fill={C.outline}>
          <circle cx="25" cy="30" r="3" /><circle cx="39" cy="30" r="3" />
          <ellipse cx="32" cy="42" rx="5" ry="4" />
        </g>
      </>
    ),
  },
  bird: {
    label: 'oiseau',
    draw: (
      <>
        <circle cx="28" cy="30" r="16" fill={C.blue} />
        <path d="M40 26l14-6-6 12z" fill={C.sand} />
        <path d="M24 42c-4 8-10 12-16 12 6-4 8-10 8-14z" fill={C.blue} />
        <circle cx="24" cy="26" r="3" fill={C.outline} />
        <path d="M22 48v8M32 48v8" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  cow: {
    label: 'vache',
    draw: (
      <>
        <path d="M10 22a8 8 0 0 1 10-6M54 22a8 8 0 0 0-10-6" fill="none" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" />
        <rect x="14" y="16" width="36" height="30" rx="14" fill="#fff" stroke={C.outline} strokeWidth="3" />
        <path d="M20 22a5 5 0 0 0 8 4 5 5 0 0 0-8-4z" fill={C.outline} opacity=".7" />
        <ellipse cx="32" cy="44" rx="12" ry="9" fill={C.peach} />
        <g fill={C.outline}>
          <circle cx="26" cy="30" r="2.6" /><circle cx="40" cy="30" r="2.6" />
          <circle cx="28" cy="44" r="2.4" /><circle cx="36" cy="44" r="2.4" />
        </g>
      </>
    ),
  },
  horse: {
    label: 'cheval',
    draw: (
      <>
        <path d="M20 54V30c0-8 6-14 14-14h6l6-8 4 10-4 4v10c0 6-4 8-10 10l-6 12z" fill={C.peach} stroke={C.outline} strokeWidth="3" strokeLinejoin="round" />
        <path d="M40 16c6-2 10 2 10 8" fill="none" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />
        <circle cx="40" cy="24" r="2.6" fill={C.outline} />
      </>
    ),
  },
  gift: {
    label: 'cadeau',
    draw: (
      <>
        <rect x="12" y="26" width="40" height="28" rx="4" fill={C.lavender} />
        <rect x="10" y="18" width="44" height="10" rx="3" fill={C.blue} />
        <path d="M32 18V54" stroke={C.outline} strokeWidth="4" />
        <path d="M32 18c-8-10-18-2-8 4M32 18c8-10 18-2 8 4" fill="none" stroke={C.outline} strokeWidth="3.5" />
      </>
    ),
  },
}

export const PICTOGRAMS = Object.entries(DRAWINGS).map(([id, { label }]) => ({ id, label }))

/** Renders one pictogram. `size` is a CSS length (pixels by default). */
export function Pictogram({ id, size = 72, title }) {
  const drawing = DRAWINGS[id]
  if (!drawing) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
    >
      {drawing.draw}
    </svg>
  )
}
