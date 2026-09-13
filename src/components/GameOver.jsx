import Confettis from './Confettis.jsx'
import Mascotte from './Mascotte.jsx'
import { useMode } from './ModeProvider.jsx'

/**
 * Écran de fin de partie partagé : score, commentaire, relance.
 *
 * En mode enfant, la mascotte vient saluer le résultat, et les confettis
 * sont réservés aux parties réussies pour qu'ils gardent leur valeur.
 */
export default function GameOver({ correct, total, onReplay, children }) {
  const { estEnfant } = useMode()
  const ratio = total === 0 ? 0 : correct / total
  const comment =
    ratio === 1
      ? 'Sans faute, bravo !'
      : ratio >= 0.75
        ? 'Très bonne série.'
        : ratio >= 0.5
          ? 'C’est en bonne voie, on continue ?'
          : 'On recommence tranquillement ?'

  const reussi = total > 0 && ratio >= 0.5

  return (
    <div className="game-final">
      {estEnfant && reussi && <Confettis />}
      {estEnfant && (
        <Mascotte humeur={reussi ? 'bravo' : 'encore'} taille={132} className="mascotte--final" />
      )}
      <p className="game-round">Partie terminée</p>
      <p className="game-final__score">
        {correct} / {total}
      </p>
      <p className="muted">{comment}</p>
      {children}
      <button type="button" className="btn btn--lg" onClick={onReplay}>
        Rejouer
      </button>
    </div>
  )
}
