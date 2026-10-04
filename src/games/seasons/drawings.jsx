/**
 * The pictures of « Les quatre saisons »: objects to place in a season and
 * four landscapes.
 *
 * Objects follow the shared illustration rule (flat colour, one shadow plane
 * on the right, a 5 unit outline, a ground ellipse) on a 120 by 120 grid. The
 * ones the shared bank already has — sun, flower, mushroom — are
 * borrowed from it; the others are drawn here, as they only make sense in
 * this game. Landscapes are drawn on a 240 by 150 grid.
 */
import { Pictogram } from '../../lib/pictograms.jsx'

const INK = '#33303a'
const PEACH = '#f6bdab'
const SAGE = '#b9d8c2'
const SAND = '#f4dfa8'
const BLUE = '#a8c8ec'
const LAVENDER = '#cdc3ec'
const WHITE = '#fbfaf8'
const ORANGE = '#f0b27a'
const BROWN = '#c9a27c'

const shadow = <ellipse cx="60" cy="108" rx="30" ry="5" fill={INK} opacity=".12" />
const line = { stroke: INK, strokeWidth: 5, strokeLinejoin: 'round', strokeLinecap: 'round' }

/** Drawn objects. `season` is the index in SEASONS (0 = spring). */
const OBJECTS = {
  egg: {
    label: 'œuf de Pâques',
    draw: (
      <>
        {shadow}
        <path d="M60 14c20 0 34 30 34 54 0 22-14 34-34 34S26 90 26 68c0-24 14-54 34-54z" fill={LAVENDER} {...line} />
        <path d="M60 14c20 0 34 30 34 54 0 22-14 34-34 34 18-8 22-30 20-50-1-16-8-30-20-38z" fill={INK} opacity=".16" />
        <path d="M30 62q15 12 30 0t30 0M32 82q14 10 28 0t28 0" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  butterfly: {
    label: 'papillon',
    draw: (
      <>
        {shadow}
        <path d="M58 56C40 18 10 26 18 56c4 14 22 12 40 4zM62 56c18-38 48-30 40 0-4 14-22 12-40 4z" fill={PEACH} {...line} />
        <path d="M58 64C34 62 24 82 38 92c10 6 20-8 20-28zM62 64c24-2 34 18 20 28-10 6-20-8-20-28z" fill={SAND} {...line} />
        <path d="M60 36v56" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <path d="M60 38c-4-12-10-16-14-18M60 38c4-12 10-16 14-18" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      </>
    ),
  },
  'ice-cream': {
    label: 'glace',
    draw: (
      <>
        {shadow}
        <path d="M40 58h40L60 106z" fill={SAND} {...line} />
        <path d="M60 58h20L60 106z" fill={INK} opacity=".16" />
        <path d="M40 58c-6-18 6-34 20-34s26 16 20 34z" fill={PEACH} {...line} />
        <path d="M60 24c14 0 26 16 20 34H60z" fill={INK} opacity=".16" />
        <g className="picto__fine" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity=".4">
          <path d="M48 66l16 30M64 62l-12 28" />
        </g>
      </>
    ),
  },
  sunglasses: {
    label: 'lunettes de soleil',
    draw: (
      <>
        <ellipse cx="60" cy="96" rx="40" ry="5" fill={INK} opacity=".12" />
        <path d="M20 52c0-6 4-10 10-10M100 52c0-6-4-10-10-10" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M18 50h38c0 22-8 36-20 36S18 74 18 50zM64 50h38c0 22-8 36-20 36S64 74 64 50z" fill="#4a5a82" {...line} />
        <path d="M54 52q6-6 12 0" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M24 56l10 14M70 56l10 14" stroke={WHITE} strokeWidth="4" strokeLinecap="round" opacity=".55" />
      </>
    ),
  },
  watermelon: {
    label: 'pastèque',
    draw: (
      <>
        {shadow}
        <path d="M14 48h92c0 34-20 56-46 56S14 82 14 48z" fill={SAGE} {...line} />
        <path d="M22 48h76c0 28-16 44-38 44S22 76 22 48z" fill="#ee8c8c" />
        <path d="M60 48h38c0 28-16 44-38 44z" fill={INK} opacity=".16" />
        <g fill={INK}>
          <ellipse cx="44" cy="62" rx="3" ry="5" />
          <ellipse cx="62" cy="72" rx="3" ry="5" />
          <ellipse cx="78" cy="60" rx="3" ry="5" />
        </g>
        <path d="M14 48h92" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      </>
    ),
  },
  'autumn-leaf': {
    label: 'feuille d’arbre',
    draw: (
      <>
        <ellipse cx="60" cy="106" rx="24" ry="4" fill={INK} opacity=".12" />
        <path d="M60 14c8 14 22 14 28 10-2 14 0 24 10 28-10 4-12 12-8 22-10-4-18 0-18 10-6-4-8-8-12-8s-6 4-12 8c0-10-8-14-18-10 4-10 2-18-8-22 10-4 12-14 10-28 6 4 20 4 28-10z" fill="#d9822b" {...line} />
        <path d="M60 14c8 14 22 14 28 10-2 14 0 24 10 28-10 4-12 12-8 22-10-4-18 0-18 10-6-4-8-8-12-8z" fill={INK} opacity=".16" />
        <path d="M60 36v66" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  pumpkin: {
    label: 'citrouille',
    draw: (
      <>
        {shadow}
        <path d="M60 28c-28-8-46 10-46 36s18 38 46 38 46-12 46-38-18-44-46-36z" fill={ORANGE} {...line} />
        <path d="M60 28c28-8 46 10 46 36s-18 38-46 38c14-8 20-24 20-38S74 36 60 28z" fill={INK} opacity=".16" />
        <path d="M60 28c-10 12-12 54 0 74M36 36c-12 16-8 46 6 62" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" opacity=".5" />
        <path d="M58 28c0-8 2-14 8-18" fill="none" stroke="#2f6b4c" strokeWidth="7" strokeLinecap="round" />
      </>
    ),
  },
  chestnut: {
    label: 'châtaigne',
    draw: (
      <>
        {shadow}
        <path d="M60 34c26 0 40 22 38 44-2 16-16 26-38 26S24 94 22 78c-2-22 12-44 38-44z" fill="#b0714a" {...line} />
        <path d="M60 34c26 0 40 22 38 44-2 16-16 26-38 26 14-10 18-34 12-54-2-8-6-12-12-16z" fill={INK} opacity=".16" />
        <path d="M34 44c4-14 16-22 26-22s22 8 26 22c-10-6-18-4-26 0-8-4-16-6-26 0z" fill={BROWN} {...line} />
      </>
    ),
  },
  snowman: {
    label: 'bonhomme de neige',
    draw: (
      <>
        <ellipse cx="60" cy="108" rx="34" ry="5" fill={INK} opacity=".12" />
        <circle cx="60" cy="80" r="26" fill={WHITE} {...line} />
        <circle cx="60" cy="42" r="19" fill={WHITE} {...line} />
        <path d="M60 23a19 19 0 0 1 0 38 14 14 0 0 0 0-38zM60 54a26 26 0 0 1 0 52 20 20 0 0 0 0-52z" fill={INK} opacity=".12" />
        <path d="M44 28h32M50 28v-12h20v12" fill="#4a5a82" {...line} />
        <path d="M58 44l16 4-16 4z" fill={ORANGE} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <g fill={INK}>
          <circle cx="53" cy="38" r="2.6" />
          <circle cx="67" cy="38" r="2.6" />
          <circle cx="60" cy="72" r="2.8" />
          <circle cx="60" cy="84" r="2.8" />
        </g>
      </>
    ),
  },
  mitten: {
    label: 'moufle',
    draw: (
      <>
        {shadow}
        <path d="M34 106V58C22 52 20 36 30 34c8 0 12 10 14 18V30c0-10 8-16 18-16s18 6 18 16v76z" fill="#d07a7a" {...line} />
        <path d="M62 14c10 0 18 6 18 16v76H62z" fill={INK} opacity=".16" />
        <path d="M32 84h50v18H32z" fill={WHITE} {...line} />
      </>
    ),
  },
  beanie: {
    label: 'bonnet',
    draw: (
      <>
        {shadow}
        <path d="M22 76C22 42 40 22 60 22s38 20 38 54z" fill="#6f8fc8" {...line} />
        <path d="M60 22c20 0 38 20 38 54H60z" fill={INK} opacity=".16" />
        <rect x="16" y="76" width="88" height="22" rx="10" fill={WHITE} {...line} />
        <circle cx="60" cy="16" r="10" fill={WHITE} {...line} />
        <g className="picto__fine" stroke={INK} strokeWidth="3" opacity=".35" strokeLinecap="round">
          <path d="M34 80v14M48 80v14M62 80v14M76 80v14M90 80v14" />
        </g>
      </>
    ),
  },
  snowflake: {
    label: 'flocon de neige',
    draw: (
      <>
        <g stroke={INK} strokeWidth="14" strokeLinecap="round">
          <path d="M60 14v92M20 37l80 46M20 83l80-46" />
        </g>
        <g stroke="#cfe4f7" strokeWidth="6" strokeLinecap="round">
          <path d="M60 14v92M20 37l80 46M20 83l80-46" />
        </g>
        <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M50 24l10 10 10-10M50 96l10-10 10 10" />
        </g>
        <circle cx="60" cy="60" r="8" fill={WHITE} stroke={INK} strokeWidth="5" />
      </>
    ),
  },
}

/** Which objects belong to which season (index in SEASONS). Borrowed ones
 * are drawn by the shared bank under the same id. */
export const BORROWED = { flower: 'fleur', sun: 'soleil', mushroom: 'champignon' }

export const OBJECT_SEASONS = [
  ['flower', 'egg', 'butterfly'],
  ['sun', 'ice-cream', 'sunglasses', 'watermelon'],
  ['autumn-leaf', 'mushroom', 'pumpkin', 'chestnut'],
  ['snowman', 'mitten', 'beanie', 'snowflake'],
]

export function objectLabel(id) {
  return BORROWED[id] ?? OBJECTS[id].label
}

export function SeasonObject({ id, size = 120 }) {
  if (BORROWED[id]) return <Pictogram id={id} size={size} />
  return (
    <svg className="picto" width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      {OBJECTS[id].draw}
    </svg>
  )
}

const ground = (fill) => <path d="M0 108Q60 92 120 104T240 98V150H0z" fill={fill} stroke={INK} strokeWidth="5" strokeLinejoin="round" />

function Trunk({ x, h = 44 }) {
  return <path d={`M${x} 104v-${h}`} stroke={INK} strokeWidth="9" strokeLinecap="round" />
}

const SCENES = [
  // Spring: fresh green hill, blossoming tree, flowers, a light shower of sun.
  <>
    <rect width="240" height="150" fill="#dcecf8" />
    <circle cx="200" cy="34" r="16" fill={SAND} stroke={INK} strokeWidth="5" />
    {ground('#b9d8c2')}
    <Trunk x={70} />
    <circle cx="70" cy="46" r="26" fill="#f7cfd8" stroke={INK} strokeWidth="5" />
    <circle cx="58" cy="40" r="4" fill="#fff" />
    <circle cx="80" cy="50" r="4" fill="#fff" />
    <circle cx="72" cy="34" r="4" fill="#fff" />
    {[130, 156, 182, 208].map((x, i) => (
      <g key={x}>
        <path d={`M${x} 124v-14`} stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <circle cx={x} cy="106" r="7" fill={i % 2 ? PEACH : '#fff'} stroke={INK} strokeWidth="4" />
      </g>
    ))}
  </>,
  // Summer: strong sun, golden field, sea.
  <>
    <rect width="240" height="150" fill="#bfe0f5" />
    <circle cx="120" cy="40" r="22" fill="#f7d36b" stroke={INK} strokeWidth="5" />
    <g stroke={INK} strokeWidth="5" strokeLinecap="round">
      <path d="M120 6v8M120 66v8M86 40h8M146 40h8M96 16l6 6M138 58l6 6M144 16l-6 6M102 58l-6 6" />
    </g>
    <path d="M0 96h240v10H0z" fill="#7fb4e0" stroke={INK} strokeWidth="5" />
    {ground('#f4dfa8')}
    <path d="M168 130q10-18 28-14" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <path d="M48 134v-26" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <path d="M24 108a24 18 0 0 1 48 0z" fill={PEACH} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
  </>,
  // Autumn: orange trees, falling leaves, leaves on the ground.
  <>
    <rect width="240" height="150" fill="#e6e9ef" />
    <path d="M30 30q18-10 40 0t40 0" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" opacity=".35" />
    {ground('#e3b985')}
    <Trunk x={78} />
    <circle cx="78" cy="50" r="28" fill={ORANGE} stroke={INK} strokeWidth="5" />
    <Trunk x={168} h={38} />
    <circle cx="168" cy="54" r="24" fill="#e0a05a" stroke={INK} strokeWidth="5" />
    <g fill="#c8743c" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
      <path d="M118 66l8 6-4 10-8-6z" />
      <path d="M126 96l8 6-4 10-8-6z" />
      <path d="M28 120l8 6-4 10-8-6z" />
      <path d="M204 118l8 6-4 10-8-6z" />
    </g>
  </>,
  // Winter: white ground, bare tree, snow.
  <>
    <rect width="240" height="150" fill="#d5e2f0" />
    {ground('#fbfaf8')}
    <Trunk x={80} h={58} />
    <path d="M80 62l-22-20M80 74l24-22M80 52l-10-22M80 52l12-20" stroke={INK} strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M142 124a20 12 0 0 1 40 0z" fill="#e8eef6" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <g fill="#fff" stroke={INK} strokeWidth="3">
      <circle cx="30" cy="30" r="4" />
      <circle cx="120" cy="22" r="4" />
      <circle cx="170" cy="48" r="4" />
      <circle cx="210" cy="26" r="4" />
      <circle cx="40" cy="70" r="4" />
      <circle cx="150" cy="80" r="4" />
    </g>
  </>,
]

export function Landscape({ season }) {
  return (
    <svg className="season-scene" viewBox="0 0 240 150" role="img" aria-label="Un paysage">
      {SCENES[season]}
    </svg>
  )
}
