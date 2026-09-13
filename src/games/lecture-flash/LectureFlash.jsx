/**
 * Lecture flash : identifier un mot affiché brièvement.
 *
 * Le déroulé est en trois temps : prêt, affichage minuté, puis choix parmi
 * des leurres orthographiquement proches.
 */
import { useEffect, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { pick, shuffle } from '../../lib/random.js'
import { MOTS_COURTS, MOTS_LONGS } from './data.js'

function buildRound(config) {
  const entree = pick(config.longueur === 'longs' ? MOTS_LONGS : MOTS_COURTS)
  return {
    // Le réglage est en dixièmes de seconde.
    duree: config.duree * 100,
    mot: entree.mot,
    propositions: shuffle([entree.mot, ...entree.leurres]),
  }
}

export default function LectureFlash({ config, session }) {
  const rounds = useRounds(config.manches)
  const [round, setRound] = useState(() => buildRound(config))
  const [phase, setPhase] = useState('pret') // pret -> flash -> choix
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()

  useEffect(() => {
    if (phase !== 'flash') return undefined
    const id = window.setTimeout(() => setPhase('choix'), round.duree)
    return () => window.clearTimeout(id)
  }, [phase, round])

  const answer = (mot) => {
    if (!lock.take()) return
    setPicked(mot)
    session.register(mot === round.mot)
  }

  const goNext = () => {
    lock.release()
    rounds.next()
    setRound(buildRound(config))
    setPicked(null)
    setPhase('pret')
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    setRound(buildRound(config))
    setPicked(null)
    setPhase('pret')
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Mot {rounds.round + 1} sur {rounds.total}
      </p>

      {phase === 'pret' && (
        <>
          <p className="game-prompt">Prêt ? Le mot va apparaître très brièvement.</p>
          <button type="button" className="btn btn--lg" onClick={() => setPhase('flash')}>
            Afficher le mot
          </button>
        </>
      )}

      {phase === 'flash' && (
        <div className="flash-word" aria-live="assertive">
          {round.mot}
        </div>
      )}

      {phase === 'choix' && (
        <>
          <p className="game-prompt">Quel mot as-tu vu ?</p>
          <div className="choice-grid choice-grid--wide">
            {round.propositions.map((mot) => {
              let modifier = ''
              if (picked) {
                if (mot === round.mot) modifier = ' choice--correct'
                else if (mot === picked) modifier = ' choice--wrong'
                else modifier = ' choice--dim'
              }
              return (
                <button
                  key={mot}
                  type="button"
                  className={`choice${modifier}`}
                  disabled={Boolean(picked)}
                  onClick={() => answer(mot)}
                >
                  {mot}
                </button>
              )
            })}
          </div>

          {picked && (
            <>
              <Feedback
                status={picked === round.mot ? 'correct' : 'wrong'}
                message={
                  picked === round.mot
                    ? 'Exact !'
                    : `Le mot affiché était « ${round.mot} ».`
                }
              />
              <div className="game-actions">
                <button type="button" className="btn btn--lg" onClick={goNext}>
                  Mot suivant
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
