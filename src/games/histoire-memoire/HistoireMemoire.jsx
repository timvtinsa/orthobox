import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { pick, shuffle } from '../../lib/random.js'
import { HISTOIRES } from './data.js'

function choisirHistoire(level, precedente) {
  const parLongueur = HISTOIRES.filter((histoire) => histoire.longueur === level)
  const pool = parLongueur.length > 0 ? parLongueur : HISTOIRES
  const fraiches = pool.filter((histoire) => histoire.id !== precedente)
  return pick(fraiches.length > 0 ? fraiches : pool)
}

/** L'ordre des propositions est mélangé à chaque passation. */
function preparerQuestions(histoire) {
  return histoire.questions.map((question) => {
    const bonne = question.options[question.reponse]
    const options = shuffle(question.options)
    return { ...question, options, reponse: options.indexOf(bonne) }
  })
}

export default function HistoireMemoire({ level, session }) {
  const [histoire, setHistoire] = useState(() => choisirHistoire(level))
  const [questions, setQuestions] = useState(() => preparerQuestions(histoire))
  const [phase, setPhase] = useState('lecture')
  const [index, setIndex] = useState(0)
  const [choix, setChoix] = useState(null)
  const [justes, setJustes] = useState(0)
  const lock = useAnswerLock()

  const question = questions[index]

  const repondre = (option) => {
    if (!lock.take()) return
    const juste = option === question.reponse
    session.register(juste)
    if (juste) setJustes(justes + 1)
    setChoix(option)
  }

  const suivant = () => {
    lock.release()
    setChoix(null)
    if (index + 1 >= questions.length) setPhase('resultats')
    else setIndex(index + 1)
  }

  const nouvelleHistoire = () => {
    const prochaine = choisirHistoire(level, histoire.id)
    setHistoire(prochaine)
    setQuestions(preparerQuestions(prochaine))
    setPhase('lecture')
    setIndex(0)
    setChoix(null)
    setJustes(0)
    lock.release()
  }

  if (phase === 'lecture') {
    return (
      <div className="game-board">
        <p className="game-round">Lecture · {histoire.questions.length} questions ensuite</p>

        <article className="story">
          <h2 className="story__title">{histoire.titre}</h2>
          {histoire.texte.map((paragraphe) => (
            <p key={paragraphe}>{paragraphe}</p>
          ))}
        </article>

        <p className="game-instruction">
          Le texte disparaît dès que les questions commencent : il faut retenir les détails
          (noms, nombres, couleurs, moments de la journée).
        </p>

        <div className="game-actions">
          <SpeakButton text={histoire.texte.join(' ')} label="Lire le texte à voix haute" />
          <button type="button" className="btn btn--lg" onClick={() => setPhase('questions')}>
            J’ai fini de lire
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'questions') {
    return (
      <div className="game-board">
        <p className="game-round">
          Question {index + 1} sur {questions.length}
        </p>

        <div className="quiz">
          <p className="quiz__question">{question.question}</p>
          <div className="quiz__options">
            {question.options.map((option, position) => {
              let modifier = ''
              if (choix !== null) {
                if (position === question.reponse) modifier = ' quiz__option--correct'
                else if (position === choix) modifier = ' quiz__option--wrong'
              }
              return (
                <button
                  key={option}
                  type="button"
                  className={`quiz__option${modifier}`}
                  disabled={choix !== null}
                  onClick={() => repondre(position)}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>

        {choix !== null && (
          <>
            <Feedback status={choix === question.reponse ? 'correct' : 'wrong'} />
            <div className="game-actions">
              <button type="button" className="btn btn--lg" onClick={suivant}>
                {index + 1 >= questions.length ? 'Voir le résultat' : 'Question suivante'}
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="game-final">
      <p className="game-round">Résultat · {histoire.titre}</p>
      <p className="game-final__score">
        {justes} / {questions.length}
      </p>
      <p className="muted">
        {justes === questions.length
          ? 'Tous les détails ont été retenus.'
          : 'Relire le texte ensemble permet de repérer les détails passés inaperçus.'}
      </p>

      <div className="game-actions">
        <button type="button" className="btn btn--ghost" onClick={() => setPhase('lecture')}>
          Relire ce texte
        </button>
        <button type="button" className="btn btn--lg" onClick={nouvelleHistoire}>
          Autre histoire
        </button>
      </div>
    </div>
  )
}
