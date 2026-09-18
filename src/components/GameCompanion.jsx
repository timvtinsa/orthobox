/**
 * Child-mode companion: the fox in the corner of the board.
 *
 * It sits inside `.board__area` itself, not in a bar underneath it: same
 * surface, no seam between the fox and the material, so it reads as part of
 * the game screen rather than a toolbar bolted onto it. It is there
 * permanently, small, rather than appearing on success: a character that is
 * already present costs nothing in attention when it reacts. It moves on
 * three occasions only, success, miss and end of game — and stays quiet the
 * rest of the time, no permanent caption competing with the game.
 *
 * The rewards were lengthened so a child has time to see them, and the one
 * rule that actually costs session time is kept: a reward never blocks the
 * next answer. The fox can still be hopping while the practitioner moves on,
 * and a new answer cuts the previous reaction short rather than queueing
 * behind it.
 *
 * At the end of a game it steps aside: `GameOver` shows the same fox bigger,
 * with the confetti. Two foxes on screen at once would read as two
 * characters rather than one.
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

// Rien pour « idle » : au repos le renard ne parle pas, il regarde.
const LINES = {
  cheer: 'Bravo, c’est ça !',
  tryAgain: 'Essaie encore, regarde bien.',
}

export default function GameCompanion({ session }) {
  const { isChild } = useMode()
  const [reacting, setReacting] = useState(false)

  const { answerCount, lastAnswer, index, total } = session
  const done = total !== null && index >= total

  // La réaction dure le temps du budget, puis le renard revient au repos,
  // quel que soit le rythme des réponses.
  useEffect(() => {
    if (answerCount === 0) return undefined
    setReacting(true)
    const id = window.setTimeout(() => setReacting(false), REWARD_ITEM)
    return () => window.clearTimeout(id)
  }, [answerCount])

  if (!isChild || done) return null

  const cheering = reacting && lastAnswer === 'correct'
  const mood = cheering ? 'cheer' : reacting && lastAnswer === 'wrong' ? 'tryAgain' : 'idle'

  return (
    <div className="companion">
      <span className="companion__stage">
        <Mascot mood={mood} size={84} />
        {cheering && <Sparkles key={answerCount} />}
      </span>
      {/* La bulle ne vit que le temps de la réaction : au repos, seul le
          renard reste, dans le coin du plateau plutôt que dans une barre. */}
      <p className={`companion__line${reacting ? ' companion__line--visible' : ''}`} role="status">
        {LINES[mood]}
      </p>
    </div>
  )
}
