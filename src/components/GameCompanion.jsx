/**
 * Child-mode companion: the mascot reacts to every answer.
 *
 * It knows nothing about the games. It watches the session, which is fed by
 * `session.register()`. A game therefore needs no extra code to benefit from
 * it, and adult mode simply does not render it.
 */
import { useMemo } from 'react'
import Mascot from './Mascot.jsx'
import { useMode } from './ModeProvider.jsx'

const MESSAGES = {
  idle: ['À toi de jouer !', 'Je t’écoute !', 'Prêt quand tu veux !'],
  correct: ['Bravo !', 'Super !', 'Tu as trouvé !', 'Bien joué !', 'Continue comme ça !'],
  wrong: ['Essaie encore !', 'Presque !', 'On recommence ?', 'Ce n’est pas grave !'],
}

export default function GameCompanion({ session }) {
  const { isChild } = useMode()
  const state = session.lastAnswer ?? 'idle'

  // The message changes with every answer, cycling through the list so the
  // same one never shows twice in a row.
  const message = useMemo(() => {
    const list = MESSAGES[state]
    return list[session.answerCount % list.length]
  }, [state, session.answerCount])

  if (!isChild) return null

  const mood = state === 'correct' ? 'cheer' : state === 'wrong' ? 'tryAgain' : 'idle'

  return (
    <div className="companion" key={session.answerCount}>
      <Mascot mood={mood} size={96} />
      <p className={`companion__bubble companion__bubble--${mood}`} role="status">
        {message}
      </p>
    </div>
  )
}
