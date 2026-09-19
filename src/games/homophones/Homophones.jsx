/**
 * Homophones: the same sentence-with-a-gap shape as « La phrase à trous »,
 * but with exactly two options — the pair's two spellings — rather than
 * four, because the exercise is the choice between them, not a search
 * through unrelated words.
 */
import { useState } from 'react'
import MultipleChoice from '../../components/MultipleChoice.jsx'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { noRepeatSeries, shuffle } from '../../lib/random.js'
import { HOMOPHONES } from './data.js'

/** Draws the sentences for the requested pair (or all six), options
 * shuffled but always limited to that sentence's own homophone pair. */
function buildSeries(config) {
  const keys = config.pair === 'mixed' || !HOMOPHONES[config.pair]
    ? Object.keys(HOMOPHONES)
    : [config.pair]

  const pool = keys.flatMap((key) => {
    const { words, sentences } = HOMOPHONES[key]
    return sentences.map((sentence) => ({ ...sentence, words }))
  })

  return noRepeatSeries(pool, config.rounds).map((sentence) => {
    const options = shuffle(sentence.words)
    return { ...sentence, options, correct: options.indexOf(sentence.answer) }
  })
}

/** Whole sentence, gap filled in, for the speech synthesis. */
function phraseComplete(sentence, word) {
  return `${sentence.before} ${word} ${sentence.after}`.replace(/\s+([.,])/g, '$1')
}

export default function Homophones({ config, session }) {
  const [sentences, setSentences] = useState(() => buildSeries(config))
  const rounds = useRounds(sentences.length, session)
  const [choice, setChoice] = useState(null)
  const lock = useAnswerLock()

  const sentence = sentences[rounds.round]

  const answer = (position) => {
    if (!lock.take()) return
    setChoice(position)
    session.register(position === sentence.correct)
  }

  const goNext = () => {
    lock.release()
    setChoice(null)
    rounds.next()
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setSentences(buildSeries(config))
    setChoice(null)
  }

  if (rounds.isOver || !sentence) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Phrase {rounds.round + 1} sur {rounds.total}
      </p>

      <p className="gap-sentence">
        {sentence.before}{' '}
        <span className={`gap${choice === null ? '' : ' gap--filled'}`}>
          {choice === null ? '…' : sentence.options[choice]}
        </span>{' '}
        {sentence.after}
      </p>

      <MultipleChoice
        options={sentence.options}
        correct={sentence.correct}
        choice={choice}
        onChoose={answer}
        layout="grid"
      />

      {choice !== null && (
        <>
          <Feedback
            status={choice === sentence.correct ? 'correct' : 'wrong'}
            message={
              choice === sentence.correct
                ? undefined
                : `La phrase juste : ${phraseComplete(sentence, sentence.answer)}`
            }
          />
          <div className="game-actions">
            <SpeakButton
              text={phraseComplete(sentence, sentence.answer)}
              label="Écouter la phrase complète"
            />
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Phrase suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
