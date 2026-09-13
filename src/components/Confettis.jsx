/**
 * Pluie de confettis, en surimpression d'un panneau.
 *
 * Purement décoratif : la couche ne capte aucun clic et n'est rendue qu'en
 * mode enfant, sur les moments de réussite.
 */
const COULEURS = ['#f6bdab', '#b9d8c2', '#cdc3ec', '#f4dfa8', '#a8c8ec']

/** Positions et délais figés au montage, pour un rendu stable. */
function semer(nombre) {
  return Array.from({ length: nombre }, (_, index) => ({
    id: index,
    gauche: Math.round(Math.random() * 100),
    delai: Math.round(Math.random() * 600),
    duree: 1400 + Math.round(Math.random() * 900),
    couleur: COULEURS[index % COULEURS.length],
    rotation: Math.round(Math.random() * 360),
    largeur: 6 + Math.round(Math.random() * 6),
  }))
}

export default function Confettis({ nombre = 24 }) {
  const morceaux = semer(nombre)

  return (
    <span className="confettis" aria-hidden="true">
      {morceaux.map((morceau) => (
        <span
          key={morceau.id}
          className="confetti"
          style={{
            left: `${morceau.gauche}%`,
            width: morceau.largeur,
            height: morceau.largeur * 1.6,
            background: morceau.couleur,
            animationDelay: `${morceau.delai}ms`,
            animationDuration: `${morceau.duree}ms`,
            transform: `rotate(${morceau.rotation}deg)`,
          }}
        />
      ))}
    </span>
  )
}
