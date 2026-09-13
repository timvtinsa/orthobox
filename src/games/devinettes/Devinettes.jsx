import { useState } from 'react'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import { shuffle } from '../../lib/random.js'
import { DEVINETTES, THEMES } from './data.js'

function buildDeck(config) {
  const parTheme = DEVINETTES.filter((item) => item.theme === config.theme)
  const pool = config.theme === 'melange' || parTheme.length === 0 ? DEVINETTES : parTheme
  return shuffle(pool).slice(0, config.manches)
}

export default function Devinettes({ config, session }) {
  const [deck, setDeck] = useState(() => buildDeck(config))
  const rounds = useRounds(deck.length)
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
        {item.indices.slice(0, shown).map((indice) => (
          <li key={indice} className="clue">
            <span>{indice}</span>
            <SpeakButton text={indice} label="Lire l’indice" />
          </li>
        ))}
      </ol>

      {shown < item.indices.length && !revealed && (
        <button type="button" className="btn btn--subtle" onClick={() => setShown(shown + 1)}>
          Indice suivant ({shown}/{item.indices.length})
        </button>
      )}

      {revealed && (
        <p className="reveal">
          {item.reponse}
          <SpeakButton text={item.reponse} label="Prononcer la réponse" />
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
