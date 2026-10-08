/**
 * « Mes mots »: the practitioner's own list, read aloud or recognised by ear.
 *
 * The list is the *active* one of « Mes listes ». It is read once, when the
 * game starts: a list edited in another tab does not change a series that
 * has begun.
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import StateMark from '../../components/StateMark.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { answerState, stateClass } from '../../lib/answer-state.js'
import { isSpeechAvailable, speak } from '../../lib/speech.js'
import { activeList, readWordLists } from '../../lib/word-lists.js'
import { MIN_WORDS, buildSeries, canPlay } from './logic.js'

export default function CustomWords({ config, session }) {
  const [list] = useState(() => activeList(readWordLists()))

  if (!list || !canPlay(list.words, config.mode)) {
    return <NoList list={list} mode={config.mode} />
  }
  return <Board list={list} config={config} session={session} />
}

function NoList({ list, mode }) {
  const needed = MIN_WORDS[mode] ?? MIN_WORDS.read
  return (
    <div className="panel stack empty">
      <h2>{list ? `La liste « ${list.name} » est trop courte` : 'Aucune liste de mots'}</h2>
      <p className="muted">
        {list
          ? `Ce mode demande au moins ${needed} mot${needed > 1 ? 's' : ''}.`
          : 'Préparez d’abord une liste, un mot par ligne.'}
      </p>
      <p>
        <Link to="/listes" className="btn">
          {list ? 'Modifier la liste' : 'Créer une liste'}
        </Link>
      </p>
    </div>
  )
}

function Board({ list, config, session }) {
  const [series, setSeries] = useState(() => buildSeries(list.words, config))
  const rounds = useRounds(series.length, session)
  const round = series[rounds.round]
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()
  const listening = config.mode === 'listen'
  const word = round?.word

  // The word is said as soon as it comes up: the patient has not touched
  // anything yet, and the button beside the question says it again.
  useEffect(() => {
    if (listening && word) speak(word)
  }, [listening, word])

  const answer = (correct, choice = true) => {
    if (!lock.take()) return
    setPicked(choice)
    session.register(correct, round.word)
  }

  const goNext = () => {
    lock.release()
    rounds.next()
    setPicked(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setSeries(buildSeries(list.words, config))
    setPicked(null)
  }

  if (rounds.isOver || !round) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Mot {rounds.round + 1} sur {rounds.total} · {list.name}
      </p>

      {listening ? (
        <>
          <div className="week-prompt">
            <p className="game-prompt">Quel mot as-tu entendu ?</p>
            <SpeakButton text={round.word} label="Écouter le mot" />
          </div>
          {!isSpeechAvailable() && (
            <p className="muted">Pas de voix sur cet appareil : dites le mot « {round.word} » à voix haute.</p>
          )}
          <div className="choice-grid">
            {round.options.map((word) => {
              const state = answerState(word, { picked, expected: round.word })
              const dim = picked !== null && !state ? ' choice--dim' : ''
              return (
                <button
                  key={word}
                  type="button"
                  className={`choice${stateClass(state)}${dim}`}
                  disabled={picked !== null}
                  onClick={() => answer(word === round.word, word)}
                >
                  {word}
                  <StateMark state={state} />
                </button>
              )
            })}
          </div>
          {picked !== null && (
            <Feedback
              status={picked === round.word ? 'correct' : 'wrong'}
              message={picked === round.word ? undefined : `Le mot était « ${round.word} ».`}
            />
          )}
        </>
      ) : (
        <>
          <p className="game-prompt">Lis ce mot à voix haute</p>
          <p className="custom-word">{round.word}</p>
          {picked === null && (
            <div className="game-actions">
              <button type="button" className="btn btn--lg" onClick={() => answer(true)}>
                Bien lu
              </button>
              <button type="button" className="btn btn--lg btn--ghost" onClick={() => answer(false)}>
                À revoir
              </button>
            </div>
          )}
        </>
      )}

      {picked !== null && (
        <div className="game-actions">
          <button type="button" className="btn btn--lg" onClick={goNext}>
            Mot suivant
          </button>
        </div>
      )}
    </div>
  )
}
