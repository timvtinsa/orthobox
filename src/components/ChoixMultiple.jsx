/**
 * Liste de propositions à choix unique, avec correction visuelle.
 *
 * Une fois `choix` renseigné, la bonne réponse est marquée en vert, la réponse
 * erronée en rouge, et tout est désactivé : la correction ne repose donc pas
 * seulement sur la couleur mais aussi sur l'état des boutons.
 */
export default function ChoixMultiple({ options, bonne, choix, onChoisir, disposition = 'liste' }) {
  return (
    <div className={disposition === 'grille' ? 'choice-grid choice-grid--wide' : 'quiz__options'}>
      {options.map((option, position) => {
        let modifier = ''
        if (choix !== null) {
          if (position === bonne) modifier = '--correct'
          else if (position === choix) modifier = '--wrong'
        }
        const base = disposition === 'grille' ? 'choice' : 'quiz__option'
        return (
          <button
            key={option}
            type="button"
            className={`${base}${modifier ? ` ${base}${modifier}` : ''}`}
            disabled={choix !== null}
            onClick={() => onChoisir(position)}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
