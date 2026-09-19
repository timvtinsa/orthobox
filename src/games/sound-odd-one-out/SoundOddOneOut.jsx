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
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { noRepeatSeries, pick, sample, shuffle } from '../../lib/random.js'
import { ONSETS, RHYMES } from './data.js'

function buildRoundFor(config, families, targetFamily) {
  const oddFamily = pick(families.filter((family) => family !== targetFamily))
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

/** The whole session's target families, drawn upfront so the same sound
 * family does not carry several rounds in a row while the bank has enough
 * to avoid it. The odd-one-out family is still drawn fresh each round. */
function buildSeries(config) {
  const families = config.criterion === 'rhyme' ? RHYMES : ONSETS
  const targets = noRepeatSeries(families, config.rounds)
  return targets.map((targetFamily) => buildRoundFor(config, families, targetFamily))
}

export default function SoundOddOneOut({ config, session }) {
  const [series, setSeries] = useState(() => buildSeries(config))
  const rounds = useRounds(series.length, session)
  const round = series[rounds.round]
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
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setPicked(null)
    setSeries(buildSeries(config))
  }

  if (rounds.isOver || !round) {
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
          const state = answerState(word, { picked, expected: round.oddOne })
          const dim = picked && !state ? ' choice--dim' : ''
          return (
            <div key={word} className="choice-card">
              <button
                type="button"
                className={`choice${stateClass(state)}${dim}`}
                disabled={Boolean(picked)}
                onClick={() => answer(word)}
              >
                {word}
                <StateMark state={state} />
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
