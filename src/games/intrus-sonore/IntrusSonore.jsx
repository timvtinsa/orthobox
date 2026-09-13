/**
 * L'intrus sonore : repérer le mot qui ne partage pas le son des autres.
 *
 * Les mots sont tirés dans deux familles phonologiques distinctes, l'intrus
 * venant de la seconde.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { pick, sample, shuffle } from '../../lib/random.js'
import { ATTAQUES, RIMES } from './data.js'

function buildRound(config) {
  const familles = config.critere === 'rime' ? RIMES : ATTAQUES
  const [familleCible, familleIntrus] = sample(familles, 2)
  const mots = sample(familleCible.mots, config.propositions - 1)
  const intrus = pick(familleIntrus.mots.filter((mot) => !mots.includes(mot)))

  return {
    critere: config.critere,
    son: familleCible.son,
    sonIntrus: familleIntrus.son,
    intrus,
    propositions: shuffle([...mots, intrus]),
  }
}

export default function IntrusSonore({ config, session }) {
  const rounds = useRounds(config.manches)
  const [round, setRound] = useState(() => buildRound(config))
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const consigne =
    round.critere === 'attaque'
      ? 'Quel mot ne commence pas comme les autres ?'
      : 'Quel mot ne rime pas avec les autres ?'

  const answer = (mot) => {
    if (!lock.take()) return
    setPicked(mot)
    session.register(mot === round.intrus)
  }

  const goNext = () => {
    lock.release()
    setPicked(null)
    rounds.next()
    setRound(buildRound(config))
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setPicked(null)
    setRound(buildRound(config))
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Mot {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">{consigne}</p>

      <div className="choice-grid">
        {round.propositions.map((mot) => {
          const isIntrus = mot === round.intrus
          let modifier = ''
          if (picked) {
            if (isIntrus) modifier = ' choice--correct'
            else if (mot === picked) modifier = ' choice--wrong'
            else modifier = ' choice--dim'
          }
          return (
            <div key={mot} className="choice-card">
              <button
                type="button"
                className={`choice${modifier}`}
                disabled={Boolean(picked)}
                onClick={() => answer(mot)}
              >
                {mot}
              </button>
              <SpeakButton text={mot} label="Écouter le mot" />
            </div>
          )
        })}
      </div>

      {picked && (
        <>
          <Feedback
            status={picked === round.intrus ? 'correct' : 'wrong'}
            message={
              picked === round.intrus
                ? `Oui : « ${round.intrus} » fait ${round.sonIntrus}, les autres font ${round.son}.`
                : `Les autres mots font ${round.son} : l’intrus était « ${round.intrus} ».`
            }
          />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Mot suivant
            </button>
          </div>
        </>
      )}
    </div>
  )
}
