/**
 * Child-mode companion: the fox stepping in at the centre of the board.
 *
 * It has no permanent presence: on a tablet, a small corner icon reads as
 * barely there, so instead the fox only shows up for a reaction, as an
 * overlay centred on the board itself rather than tucked below the game
 * material where it competes with the screen's edge. `pointer-events: none`
 * on `.companion` keeps it from ever stealing a tap meant for the game
 * beneath it, even while it visually sits over the "suivant" button — the
 * overlay is gone again well before that matters, on the same reward budget
 * as before.
 *
 * The rewards were lengthened so a child has time to see them, and the one
 * rule that actually costs session time is kept: a reward never blocks the
 * next answer. The fox can still be hopping while the practitioner moves on,
 * and a new answer cuts the previous reaction short rather than queueing
 * behind it.
 *
 * At the end of a game it steps aside: `GameOver` shows the same fox bigger,
 * centred on its own screen, with the confetti. Two foxes on screen at once
 * would read as two characters.
 *
 * It knows nothing about the games. It watches the session, which is fed by
 * `session.register()`, so a game needs no extra code to benefit from it and
 * adult mode simply does not render it.
 */
import { useEffect, useState } from 'react'
import Mascot from './Mascot.jsx'
import Sparkles from './Sparkles.jsx'
import { useMode } from './ModeProvider.jsx'

// Le budget d'une réaction d'item, en miroir de --reward-item dans
// child-mode.css. La fête de fin de partie vit dans GameOver.
const REWARD_ITEM = 1500

const LINES = {
  cheer: 'Bravo, c’est ça !',
  tryAgain: 'Essaie encore, regarde bien.',
}

export default function GameCompanion({ session }) {
  const { isChild } = useMode()
  const [reacting, setReacting] = useState(false)

  const { answerCount, lastAnswer, index, total } = session
  const done = total !== null && index >= total

  // La réaction dure le temps du budget, puis le renard disparaît, quel que
  // soit le rythme des réponses.
  useEffect(() => {
    if (answerCount === 0) return undefined
    setReacting(true)
    const id = window.setTimeout(() => setReacting(false), REWARD_ITEM)
    return () => window.clearTimeout(id)
  }, [answerCount])

  // Rien au repos : le renard n'apparaît que pour intervenir, jamais comme
  // présence permanente qui se verrait mal sur une tablette.
  if (!isChild || done || !reacting) return null

  const cheering = lastAnswer === 'correct'
  const mood = cheering ? 'cheer' : 'tryAgain'

  return (
    <div className="companion">
      <span className="companion__stage">
        <Mascot mood={mood} size={104} />
        {cheering && <Sparkles key={answerCount} />}
      </span>
      <p className="companion__line companion__line--visible" role="status">
        {LINES[mood]}
      </p>
    </div>
  )
}
