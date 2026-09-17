/**
 * Fill the gap: pick the missing word.
 *
 * The sentence completes itself in front of the patient, and the correct
 * version can be read aloud once the answer is given.
 */
import { useState } from 'react'
import MultipleChoice from '../../components/MultipleChoice.jsx'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { shuffle } from '../../lib/random.js'
import { PHRASES } from './data.js'

/** Draws the sentences of the requested series, options already shuffled. */
function buildSeries(config) {
  const series = PHRASES[config.series] ?? PHRASES.meaning
  return shuffle(series)
    .slice(0, config.rounds)
    .map((sentence) => {
      const options = shuffle([sentence.answer, ...sentence.distractors])
      return { ...sentence, options, correct: options.indexOf(sentence.answer) }
    })
}

/** Whole sentence, gap filled in, for the speech synthesis. */
function phraseComplete(sentence, word) {
  return `${sentence.before} ${word} ${sentence.after}`.replace(/\s+([.,])/g, '$1').replace(/’\s/g, '’')
}

export default function FillTheGap({ config, session }) {
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
