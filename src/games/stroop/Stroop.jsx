import { useEffect, useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useAnswerLock } from '../../hooks/useAnswerLock.js'
import { useRounds } from '../../hooks/useRounds.js'
import { pick, shuffle } from '../../lib/random.js'

const COULEURS = [
  { id: 'rouge', label: 'ROUGE', hex: '#d0342c' },
  { id: 'bleu', label: 'BLEU', hex: '#2d5fd0' },
  { id: 'vert', label: 'VERT', hex: '#1f8a4c' },
  { id: 'jaune', label: 'JAUNE', hex: '#c98a00' },
]

function buildRound(config) {
  const mot = pick(COULEURS)
  // À l'échauffement, un essai sur deux est congruent (mot et encre identiques).
  const congruent = config.consigne === 'echauffement' ? Math.random() < 0.5 : false
  const encre = congruent ? mot : pick(COULEURS.filter((couleur) => couleur.id !== mot.id))
  const consigne = config.consigne === 'flexible' ? pick(['encre', 'mot']) : 'encre'
  return {
    mot,
    encre,
    consigne,
    attendu: consigne === 'encre' ? encre.id : mot.id,
    options: shuffle(COULEURS),
  }
}

export default function Stroop({ config, session }) {
  const rounds = useRounds(config.manches)
  const [round, setRound] = useState(() => buildRound(config))
  const [picked, setPicked] = useState(null)
  const lock = useAnswerLock()
  const temps = useRef([])
  const debut = useRef(performance.now())

  // Le chronomètre repart à l'affichage de chaque nouvelle manche.
  useEffect(() => {
    debut.current = performance.now()
  }, [round])

  const answer = (couleurId) => {
    if (!lock.take()) return
    const isCorrect = couleurId === round.attendu
    temps.current.push(performance.now() - debut.current)
    setPicked(couleurId)
    session.register(isCorrect)
  }

  const goNext = () => {
    lock.release()
    rounds.next()
    setRound(buildRound(config))
    setPicked(null)
  }

  const replay = () => {
    lock.release()
    session.reset()
    rounds.restart()
    temps.current = []
    setRound(buildRound(config))
    setPicked(null)
  }

  if (rounds.isOver) {
    const moyenne =
      temps.current.length > 0
        ? temps.current.reduce((sum, value) => sum + value, 0) / temps.current.length / 1000
        : 0
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">Temps de réponse moyen : {moyenne.toFixed(2)} s</p>
      </GameOver>
    )
  }

  const consigneTexte =
    round.consigne === 'encre'
      ? 'Clique sur la COULEUR DE L’ENCRE'
      : 'Clique sur la couleur ÉCRITE (lis le mot)'

  return (
    <div className="game-board">
      <p className="game-round">
        Essai {rounds.round + 1} sur {rounds.total}
      </p>
      <p className={`stroop-rule${round.consigne === 'mot' ? ' stroop-rule--switch' : ''}`}>
        {consigneTexte}
      </p>

      <div className="stroop-word" style={{ color: round.encre.hex }}>
        {round.mot.label}
      </div>

      <div className="choice-grid">
        {round.options.map((couleur) => {
          let modifier = ''
          if (picked) {
            if (couleur.id === round.attendu) modifier = ' choice--correct'
            else if (couleur.id === picked) modifier = ' choice--wrong'
            else modifier = ' choice--dim'
          }
          return (
            <button
              key={couleur.id}
              type="button"
              className={`choice stroop-swatch${modifier}`}
              disabled={Boolean(picked)}
              onClick={() => answer(couleur.id)}
            >
              <span className="stroop-swatch__dot" style={{ background: couleur.hex }} />
              {couleur.label.toLowerCase()}
            </button>
          )
        })}
      </div>

      {picked && (
        <>
          <Feedback status={picked === round.attendu ? 'correct' : 'wrong'} />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Essai suivant
            </button>
          </div>
        </>
      )}
    </div>
  )
}
