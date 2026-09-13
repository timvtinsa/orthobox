/**
 * Compagnon du mode enfant : la mascotte réagit à chaque réponse.
 *
 * Il ne connaît pas les jeux : il observe la session, alimentée par
 * `session.register()`. Un jeu n'a donc rien à faire pour en bénéficier, et
 * le mode adulte se contente de ne pas l'afficher.
 */
import { useMemo } from 'react'
import Mascotte from './Mascotte.jsx'
import { useMode } from './ModeProvider.jsx'

const MESSAGES = {
  repos: ['À toi de jouer !', 'Je t’écoute !', 'Prêt quand tu veux !'],
  correct: ['Bravo !', 'Super !', 'Tu as trouvé !', 'Bien joué !', 'Continue comme ça !'],
  wrong: ['Essaie encore !', 'Presque !', 'On recommence ?', 'Ce n’est pas grave !'],
}

export default function CompagnonDeJeu({ session }) {
  const { estEnfant } = useMode()
  const etat = session.dernier ?? 'repos'

  // Le message change à chaque réponse, sans repasser deux fois de suite
  // par le même : c'est le compteur d'évènements qui fait tourner la liste.
  const message = useMemo(() => {
    const liste = MESSAGES[etat]
    return liste[session.evenement % liste.length]
  }, [etat, session.evenement])

  if (!estEnfant) return null

  const humeur = etat === 'correct' ? 'bravo' : etat === 'wrong' ? 'encore' : 'repos'

  return (
    <div className="compagnon" key={session.evenement}>
      <Mascotte humeur={humeur} taille={96} />
      <p className={`compagnon__bulle compagnon__bulle--${humeur}`} role="status">
        {message}
      </p>
    </div>
  )
}
