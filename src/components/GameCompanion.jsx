/**
 * Child-mode companion: the fox at the edge of the board.
 *
 * It is there permanently, small, rather than appearing on success: a
 * character that is already present costs nothing in attention when it
 * reacts. It moves on three occasions only, success, miss and end of game,
 * and every reward is capped, never blocks the next answer, and never repeats
 * while it is still running.
 *
 * It knows nothing about the games. It watches the session, which is fed by
 * `session.register()`, so a game needs no extra code to benefit from it and
 * adult mode simply does not render it.
 */
import { useEffect, useState } from 'react'
import Confetti from './Confetti.jsx'
import Mascot from './Mascot.jsx'
import { useMode } from './ModeProvider.jsx'

// Le budget récompense, en miroir de --reward-item et --reward-end dans
// child-mode.css : 600 ms pour une réaction d'item, 1,5 s pour la fin.
const REWARD_ITEM = 600
const REWARD_END = 1500

const LINES = {
  idle: 'À toi.',
  cheer: 'Bien vu.',
  tryAgain: 'Essaie encore, regarde bien.',
  done: 'Partie terminée, joli travail.',
}

export default function GameCompanion({ session }) {
  const { isChild } = useMode()
  const [reacting, setReacting] = useState(false)

  const { answerCount, lastAnswer, index, total } = session
  const done = total !== null && index >= total

  // La réaction dure 600 ms puis le renard revient au repos, quel que soit
  // le rythme des réponses.
  useEffect(() => {
    if (answerCount === 0) return undefined
    setReacting(true)
    const id = window.setTimeout(() => setReacting(false), REWARD_ITEM)
    return () => window.clearTimeout(id)
  }, [answerCount])

  const [celebrating, setCelebrating] = useState(false)
  useEffect(() => {
    if (!done) return undefined
    setCelebrating(true)
    const id = window.setTimeout(() => setCelebrating(false), REWARD_END)
    return () => window.clearTimeout(id)
  }, [done])

  if (!isChild) return null

  const mood = done
    ? 'cheer'
    : reacting && lastAnswer === 'correct'
      ? 'cheer'
      : reacting && lastAnswer === 'wrong'
        ? 'tryAgain'
        : 'idle'

  return (
    <div className="companion">
      <Mascot mood={mood} size={72} />
      <p className="companion__line" role="status">
        {done ? LINES.done : LINES[mood]}
      </p>
      {celebrating && <Confetti />}
    </div>
  )
}
