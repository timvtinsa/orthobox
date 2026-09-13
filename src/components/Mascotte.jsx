/**
 * Le petit renard d'Orthobox, compagnon du mode enfant.
 *
 * Trois humeurs, dessinées à partir des mêmes formes pour que ce soit bien
 * le même animal qui change d'expression :
 *   repos   : attentif, il respire doucement
 *   bravo   : yeux plissés et grand sourire, il saute
 *   encore  : sourcils inquiets, il se balance, sans jamais avoir l'air fâché
 *
 * Les expressions ne reposent que sur le tracé : aucune couleur ne change
 * d'une humeur à l'autre, la réussite ne se lit donc pas à la seule couleur.
 */
const PELAGE = '#f2a882'
const PELAGE_SOMBRE = '#d9825c'
const VENTRE = '#fdf1e9'
const TRAIT = '#5c4638'
const JOUE = '#f28e8e'

function Yeux({ humeur }) {
  if (humeur === 'bravo') {
    // Yeux plissés de contentement.
    return (
      <g fill="none" stroke={TRAIT} strokeWidth="4" strokeLinecap="round">
        <path d="M40 52c3-5 9-5 12 0" />
        <path d="M68 52c3-5 9-5 12 0" />
      </g>
    )
  }
  return (
    <g>
      <circle cx="46" cy="53" r="5.5" fill={TRAIT} />
      <circle cx="74" cy="53" r="5.5" fill={TRAIT} />
      <circle cx="48" cy="51" r="1.8" fill="#fff" />
      <circle cx="76" cy="51" r="1.8" fill="#fff" />
      {humeur === 'encore' && (
        <g fill="none" stroke={TRAIT} strokeWidth="3.4" strokeLinecap="round">
          <path d="M38 46l12 -5" />
          <path d="M82 46l-12 -5" />
        </g>
      )}
    </g>
  )
}

function Bouche({ humeur }) {
  if (humeur === 'bravo') {
    return (
      <path
        d="M51 69c4 8 14 8 18 0z"
        fill={TRAIT}
        stroke={TRAIT}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    )
  }
  if (humeur === 'encore') {
    return (
      <path d="M54 74c2-3 10-3 12 0" fill="none" stroke={TRAIT} strokeWidth="3.4" strokeLinecap="round" />
    )
  }
  return (
    <path d="M53 69c3 4 11 4 14 0" fill="none" stroke={TRAIT} strokeWidth="3.4" strokeLinecap="round" />
  )
}

export default function Mascotte({ humeur = 'repos', taille = 120, className = '' }) {
  return (
    <span className={`mascotte mascotte--${humeur} ${className}`.trim()} style={{ width: taille }}>
      <svg viewBox="0 0 120 124" width="100%" aria-hidden="true" focusable="false">
        {/* Queue, derrière le corps, enroulée vers l'avant */}
        <path
          d="M88 104c14 2 22-6 22-17 0-9-7-15-14-13-6 2-8 9-4 13"
          fill={PELAGE}
          stroke={PELAGE_SOMBRE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M96 87c4-2 8 1 8 6s-4 8-8 7c2-4 2-9 0-13z" fill={VENTRE} />

        {/* Corps assis */}
        <ellipse cx="60" cy="99" rx="29" ry="20" fill={PELAGE} />
        <ellipse cx="60" cy="103" rx="19" ry="15" fill={VENTRE} />
        <ellipse cx="45" cy="114" rx="9" ry="6" fill={VENTRE} stroke={PELAGE_SOMBRE} strokeWidth="2" />
        <ellipse cx="75" cy="114" rx="9" ry="6" fill={VENTRE} stroke={PELAGE_SOMBRE} strokeWidth="2" />

        {/* Oreilles */}
        <path d="M29 38l3-24 21 13z" fill={PELAGE} stroke={PELAGE_SOMBRE} strokeWidth="3" strokeLinejoin="round" />
        <path d="M91 38l-3-24-21 13z" fill={PELAGE} stroke={PELAGE_SOMBRE} strokeWidth="3" strokeLinejoin="round" />
        <path d="M36 32l1-10 8 5z" fill={JOUE} opacity=".65" />
        <path d="M84 32l-1-10-8 5z" fill={JOUE} opacity=".65" />

        {/* Tête */}
        <ellipse cx="60" cy="55" rx="34" ry="29" fill={PELAGE} />
        <path
          d="M60 84c-13 0-24-7-28-17 8 4 17 6 28 6s20-2 28-6c-4 10-15 17-28 17z"
          fill={VENTRE}
        />
        <ellipse cx="60" cy="67" rx="15" ry="11" fill={VENTRE} />
        <ellipse cx="60" cy="60" rx="4.6" ry="3.4" fill={TRAIT} />

        <circle cx="34" cy="63" r="6" fill={JOUE} opacity=".45" />
        <circle cx="86" cy="63" r="6" fill={JOUE} opacity=".45" />

        <Yeux humeur={humeur} />
        <Bouche humeur={humeur} />
      </svg>

      {humeur === 'bravo' && (
        <span className="mascotte__etoiles" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <svg key={index} className={`etoile etoile--${index}`} viewBox="0 0 24 24" width="18">
              <path
                d="M12 2l2.7 6.2 6.7.6-5 4.4 1.5 6.6L12 16.4 6.1 19.8l1.5-6.6-5-4.4 6.7-.6z"
                fill="#f4dfa8"
                stroke="#c9a03f"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </span>
      )}
    </span>
  )
}
