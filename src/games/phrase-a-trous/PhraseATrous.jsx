/**
 * La phrase à trous : choisir le mot manquant.
 *
 * La phrase se complète sous les yeux du patient, et la version correcte peut
 * être relue à voix haute après correction.
 */
import { useState } from 'react'
import ChoixMultiple from '../../components/ChoixMultiple.jsx'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { shuffle } from '../../lib/random.js'
import { PHRASES } from './data.js'

/** Tire les phrases de la série demandée, propositions déjà mélangées. */
function construireSerie(config) {
  const serie = PHRASES[config.serie] ?? PHRASES.sens
  return shuffle(serie)
    .slice(0, config.manches)
    .map((phrase) => {
      const options = shuffle([phrase.reponse, ...phrase.leurres])
      return { ...phrase, options, bonne: options.indexOf(phrase.reponse) }
    })
}

/** Phrase complète, une fois le trou comblé, pour la lecture vocale. */
function phraseComplete(phrase, mot) {
  return `${phrase.avant} ${mot} ${phrase.apres}`.replace(/\s+([.,])/g, '$1').replace(/’\s/g, '’')
}

export default function PhraseATrous({ config, session }) {
  const [phrases, setPhrases] = useState(() => construireSerie(config))
  const rounds = useRounds(phrases.length)
  const [choix, setChoix] = useState(null)
  const lock = useAnswerLock()

  const phrase = phrases[rounds.round]

  const repondre = (position) => {
    if (!lock.take()) return
    setChoix(position)
    session.register(position === phrase.bonne)
  }

  const suivant = () => {
    lock.release()
    setChoix(null)
    rounds.next()
  }

  const rejouer = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setPhrases(construireSerie(config))
    setChoix(null)
  }

  if (rounds.isOver || !phrase) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={rejouer} />
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Phrase {rounds.round + 1} sur {rounds.total}
      </p>

      <p className="phrase-trou">
        {phrase.avant}{' '}
        <span className={`trou${choix === null ? '' : ' trou--rempli'}`}>
          {choix === null ? '…' : phrase.options[choix]}
        </span>{' '}
        {phrase.apres}
      </p>

      <ChoixMultiple
        options={phrase.options}
        bonne={phrase.bonne}
        choix={choix}
        onChoisir={repondre}
        disposition="grille"
      />

      {choix !== null && (
        <>
          <Feedback
            status={choix === phrase.bonne ? 'correct' : 'wrong'}
            message={
              choix === phrase.bonne
                ? undefined
                : `La phrase juste : ${phraseComplete(phrase, phrase.reponse)}`
            }
          />
          <div className="game-actions">
            <SpeakButton
              text={phraseComplete(phrase, phrase.reponse)}
              label="Écouter la phrase complète"
            />
            <button type="button" className="btn btn--lg" onClick={suivant}>
              Phrase suivante
            </button>
          </div>
        </>
      )}
    </div>
  )
}
