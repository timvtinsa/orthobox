/**
 * Word forms: a short text whose words lack their ending, their prefix or
 * their whole form (a pronoun, an irregular verb form).
 *
 * The patient opens the list beside each word and picks the right form, then
 * validates the whole text. Only then is anything corrected: the wrong words
 * show the right spelling and the rule that justifies it, which is what a
 * practitioner takes up afterwards. Each word is one answer for the score.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import Icon from '../../components/Icon.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import {
  buildSeries,
  completeText,
  correctWord,
  countRight,
  gapsOf,
  isComplete,
  isRight,
} from './logic.js'

/** « (rien) » stands for an empty ending, which a blank option would not make clear. */
const label = (ending) => (ending === '' ? '(rien)' : ending)

function EndingSelect({ gap, options, picks, onPick, checked }) {
  const value = picks[gap.id]
  const ok = checked && isRight(gap, picks)
  const state = checked ? (ok ? ' ending-gap--ok' : ' ending-gap--err') : ''
  const name = gap.stem === '' ? 'Mot à choisir' : `${gap.before ? 'Début' : 'Fin'} de ${gap.stem}`

  const select = (
    <select
      className="ending-gap__select"
      aria-label={name}
      value={value === undefined ? '' : String(options.indexOf(value))}
      disabled={checked}
      onChange={(event) => onPick(gap.id, options[Number(event.target.value)])}
    >
      <option value="" disabled>
        …
      </option>
      {options.map((ending, index) => (
        <option key={ending || 'none'} value={index}>
          {label(ending)}
        </option>
      ))}
    </select>
  )
  const stem = gap.stem === '' ? null : <span className="ending-gap__stem">{gap.stem}</span>

  return (
    <span className={`ending-gap${state}`}>
      {gap.before && select}
      {stem}
      {!gap.before && select}
      {checked && (
        <span className="ending-gap__mark">
          <Icon name={ok ? 'check' : 'cross'} size={20} />
          <span className="visually-hidden">{ok ? 'juste' : 'faux'}</span>
        </span>
      )}
    </span>
  )
}

export default function WordEndings({ config, session }) {
  const [series, setSeries] = useState(() => buildSeries(config))
  const rounds = useRounds(series.length, session)
  const round = series[rounds.round]
  const [picks, setPicks] = useState({})
  const [checked, setChecked] = useState(false)
  const lock = useAnswerLock()

  const pick = (id, ending) => setPicks((current) => ({ ...current, [id]: ending }))

  const validate = () => {
    if (!isComplete(round, picks) || !lock.take()) return
    setChecked(true)
    for (const gap of gapsOf(round)) session.register(isRight(gap, picks))
  }

  const goNext = () => {
    lock.release()
    rounds.next()
    setPicks({})
    setChecked(false)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setSeries(buildSeries(config))
    setPicks({})
    setChecked(false)
  }

  if (rounds.isOver || !round) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  const gaps = gapsOf(round)
  const wrong = gaps.filter((gap) => !isRight(gap, picks))

  return (
    <div className="game-board">
      <p className="game-round">
        Texte {rounds.round + 1} sur {rounds.total}
      </p>
      <p className="game-prompt">Choisis la bonne forme de chaque mot.</p>

      <p className="ending-text">
        {round.parts.map((part, index) =>
          part.type === 'text' ? (
            <span key={index}>{part.value}</span>
          ) : (
            <EndingSelect
              key={index}
              gap={part}
              options={round.options}
              picks={picks}
              onPick={pick}
              checked={checked}
            />
          ),
        )}
      </p>

      {!checked && (
        <div className="game-actions">
          <button type="button" className="btn btn--lg" disabled={!isComplete(round, picks)} onClick={validate}>
            Valider
          </button>
        </div>
      )}

      {checked && (
        <>
          <Feedback
            status={wrong.length === 0 ? 'correct' : 'wrong'}
            message={
              wrong.length === 0
                ? undefined
                : `${countRight(round, picks)} mot${countRight(round, picks) > 1 ? 's' : ''} juste${
                    countRight(round, picks) > 1 ? 's' : ''
                  } sur ${gaps.length}.`
            }
          />
          {wrong.length > 0 && (
            <ul className="ending-fixes">
              {wrong.map((gap) => (
                <li key={gap.id}>
                  <strong>{correctWord(gap)}</strong> : {gap.why}
                </li>
              ))}
            </ul>
          )}
          <div className="game-actions">
            <SpeakButton text={completeText(round)} label="Écouter le texte complet" />
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Texte suivant
            </button>
          </div>
        </>
      )}
    </div>
  )
}
