/**
 * Hand-drawn drawings, used by the visual memory games, the visual search
 * scene and the sound sequence cards.
 *
 * Concrete, easily named objects: they can be memorised visually or put into
 * words, which leaves the practitioner free to choose the strategy being
 * worked on. Labels stay in French, since they are shown to the patient.
 *
 * Every drawing is written on a 120 by 120 grid and follows the illustration
 * rule, in three layers: the flat local colour of the object, a single shadow
 * plane at around 18 % on the side away from the light, which always comes
 * from the top left, and a 5 unit outline plus a ground ellipse that sets the
 * object down. An outline on its own asks the patient to recognise a graphic
 * convention at the same time as they are looking for a word, which is why
 * the bank is drawn rather than diagrammed.
 *
 * `scripts/contact-sheet.mjs` renders the bank in the three readings the
 * direction asks for, 132 px, 52 px and greyscale. A drawing that does not
 * hold all three does not belong in the bank.
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
        <ellipse cx="60" cy="110" rx="30" ry="5" fill={INK} opacity=".12" />
        <rect x="51" y="64" width="18" height="40" rx="5" fill={C.peachInk} stroke={INK} strokeWidth="5" />
        <path d="M61 64h8v40h-8z" fill={INK} opacity=".18" />
        <path d="M60 16c19 0 32 13 32 28 0 16-14 27-32 27s-32-11-32-27c0-15 13-28 32-28z" fill={C.sage} stroke={INK} strokeWidth="5" />
        <path d="M72 19c12 5 20 15 20 25 0 16-14 27-32 27 21 0 26-12 26-27 0-10-4-20-14-25z" fill={INK} opacity=".16" />
      </>
    ),
  },
  fish: {
    label: 'poisson',
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
        <ellipse cx="60" cy="110" rx="26" ry="5" fill={INK} opacity=".12" />
        <rect x="52" y="46" width="16" height="58" rx="6" fill={C.sand} stroke={INK} strokeWidth="5" />
        <path d="M61 46h7v58h-7z" fill={INK} opacity=".18" />
        <path d="M68 68h17v12H68z" fill={C.sand} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M68 88h13v12H68z" fill={C.sand} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <circle cx="60" cy="34" r="21" fill={C.sand} stroke={INK} strokeWidth="5" />
        <path d="M70 17c9 5 11 12 11 17 0 12-9 21-21 21 14 0 17-10 17-21 0-6-2-12-7-17z" fill={INK} opacity=".16" />
        <circle cx="60" cy="34" r="8" fill="#fff" stroke={INK} strokeWidth="4.5" />
      </>
    ),
  },
  cup: {
    label: 'tasse',
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
        <path d="M60 14c17 0 28 13 28 28 0 19-17 32-28 40-11-8-28-21-28-40 0-15 11-28 28-28z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M73 18c9 5 15 14 15 24 0 19-17 32-28 40 15-15 23-27 23-40 0-9-4-18-10-24z" fill={INK} opacity=".16" />
        <path d="M54 83h12l-6 9z" fill={C.peach} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M60 92q9 9 0 18" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      </>
    ),
  },
  star: {
    label: 'étoile',
    draw: (
      <>
        <path d="M60 16l13 27 30 4-22 21 5 30-26-14-26 14 5-30-22-21 30-4z" fill={C.sand} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 16l13 27 30 4-22 21 5 30-26-14z" fill={INK} opacity=".16" />
      </>
    ),
  },
  moon: {
    label: 'lune',
    draw: (
      <>
        <path d="M68 14a46 46 0 1 0 0 92 54 54 0 0 1 0-92z" fill={C.sand} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M26 76a46 46 0 0 0 42 30 54 54 0 0 1-14-20 40 40 0 0 1-28-10z" fill={INK} opacity=".16" />
        <g className="picto__fine">
          <circle cx="44" cy="44" r="6" fill={INK} opacity=".2" />
          <circle cx="38" cy="68" r="4.5" fill={INK} opacity=".2" />
        </g>
      </>
    ),
  },
  flower: {
    label: 'fleur',
    draw: (
      <>
        <ellipse cx="60" cy="110" rx="22" ry="4" fill={INK} opacity=".12" />
        <path d="M60 58v48" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M62 82q17-13 27-2-11 15-27 2z" fill={C.sage} stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
        <ellipse cx="60" cy="26" rx="11" ry="16" fill={C.peach} stroke={INK} strokeWidth="5" />
        <ellipse cx="60" cy="26" rx="11" ry="16" fill={C.peach} stroke={INK} strokeWidth="5" transform="rotate(72 60 48)" />
        <ellipse cx="60" cy="26" rx="11" ry="16" fill={C.peach} stroke={INK} strokeWidth="5" transform="rotate(144 60 48)" />
        <ellipse cx="60" cy="26" rx="11" ry="16" fill={C.peach} stroke={INK} strokeWidth="5" transform="rotate(216 60 48)" />
        <ellipse cx="60" cy="26" rx="11" ry="16" fill={C.peach} stroke={INK} strokeWidth="5" transform="rotate(288 60 48)" />
        <path d="M60 26a11 16 0 0 1 0 32z" fill={INK} opacity=".14" transform="rotate(144 60 48)" />
        <path d="M60 26a11 16 0 0 1 0 32z" fill={INK} opacity=".14" transform="rotate(72 60 48)" />
        <circle cx="60" cy="48" r="14" fill={C.sand} stroke={INK} strokeWidth="5" />
        <path d="M60 34a14 14 0 0 1 0 28z" fill={INK} opacity=".16" />
      </>
    ),
  },
  car: {
    label: 'voiture',
    draw: (
      <>
        <ellipse cx="60" cy="106" rx="42" ry="5" fill={INK} opacity=".12" />
        <path d="M34 62l11-22a9 9 0 0 1 8-5h14a9 9 0 0 1 8 5l11 22z" fill={C.blue} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 35h7a9 9 0 0 1 8 5l11 22H60z" fill={INK} opacity=".16" />
        <path d="M16 62h88v24a7 7 0 0 1-7 7H23a7 7 0 0 1-7-7z" fill={C.blue} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 62h44v24a7 7 0 0 1-7 7H60z" fill={INK} opacity=".16" />
        <circle cx="36" cy="92" r="12" fill="#fff" stroke={INK} strokeWidth="5" />
        <circle cx="84" cy="92" r="12" fill="#fff" stroke={INK} strokeWidth="5" />
        <g className="picto__fine">
          <circle cx="36" cy="92" r="4" fill={INK} />
          <circle cx="84" cy="92" r="4" fill={INK} />
        </g>
      </>
    ),
  },
  boat: {
    label: 'bateau',
    draw: (
      <>
        <path d="M56 70V22L26 70z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M66 70V28l28 42z" fill={C.blue} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M80 49l14 21H80z" fill={INK} opacity=".18" />
        <path d="M16 72h88l-13 22a9 9 0 0 1-8 5H37a9 9 0 0 1-8-5z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 72h44l-13 22a9 9 0 0 1-8 5H60z" fill={INK} opacity=".16" />
        <g className="picto__fine">
          <path d="M14 108h92" stroke={C.accent} strokeWidth="5" strokeLinecap="round" />
        </g>
      </>
    ),
  },
  book: {
    label: 'livre',
    draw: (
      <>
        <ellipse cx="60" cy="104" rx="40" ry="5" fill={INK} opacity=".12" />
        <path d="M60 34c-11-8-25-10-40-8v56c15-2 29 0 40 8z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 34c11-8 25-10 40-8v56c-15-2-29 0-40 8z" fill={C.lavender} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M74 28c9-2 18-2 26-2v56c-11-1-21-1-30 1z" fill={INK} opacity=".14" />
        <path d="M60 34v56" stroke={INK} strokeWidth="5" />
        <g className="picto__fine">
          <path d="M32 46h18M32 58h18M70 46h18M70 58h18" stroke={INK} strokeWidth="4" strokeLinecap="round" opacity=".5" />
        </g>
      </>
    ),
  },
  scissors: {
    label: 'ciseaux',
    draw: (
      <>
        <ellipse cx="60" cy="110" rx="26" ry="4" fill={INK} opacity=".12" />
        <path d="M36 18l32 54-11 6-30-54z" fill={C.blue} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M84 18L52 72l11 6 30-54z" fill={C.blue} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M84 18L52 72l11 6 30-54z" fill={INK} opacity=".16" />
        <path d="M55 78l-9 8M65 78l9 8" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <circle cx="40" cy="94" r="12" fill="none" stroke={INK} strokeWidth="6" />
        <circle cx="80" cy="94" r="12" fill="none" stroke={INK} strokeWidth="6" />
        <circle cx="60" cy="72" r="6" fill={C.sand} stroke={INK} strokeWidth="4" />
      </>
    ),
  },
  cake: {
    label: 'gâteau',
    draw: (
      <>
        <ellipse cx="60" cy="108" rx="36" ry="5" fill={INK} opacity=".12" />
        <rect x="38" y="36" width="8" height="20" rx="4" fill={C.sand} stroke={INK} strokeWidth="4" />
        <rect x="56" y="32" width="8" height="24" rx="4" fill={C.sand} stroke={INK} strokeWidth="4" />
        <rect x="74" y="36" width="8" height="20" rx="4" fill={C.sand} stroke={INK} strokeWidth="4" />
        <path d="M22 68h76v26a8 8 0 0 1-8 8H30a8 8 0 0 1-8-8z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 68h38v26a8 8 0 0 1-8 8H60z" fill={INK} opacity=".16" />
        <path d="M22 56h76v14q-9 10-19 0-9 10-19 0-9 10-19 0-9 10-19 0z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 56h38v14q-9 10-19 0-9 10-19 0z" fill={INK} opacity=".12" />
        <g className="picto__fine">
          <path d="M42 34q5-7 0-11-5 4 0 11zM60 30q5-7 0-11-5 4 0 11zM78 34q5-7 0-11-5 4 0 11z" fill={C.peachInk} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        </g>
      </>
    ),
  },
  watch: {
    label: 'montre',
    draw: (
      <>
        <ellipse cx="60" cy="112" rx="24" ry="4" fill={INK} opacity=".12" />
        <path d="M44 16h32v24H44zM44 80h32v24H44z" fill={C.lavender} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <circle cx="60" cy="60" r="30" fill="#fff" stroke={INK} strokeWidth="5" />
        <path d="M60 30a30 30 0 0 1 0 60 25 25 0 0 0 0-60z" fill={INK} opacity=".16" />
        <path d="M60 42v18l13 8" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  lamp: {
    label: 'lampe',
    draw: (
      <>
        <ellipse cx="60" cy="110" rx="30" ry="5" fill={INK} opacity=".12" />
        <path d="M60 52v44" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <path d="M34 54h52l-11-32a8 8 0 0 0-8-6H53a8 8 0 0 0-8 6z" fill={C.sand} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 16h7a8 8 0 0 1 8 6l11 32H60z" fill={INK} opacity=".16" />
        <path d="M40 94h40a8 8 0 0 1 8 8v4H32v-4a8 8 0 0 1 8-8z" fill={C.sand} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 94h20a8 8 0 0 1 8 8v4H60z" fill={INK} opacity=".16" />
      </>
    ),
  },
  cloud: {
    label: 'nuage',
    draw: (
      <>
        <path d="M36 88a21 21 0 0 1 1-44 25 25 0 0 1 46-6 19 19 0 0 1 3 50z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M36 88h50a19 19 0 0 0 10-16 32 32 0 0 1-61 2 21 21 0 0 0 1 14z" fill={INK} opacity=".13" />
      </>
    ),
  },
  apple: {
    label: 'pomme',
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
        <ellipse cx="60" cy="106" rx="42" ry="5" fill={INK} opacity=".12" />
        <path d="M22 44h14l11 22 33 8a15 15 0 0 1 12 15v7H22z" fill={C.blue} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 71l20 5a15 15 0 0 1 12 14v6H60z" fill={INK} opacity=".16" />
        <path d="M18 92h84a5 5 0 0 1 0 10H18a5 5 0 0 1 0-10z" fill="#fff" stroke={INK} strokeWidth="5" />
        <g className="picto__fine">
          <path d="M40 54l14 7M35 65l16 7" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </g>
      </>
    ),
  },
  suitcase: {
    label: 'valise',
    draw: (
      <>
        <ellipse cx="60" cy="106" rx="38" ry="5" fill={INK} opacity=".12" />
        <path d="M46 34v-6a9 9 0 0 1 9-9h10a9 9 0 0 1 9 9v6" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <rect x="18" y="34" width="84" height="66" rx="10" fill={C.peach} stroke={INK} strokeWidth="5" />
        <path d="M60 34h32a10 10 0 0 1 10 10v46a10 10 0 0 1-10 10H60z" fill={INK} opacity=".16" />
        <path d="M18 78h84" stroke={INK} strokeWidth="5" />
        <rect x="51" y="48" width="18" height="16" rx="4" fill={C.sand} stroke={INK} strokeWidth="4.5" />
      </>
    ),
  },
  bell: {
    label: 'cloche',
    draw: (
      <>
        <ellipse cx="60" cy="108" rx="32" ry="5" fill={INK} opacity=".12" />
        <path d="M60 16a9 9 0 0 1 9 9 31 31 0 0 1 17 27c0 19 6 27 10 34H24c4-7 10-15 10-34a31 31 0 0 1 17-27 9 9 0 0 1 9-9z" fill={C.sand} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 16a9 9 0 0 1 9 9 31 31 0 0 1 17 27c0 19 6 27 10 34H60z" fill={INK} opacity=".16" />
        <path d="M48 86h24a12 12 0 0 1-24 0z" fill={C.sandInk} stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
      </>
    ),
  },
  ladder: {
    label: 'échelle',
    draw: (
      <>
        <ellipse cx="60" cy="110" rx="36" ry="4" fill={INK} opacity=".12" />
        <rect x="24" y="14" width="13" height="92" rx="6" fill={C.peach} stroke={INK} strokeWidth="5" />
        <path d="M32 14h5v92h-5z" fill={INK} opacity=".18" />
        <rect x="83" y="14" width="13" height="92" rx="6" fill={C.peach} stroke={INK} strokeWidth="5" />
        <path d="M91 14h5v92h-5z" fill={INK} opacity=".18" />
        <rect x="35" y="28" width="50" height="11" rx="5" fill={C.peach} stroke={INK} strokeWidth="5" />
        <rect x="35" y="54" width="50" height="11" rx="5" fill={C.peach} stroke={INK} strokeWidth="5" />
        <rect x="35" y="80" width="50" height="11" rx="5" fill={C.peach} stroke={INK} strokeWidth="5" />
      </>
    ),
  },
  phone: {
    label: 'téléphone',
    draw: (
      <>
        <ellipse cx="60" cy="112" rx="26" ry="4" fill={INK} opacity=".12" />
        <rect x="33" y="12" width="54" height="94" rx="13" fill={C.lavender} stroke={INK} strokeWidth="5" />
        <path d="M60 12h14a13 13 0 0 1 13 13v68a13 13 0 0 1-13 13H60z" fill={INK} opacity=".16" />
        <rect x="43" y="28" width="34" height="58" rx="5" fill="#fff" stroke={INK} strokeWidth="4.5" />
        <g className="picto__fine">
          <circle cx="60" cy="96" r="5" fill="none" stroke={INK} strokeWidth="4" />
          <path d="M52 20h16" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </g>
      </>
    ),
  },
  drum: {
    label: 'tambour',
    draw: (
      <>
        <ellipse cx="60" cy="108" rx="34" ry="5" fill={INK} opacity=".12" />
        <path d="M22 52h76v32a38 14 0 0 1-76 0z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 52h38v32a38 14 0 0 1-38 14z" fill={INK} opacity=".16" />
        <ellipse cx="60" cy="52" rx="38" ry="14" fill="#fff" stroke={INK} strokeWidth="5" />
        <g className="picto__fine">
          <path d="M28 62l14 22M60 66v22M92 62L78 84" stroke={INK} strokeWidth="4" strokeLinecap="round" opacity=".45" />
        </g>
        <path d="M82 20L66 44" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <circle cx="85" cy="16" r="7" fill={C.sandInk} stroke={INK} strokeWidth="4" />
      </>
    ),
  },
  whistle: {
    label: 'sifflet',
    draw: (
      <>
        <ellipse cx="60" cy="104" rx="30" ry="5" fill={INK} opacity=".12" />
        <path d="M12 58h30v20H12a4 4 0 0 1-4-4v-12a4 4 0 0 1 4-4z" fill={C.sand} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <rect x="34" y="46" width="54" height="44" rx="20" fill={C.sand} stroke={INK} strokeWidth="5" />
        <path d="M61 46h7a20 20 0 0 1 20 20v4a20 20 0 0 1-20 20h-7z" fill={INK} opacity=".16" />
        <circle cx="66" cy="60" r="8" fill="#fff" stroke={INK} strokeWidth="4.5" />
        <circle cx="96" cy="38" r="10" fill="none" stroke={INK} strokeWidth="5" />
      </>
    ),
  },
  cat: {
    label: 'chat',
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
        <ellipse cx="60" cy="110" rx="30" ry="5" fill={INK} opacity=".12" />
        <path d="M32 40c-10 0-17 12-17 26s8 25 18 25c7 0 11-6 11-15V48z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M88 40c10 0 17 12 17 26s-8 25-18 25c-7 0-11-6-11-15V48z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M88 44c8 5 12 14 12 23s-5 20-13 23c8-7 10-15 10-23s-3-18-9-23z" fill={INK} opacity=".16" />
        <path d="M60 22c18 0 30 14 30 30 0 22-13 42-30 42S30 74 30 52c0-16 12-30 30-30z" fill={C.sand} stroke={INK} strokeWidth="5" />
        <path d="M75 28c9 6 15 16 15 24 0 22-13 42-30 42 24 0 27-24 27-42 0-9-4-18-12-24z" fill={INK} opacity=".16" />
        <path d="M60 62c12 0 21 7 21 16s-9 17-21 17-21-8-21-17 9-16 21-16z" fill="#fff" stroke={INK} strokeWidth="4.5" />
        <circle cx="48" cy="48" r="5" fill={INK} />
        <circle cx="72" cy="48" r="5" fill={INK} />
        <ellipse cx="60" cy="70" rx="9" ry="6.5" fill={INK} />
        <path d="M60 77v5" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M48 82q6 9 12 0 6 9 12 0" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      </>
    ),
  },
  bird: {
    label: 'oiseau',
    draw: (
      <>
        <ellipse cx="60" cy="112" rx="26" ry="4" fill={INK} opacity=".12" />
        <path d="M52 88v16M70 88v16M45 104h13M64 104h13" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M12 38l34 24-32 12z" fill={C.blue} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M56 34c18 0 31 13 31 29S74 92 56 92 25 79 25 63s13-29 31-29z" fill={C.blue} stroke={INK} strokeWidth="5" />
        <path d="M70 38c11 6 17 14 17 25 0 16-13 29-31 29 22 0 27-15 27-29 0-11-4-19-13-25z" fill={INK} opacity=".16" />
        <circle cx="81" cy="33" r="16" fill={C.blue} stroke={INK} strokeWidth="5" />
        <path d="M81 17a16 16 0 0 1 0 32 12 12 0 0 0 0-32z" fill={INK} opacity=".14" />
        <path d="M96 28l15 6-15 7z" fill={C.sand} stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
        <path d="M42 58q18-10 30 5-15 12-30-5z" fill="#fff" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
        <circle cx="85" cy="29" r="4.5" fill={INK} />
      </>
    ),
  },
  cow: {
    label: 'vache',
    draw: (
      <>
        <ellipse cx="60" cy="110" rx="32" ry="5" fill={INK} opacity=".12" />
        <path d="M30 42c-10-4-17 3-14 11 3 9 11 11 18 8z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M90 42c10-4 17 3 14 11-3 9-11 11-18 8z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M38 32q-9-16 2-16t9 11" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M82 32q9-16-2-16t-9 11" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M60 24c20 0 32 15 32 32 0 20-14 36-32 36S28 76 28 56c0-17 12-32 32-32z" fill="#fff" stroke={INK} strokeWidth="5" />
        <path d="M76 30c10 6 16 16 16 26 0 20-14 36-32 36 24 0 28-20 28-36 0-10-4-20-12-26z" fill={INK} opacity=".13" />
        <path d="M38 40q11-7 17 2-11 9-17-2z" fill={INK} opacity=".55" />
        <path d="M60 64c14 0 23 6 23 15s-10 15-23 15-23-6-23-15 9-15 23-15z" fill={C.peach} stroke={INK} strokeWidth="5" />
        <circle cx="50" cy="50" r="5" fill={INK} />
        <circle cx="72" cy="50" r="5" fill={INK} />
        <g className="picto__fine">
          <circle cx="52" cy="78" r="4" fill={INK} />
          <circle cx="68" cy="78" r="4" fill={INK} />
        </g>
      </>
    ),
  },
  horse: {
    label: 'cheval',
    draw: (
      <>
        <ellipse cx="60" cy="110" rx="32" ry="5" fill={INK} opacity=".12" />
        <path d="M50 18l-6-16 18 8z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M74 18l8-16 8 15z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M40 104V80c0-10 4-17 11-21L24 55c-9-1-11-10-5-16l26-10c4-10 12-16 22-16 16 0 26 12 28 30l4 32c1 12 0 21 0 29z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M67 13c16 0 26 12 28 30l4 32c1 12 0 21 0 29H72V58c0-20-1-35-5-45z" fill={INK} opacity=".16" />
        <path d="M72 16c10 5 16 15 18 29l4 25" fill="none" stroke={C.sandInk} strokeWidth="8" strokeLinecap="round" />
        <circle cx="66" cy="38" r="5" fill={INK} />
        <path d="M20 50h14" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
        <g className="picto__fine">
          <ellipse cx="29" cy="42" rx="5" ry="4" fill={INK} />
        </g>
      </>
    ),
  },
  gift: {
    label: 'cadeau',
    draw: (
      <>
        <ellipse cx="60" cy="108" rx="36" ry="5" fill={INK} opacity=".12" />
        <rect x="20" y="48" width="80" height="54" rx="8" fill={C.lavender} stroke={INK} strokeWidth="5" />
        <path d="M60 48h32a8 8 0 0 1 8 8v38a8 8 0 0 1-8 8H60z" fill={INK} opacity=".16" />
        <rect x="14" y="32" width="92" height="18" rx="6" fill={C.sand} stroke={INK} strokeWidth="5" />
        <path d="M60 32h40a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H60z" fill={INK} opacity=".14" />
        <rect x="51" y="32" width="18" height="70" fill={C.peach} stroke={INK} strokeWidth="5" />
        <path d="M60 30c-11-15-27-12-25-2 2 9 15 8 25 2zM60 30c11-15 27-12 25-2-2 9-15 8-25 2z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      </>
    ),
  },
  sun: {
    label: 'soleil',
    draw: (
      <>
        <g stroke={INK} strokeWidth="6" strokeLinecap="round">
          <path d="M60 14v14M60 92v14M106 60H92M28 60H14" />
          <path d="M93 27l-10 10M37 83l-10 10M93 93l-10-10M37 37l-10-10" />
        </g>
        <circle cx="60" cy="60" r="26" fill={C.sand} stroke={INK} strokeWidth="5" />
        <path d="M60 34a26 26 0 0 1 0 52 20 20 0 0 0 0-52z" fill={INK} opacity=".16" />
      </>
    ),
  },
  carrot: {
    label: 'carotte',
    draw: (
      <>
        <ellipse cx="60" cy="108" rx="26" ry="4" fill={INK} opacity=".12" />
        <path d="M50 20q4 10 2 18M60 16q3 12 0 20M70 20q-4 10-2 18" fill="none" stroke={C.sage} strokeWidth="6" strokeLinecap="round" />
        <path d="M60 38c14 0 22 10 18 34-3 20-10 34-18 34s-15-14-18-34c-4-24 4-34 18-34z" fill={C.peach} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M65 40c10 3 15 13 12 32-3 20-10 34-18 34 10-4 14-18 16-34 2-14 0-25-10-32z" fill={INK} opacity=".16" />
        <g className="picto__fine" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity=".45">
          <path d="M48 56h8M46 68h9M48 80h7" />
        </g>
      </>
    ),
  },
  cheese: {
    label: 'fromage',
    draw: (
      <>
        <ellipse cx="60" cy="100" rx="38" ry="5" fill={INK} opacity=".12" />
        <path d="M24 92L58 24q2-4 4 0l34 68z" fill={C.sand} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M62 24q2-4 4 0l34 68H62z" fill={INK} opacity=".16" />
        <circle cx="52" cy="62" r="6" fill="#fff" stroke={INK} strokeWidth="3.5" />
        <circle cx="70" cy="76" r="8" fill="#fff" stroke={INK} strokeWidth="3.5" />
        <circle cx="46" cy="80" r="5" fill="#fff" stroke={INK} strokeWidth="3.5" />
      </>
    ),
  },
  envelope: {
    label: 'enveloppe',
    draw: (
      <>
        <ellipse cx="60" cy="104" rx="40" ry="5" fill={INK} opacity=".12" />
        <rect x="18" y="38" width="84" height="58" rx="8" fill={C.blue} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 38h34a8 8 0 0 1 8 8v42a8 8 0 0 1-8 8H60z" fill={INK} opacity=".16" />
        <path d="M20 40l40 32 40-32" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  leaf: {
    label: 'feuille',
    draw: (
      <>
        <ellipse cx="60" cy="106" rx="22" ry="4" fill={INK} opacity=".12" />
        <path d="M60 20c30 6 42 34 28 62-14 26-46 26-46 0C42 62 40 34 60 20z" fill={C.sage} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 20c30 6 42 34 28 62-8 15-24 21-34 18 14-6 24-20 24-40 0-16-8-32-18-40z" fill={INK} opacity=".16" />
        <path d="M60 30v70" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <g className="picto__fine" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity=".4">
          <path d="M60 46l14 8M60 64l16 8M60 46l-14 8M60 64l-16 8" />
        </g>
      </>
    ),
  },
}

export const PICTOGRAMS = Object.entries(DRAWINGS).map(([id, { label }]) => ({ id, label }))

/** Renders one drawing. `size` is a CSS length (pixels by default). */
export function Pictogram({ id, size = 72, title }) {
  const drawing = DRAWINGS[id]
  if (!drawing) return null

  return (
    <svg
      className={`picto${size < 64 ? ' picto--small' : ''}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
    >
      {drawing.draw}
    </svg>
  )
}
