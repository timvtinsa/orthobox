/**
 * Riddles: find a word from progressive clues.
 *
 * The answer is given aloud: the practitioner is the one who validates, the
 * game only unrolls the clues and keeps the count.
 */
import { useState } from 'react'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import { shuffle } from '../../lib/random.js'
import { RIDDLES, THEMES } from './data.js'

function buildDeck(config) {
  const byTheme = RIDDLES.filter((item) => item.theme === config.theme)
  const pool = config.theme === 'mixed' || byTheme.length === 0 ? RIDDLES : byTheme
  return shuffle(pool).slice(0, config.rounds)
}

export default function Riddles({ config, session }) {
  const [deck, setDeck] = useState(() => buildDeck(config))
  const rounds = useRounds(deck.length, session)
  const [shown, setShown] = useState(1)
  const [revealed, setRevealed] = useState(false)

  const item = deck[rounds.round]

  const goNext = (found) => {
    session.register(found)
    setShown(1)
    setRevealed(false)
    rounds.next()
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    setDeck(buildDeck(config))
    setShown(1)
    setRevealed(false)
  }

  if (rounds.isOver || !item) {
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">
          Les mots non trouvés peuvent être repris en fin de séance, à partir de la définition
          donnée par l’enfant.
        </p>
      </GameOver>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Devinette {rounds.round + 1} sur {rounds.total} · {THEMES[item.theme]}
      </p>
      <p className="game-prompt">Qui suis-je ?</p>

      <ol className="clues">
        {item.clues.slice(0, shown).map((clue) => (
          <li key={clue} className="clue">
            <span>{clue}</span>
            <SpeakButton text={clue} label="Lire l’indice" />
          </li>
        ))}
      </ol>

      {shown < item.clues.length && !revealed && (
        <button type="button" className="btn btn--subtle" onClick={() => setShown(shown + 1)}>
          Indice suivant ({shown}/{item.clues.length})
        </button>
      )}

      {revealed && (
        <p className="reveal">
          {item.answer}
          <SpeakButton text={item.answer} label="Prononcer la réponse" />
        </p>
      )}

      <div className="game-actions">
        <button type="button" className="btn btn--lg" onClick={() => goNext(true)}>
          Trouvé
        </button>
        {!revealed ? (
          <button type="button" className="btn btn--ghost" onClick={() => setRevealed(true)}>
            Montrer la réponse
          </button>
        ) : (
          <button type="button" className="btn btn--ghost" onClick={() => goNext(false)}>
            Pas trouvé, on passe
          </button>
        )}
      </div>

      <p className="game-instruction">
        L’enfant répond à l’oral : c’est vous qui validez. Les indices vont du plus général au plus
        précis.
      </p>
    </div>
  )
}
