/**
 * Pictogrammes dessinés pour les jeux de mémoire visuelle.
 *
 * Objets concrets et facilement nommables, tracés en aplats pastel : ils
 * peuvent être mémorisés visuellement ou verbalisés, ce qui laisse au
 * praticien le choix de la stratégie travaillée.
 */
const P = {
  peche: '#f6bdab',
  sauge: '#b9d8c2',
  lavande: '#cdc3ec',
  sable: '#f4dfa8',
  bleu: '#a8c8ec',
  trait: '#5c5566',
}

const DESSINS = {
  maison: {
    label: 'maison',
    draw: (
      <>
        <path d="M12 30L32 13l20 17v21a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3z" fill={P.peche} />
        <path d="M8 31L32 10l24 21" fill="none" stroke={P.trait} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="27" y="40" width="12" height="14" rx="2" fill={P.trait} opacity=".75" />
      </>
    ),
  },
  arbre: {
    label: 'arbre',
    draw: (
      <>
        <circle cx="32" cy="26" r="17" fill={P.sauge} />
        <circle cx="21" cy="34" r="10" fill={P.sauge} />
        <circle cx="43" cy="34" r="10" fill={P.sauge} />
        <rect x="28" y="38" width="8" height="18" rx="3" fill={P.trait} opacity=".75" />
      </>
    ),
  },
  poisson: {
    label: 'poisson',
    draw: (
      <>
        <path d="M40 32c0 9-8 15-17 15S8 41 8 32s6-15 15-15 17 6 17 15z" fill={P.bleu} />
        <path d="M40 32l16-11v22z" fill={P.bleu} />
        <circle cx="18" cy="28" r="3" fill={P.trait} />
      </>
    ),
  },
  cle: {
    label: 'clé',
    draw: (
      <>
        <circle cx="20" cy="26" r="12" fill="none" stroke={P.sable} strokeWidth="7" />
        <path d="M28 34l24 22" stroke={P.sable} strokeWidth="7" strokeLinecap="round" />
        <path d="M44 42l-7 7M50 48l-6 6" stroke={P.trait} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  tasse: {
    label: 'tasse',
    draw: (
      <>
        <path d="M14 22h30v20a12 12 0 0 1-12 12h-6a12 12 0 0 1-12-12z" fill={P.peche} />
        <path d="M44 27h6a7 7 0 0 1 0 14h-6" fill="none" stroke={P.trait} strokeWidth="3.5" />
        <rect x="14" y="22" width="30" height="6" fill={P.trait} opacity=".25" />
      </>
    ),
  },
  parapluie: {
    label: 'parapluie',
    draw: (
      <>
        <path d="M8 34a24 24 0 0 1 48 0z" fill={P.lavande} />
        <path d="M8 34a12 12 0 0 1 24 0 12 12 0 0 1 24 0" fill="none" stroke={P.trait} strokeWidth="3" />
        <path d="M32 34v16a6 6 0 0 0 12 0" fill="none" stroke={P.trait} strokeWidth="3.5" strokeLinecap="round" />
      </>
    ),
  },
  ballon: {
    label: 'ballon',
    draw: (
      <>
        <circle cx="32" cy="30" r="18" fill={P.peche} />
        <path d="M32 12c8 10 8 26 0 36M14 30h36" fill="none" stroke={P.trait} strokeWidth="3" />
        <path d="M32 48v9" stroke={P.trait} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  etoile: {
    label: 'étoile',
    draw: <path d="M32 10l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill={P.sable} stroke={P.trait} strokeWidth="3" strokeLinejoin="round" />,
  },
  lune: {
    label: 'lune',
    draw: <path d="M42 12a22 22 0 1 0 10 30A24 24 0 0 1 42 12z" fill={P.bleu} stroke={P.trait} strokeWidth="3" strokeLinejoin="round" />,
  },
  fleur: {
    label: 'fleur',
    draw: (
      <>
        <g fill={P.lavande}>
          <circle cx="32" cy="16" r="9" /><circle cx="46" cy="27" r="9" />
          <circle cx="41" cy="42" r="9" /><circle cx="23" cy="42" r="9" /><circle cx="18" cy="27" r="9" />
        </g>
        <circle cx="32" cy="30" r="7" fill={P.sable} />
        <path d="M32 44v14" stroke={P.trait} strokeWidth="3.5" strokeLinecap="round" />
      </>
    ),
  },
  voiture: {
    label: 'voiture',
    draw: (
      <>
        <path d="M10 40l5-13a5 5 0 0 1 5-3h24a5 5 0 0 1 5 3l5 13v6H10z" fill={P.bleu} />
        <circle cx="20" cy="47" r="6" fill={P.trait} />
        <circle cx="44" cy="47" r="6" fill={P.trait} />
        <path d="M18 38l3-9h22l3 9z" fill="#fff" opacity=".7" />
      </>
    ),
  },
  bateau: {
    label: 'bateau',
    draw: (
      <>
        <path d="M32 8l16 26H32z" fill={P.peche} />
        <path d="M30 8v26H16z" fill={P.sable} />
        <path d="M10 40h44l-7 13H17z" fill={P.trait} opacity=".8" />
      </>
    ),
  },
  livre: {
    label: 'livre',
    draw: (
      <>
        <path d="M32 18c-6-5-14-5-20-3v30c6-2 14-2 20 3z" fill={P.sauge} />
        <path d="M32 18c6-5 14-5 20-3v30c-6-2-14-2-20 3z" fill={P.bleu} />
        <path d="M32 18v30" stroke={P.trait} strokeWidth="3" />
      </>
    ),
  },
  ciseaux: {
    label: 'ciseaux',
    draw: (
      <>
        <path d="M18 14l28 30M46 14L18 44" stroke={P.trait} strokeWidth="4" strokeLinecap="round" />
        <circle cx="18" cy="50" r="7" fill="none" stroke={P.peche} strokeWidth="5" />
        <circle cx="46" cy="50" r="7" fill="none" stroke={P.peche} strokeWidth="5" />
      </>
    ),
  },
  gateau: {
    label: 'gâteau',
    draw: (
      <>
        <rect x="12" y="30" width="40" height="24" rx="5" fill={P.peche} />
        <rect x="12" y="36" width="40" height="6" fill="#fff" opacity=".65" />
        <path d="M22 30v-8M32 30v-8M42 30v-8" stroke={P.trait} strokeWidth="3" strokeLinecap="round" />
        <g fill={P.sable}>
          <circle cx="22" cy="18" r="4" /><circle cx="32" cy="18" r="4" /><circle cx="42" cy="18" r="4" />
        </g>
      </>
    ),
  },
  montre: {
    label: 'montre',
    draw: (
      <>
        <circle cx="32" cy="32" r="17" fill={P.sable} stroke={P.trait} strokeWidth="3.5" />
        <path d="M32 22v11l8 5" fill="none" stroke={P.trait} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 16l2-8h12l2 8M24 48l2 8h12l2-8" fill={P.lavande} />
      </>
    ),
  },
  lampe: {
    label: 'lampe',
    draw: (
      <>
        <path d="M32 10a14 14 0 0 1 8 25c-2 2-3 4-3 6H27c0-2-1-4-3-6a14 14 0 0 1 8-25z" fill={P.sable} />
        <rect x="27" y="45" width="10" height="8" rx="3" fill={P.trait} opacity=".75" />
        <path d="M32 4v-2M50 14l2-2M14 14l-2-2" stroke={P.trait} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  nuage: {
    label: 'nuage',
    draw: (
      <>
        <path d="M20 42a10 10 0 0 1 0-20 14 14 0 0 1 26-3 9 9 0 0 1 2 23z" fill={P.bleu} />
        <path d="M24 50l-3 6M34 50l-3 6M44 50l-3 6" stroke={P.trait} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  pomme: {
    label: 'pomme',
    draw: (
      <>
        <path d="M32 20c8-6 22-2 22 12s-12 22-22 22S10 46 10 32 24 14 32 20z" fill={P.peche} />
        <path d="M32 20c0-6 3-10 8-11" fill="none" stroke={P.trait} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M32 14c5-4 11-3 11-3s-1 6-7 7" fill={P.sauge} />
      </>
    ),
  },
  chaussure: {
    label: 'chaussure',
    draw: (
      <>
        <path d="M10 42V24h10l8 8h16a10 10 0 0 1 10 10v4H14a4 4 0 0 1-4-4z" fill={P.lavande} />
        <path d="M10 40h44" stroke={P.trait} strokeWidth="3" />
        <path d="M28 32l4 6M36 32l4 6" stroke={P.trait} strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  },
  valise: {
    label: 'valise',
    draw: (
      <>
        <rect x="10" y="24" width="44" height="28" rx="6" fill={P.sauge} />
        <path d="M24 24v-5a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v5" fill="none" stroke={P.trait} strokeWidth="3.5" />
        <rect x="10" y="34" width="44" height="6" fill={P.trait} opacity=".25" />
      </>
    ),
  },
  cloche: {
    label: 'cloche',
    draw: (
      <>
        <path d="M32 12a14 14 0 0 1 14 14v12l4 6H14l4-6V26a14 14 0 0 1 14-14z" fill={P.sable} />
        <circle cx="32" cy="50" r="5" fill={P.trait} opacity=".8" />
        <path d="M32 12V8" stroke={P.trait} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  echelle: {
    label: 'échelle',
    draw: (
      <>
        <path d="M20 8v48M44 8v48" stroke={P.peche} strokeWidth="6" strokeLinecap="round" />
        <path d="M20 20h24M20 32h24M20 44h24" stroke={P.trait} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  cadeau: {
    label: 'cadeau',
    draw: (
      <>
        <rect x="12" y="26" width="40" height="28" rx="4" fill={P.lavande} />
        <rect x="10" y="18" width="44" height="10" rx="3" fill={P.bleu} />
        <path d="M32 18V54" stroke={P.trait} strokeWidth="4" />
        <path d="M32 18c-8-10-18-2-8 4M32 18c8-10 18-2 8 4" fill="none" stroke={P.trait} strokeWidth="3.5" />
      </>
    ),
  },
}

export const PICTOS = Object.entries(DESSINS).map(([id, { label }]) => ({ id, label }))

/** Rend un pictogramme. `size` en pixels. */
export function Picto({ id, size = 72, title }) {
  const dessin = DESSINS[id]
  if (!dessin) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
    >
      {dessin.draw}
    </svg>
  )
}
