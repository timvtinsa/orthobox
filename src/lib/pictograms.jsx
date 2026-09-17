/**
 * Hand-drawn drawings, used by the visual memory games, the visual search
 * scene and the sound sequence cards.
 *
 * Concrete, easily named objects: they can be memorised visually or put into
 * words, which leaves the practitioner free to choose the strategy being
 * worked on. Labels stay in French, since they are shown to the patient.
 *
 * Drawings carrying `grid: 120` follow the illustration rule, in three
 * layers: the flat local colour of the object, a single shadow plane at 18 %
 * on the side away from the light, and a 5 unit outline plus a ground ellipse
 * that sets the object down. An outline on its own asks the patient to
 * recognise a graphic convention at the same time as they are looking for a
 * word, which is why the bank is moving over to illustrations.
 *
 * Fine details sit in a `picto__fine` group, dropped below 64 px: at 52 px
 * they would turn to mush. It is a lightening, never a second version.
 */
const C = {
  peach: '#f6bdab',
  peachInk: '#a44a28',
  sage: '#b9d8c2',
  sageInk: '#2f6b4c',
  lavender: '#cdc3ec',
  sand: '#f4dfa8',
  sandInk: '#8a6a18',
  blue: '#a8c8ec',
  accent: '#35608f',
  outline: '#5c5566',
}

/**
 * The outline of the patient drawings is a constant black, not the ink of a
 * domain: the bank is shared between games, so a fish does not change colour
 * depending on which game borrows it.
 *
 * No drawn object is ever filled with the success green or the error red,
 * otherwise a patient would see a red apple and read a mistake.
 */
const INK = '#33303a'

const DRAWINGS = {
  house: {
    label: 'maison',
    grid: 120,
    draw: (
      <>
        <ellipse cx="60" cy="108" rx="36" ry="5" fill={INK} opacity=".12" />
        <path d="M28 54h64v48H28z" fill={C.sand} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M74 54h18v48H74z" fill={INK} opacity=".18" />
        <path d="M18 57L60 23l42 34z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 26l40 31H60z" fill={INK} opacity=".18" />
        <rect x="52" y="74" width="21" height="28" rx="4" fill={C.sage} stroke={INK} strokeWidth="4.5" />
        <rect x="34" y="63" width="16" height="15" rx="3" fill={C.blue} stroke={INK} strokeWidth="4" />
        <g className="picto__fine">
          <circle cx="56" cy="89" r="2.8" fill={INK} />
        </g>
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
    grid: 120,
    draw: (
      <>
        <ellipse cx="60" cy="104" rx="32" ry="5" fill={INK} opacity=".12" />
        <path d="M96 62l20-16v34z" fill={C.blue} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <ellipse cx="60" cy="62" rx="38" ry="26" fill={C.blue} stroke={INK} strokeWidth="5" />
        <path d="M22 62a38 26 0 0 0 76 0z" fill={INK} opacity=".18" />
        <path d="M48 40q12-16 26-4" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <circle cx="40" cy="54" r="7" fill="#fff" stroke={INK} strokeWidth="4" />
        <circle cx="40" cy="54" r="2.8" fill={INK} />
        <g className="picto__fine">
          <path d="M60 58q8 4 0 8" fill="none" stroke={C.accent} strokeWidth="4" strokeLinecap="round" />
          <path d="M76 56q6 6 0 12" fill="none" stroke={C.accent} strokeWidth="4" strokeLinecap="round" />
        </g>
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
    grid: 120,
    draw: (
      <>
        <ellipse cx="58" cy="104" rx="38" ry="6" fill={INK} opacity=".12" />
        <path d="M84 52h6a13 13 0 0 1 0 26h-8" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M26 44h58v30a29 26 0 0 1-58 0z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M64 44h20v30a29 26 0 0 1-20 25z" fill={INK} opacity=".14" />
        <ellipse cx="55" cy="45" rx="29" ry="8" fill={C.sandInk} stroke={INK} strokeWidth="5" />
        <path d="M20 98h76" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      </>
    ),
  },
  umbrella: {
    label: 'parapluie',
    grid: 120,
    draw: (
      <>
        <ellipse cx="54" cy="112" rx="22" ry="4" fill={INK} opacity=".12" />
        <path d="M60 58v42q0 12-13 12-11 0-11-10" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M14 58a46 40 0 0 1 92 0q-11-13-23 0-11-13-23 0-11-13-23 0-11-13-23 0z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 18a46 40 0 0 1 46 40q-11-13-23 0-11-13-23 0z" fill={INK} opacity=".16" />
        <path d="M60 14v6" stroke={INK} strokeWidth="5" strokeLinecap="round" />
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
    grid: 120,
    draw: (
      <>
        <ellipse cx="60" cy="108" rx="28" ry="5" fill={INK} opacity=".12" />
        <path d="M60 36c14-10 34-2 34 22 0 26-18 44-34 44S26 84 26 58c0-24 20-32 34-22z" fill={C.sage} stroke={INK} strokeWidth="5" />
        <path d="M72 33c14 2 22 16 22 25 0 26-18 44-34 44 22 0 30-22 30-44 0-11-6-21-18-25z" fill={INK} opacity=".16" />
        <path d="M60 36V20" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M62 24q14-14 26-8-4 14-26 8z" fill={C.sageInk} stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
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
    grid: 120,
    draw: (
      <>
        <ellipse cx="60" cy="110" rx="30" ry="5" fill={INK} opacity=".12" />
        <path d="M30 46L24 18l26 14z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M90 46L96 18 70 32z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 30c20 0 32 15 32 33S78 100 60 100 28 81 28 63s12-33 32-33z" fill={C.peach} stroke={INK} strokeWidth="5" />
        <path d="M76 36c10 6 16 16 16 27 0 19-14 37-32 37 26 0 32-22 32-37 0-11-6-21-16-27z" fill={INK} opacity=".16" />
        <path d="M60 70c11 0 18 5 18 12s-8 13-18 13-18-6-18-13 7-12 18-12z" fill="#fff" stroke={INK} strokeWidth="4.5" />
        <circle cx="47" cy="58" r="5" fill={INK} />
        <circle cx="73" cy="58" r="5" fill={INK} />
        <path d="M60 76l-5 5 5 4 5-4z" fill={C.peachInk} stroke={INK} strokeWidth="3" />
        <g className="picto__fine">
          <path d="M40 80H22M80 80h18" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </g>
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

/** Renders one drawing. `size` is a CSS length (pixels by default). */
export function Pictogram({ id, size = 72, title }) {
  const drawing = DRAWINGS[id]
  if (!drawing) return null

  const grid = drawing.grid ?? 64

  return (
    <svg
      className={`picto${size < 64 ? ' picto--small' : ''}`}
      width={size}
      height={size}
      viewBox={`0 0 ${grid} ${grid}`}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
    >
      {drawing.draw}
    </svg>
  )
}
