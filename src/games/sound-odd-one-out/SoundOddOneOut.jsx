/**
 * Sound odd one out: spot the word that does not share the others' sound.
 *
 * Words are drawn from two distinct phonological families, the odd one
 * coming from the second.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { pick, sample, shuffle } from '../../lib/random.js'
import { ONSETS, RHYMES } from './data.js'

function buildRound(config) {
  const families = config.criterion === 'rhyme' ? RHYMES : ONSETS
  const [targetFamily, oddFamily] = sample(families, 2)
  const words = sample(targetFamily.words, config.choices - 1)
  const oddOne = pick(oddFamily.words.filter((word) => !words.includes(word)))

  return {
    criterion: config.criterion,
    sound: targetFamily.sound,
    oddSound: oddFamily.sound,
    oddOne,
    options: shuffle([...words, oddOne]),
  }
}

export default function SoundOddOneOut({ config, session }) {
  const rounds = useRounds(config.rounds)
  const [round, setRound] = useState(() => buildRound(config))
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  const prompt =
    round.criterion === 'onset'
      ? 'Quel mot ne commence pas comme les autres ?'
      : 'Quel mot ne rime pas avec les autres ?'

  const answer = (word) => {
    if (!lock.take()) return
    setPicked(word)
    session.register(word === round.oddOne)
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
      <p className="game-prompt">{prompt}</p>

      <div className="choice-grid">
        {round.options.map((word) => {
          const isOddOne = word === round.oddOne
          let modifier = ''
          if (picked) {
            if (isOddOne) modifier = ' choice--correct'
            else if (word === picked) modifier = ' choice--wrong'
            else modifier = ' choice--dim'
          }
          return (
            <div key={word} className="choice-card">
              <button
                type="button"
                className={`choice${modifier}`}
                disabled={Boolean(picked)}
                onClick={() => answer(word)}
              >
                {word}
              </button>
              <SpeakButton text={word} label="Écouter le mot" />
            </div>
          )
        })}
      </div>

      {picked && (
        <>
          <Feedback
            status={picked === round.oddOne ? 'correct' : 'wrong'}
            message={
              picked === round.oddOne
                ? `Oui : « ${round.oddOne} » fait ${round.oddSound}, les autres font ${round.sound}.`
                : `Les autres mots font ${round.sound} : l’intrus était « ${round.oddOne} ».`
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
