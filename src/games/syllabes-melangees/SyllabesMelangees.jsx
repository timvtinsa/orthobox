import { useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import SpeakButton from '../../components/SpeakButton.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import { pick, shuffle } from '../../lib/random.js'
import { MOTS } from './data.js'

const TOTAL_ROUNDS = 8

function buildRound(level) {
  const taille = Number(level) || 2
  const syllabes = pick(MOTS[taille] ?? MOTS[2])
  // Un identifiant par jeton : deux syllabes identiques peuvent coexister.
  const jetons = syllabes.map((texte, index) => ({ id: `${index}-${texte}`, texte }))
  let melange = shuffle(jetons)
  // On évite de proposer le mot déjà dans l'ordre.
  if (syllabes.length > 1 && melange.every((jeton, index) => jeton.id === jetons[index].id)) {
    melange = [...melange.slice(1), melange[0]]
  }
  return { mot: syllabes.join(''), jetons: melange, taille: syllabes.length }
}

export default function SyllabesMelangees({ level, session }) {
  const rounds = useRounds(TOTAL_ROUNDS)
  const [round, setRound] = useState(() => buildRound(level))
  const [placed, setPlaced] = useState([])
  const [result, setResult] = useState(null)
  // Miroir synchrone de `placed` : deux clics dans la même frame liraient
  // sinon deux fois le même état et fausseraient la validation.
  const placedRef = useRef([])

  const proposition = placed.map((jeton) => jeton.texte).join('')

  const majPlaced = (next) => {
    placedRef.current = next
    setPlaced(next)
  }

  const place = (jeton) => {
    if (result) return
    if (placedRef.current.some((item) => item.id === jeton.id)) return
    const next = [...placedRef.current, jeton]
    majPlaced(next)
    if (next.length === round.taille) {
      const mot = next.map((item) => item.texte).join('')
      const isCorrect = mot === round.mot
      setResult(isCorrect ? 'correct' : 'wrong')
      session.register(isCorrect)
    }
  }

  const remove = (jeton) => {
    if (result) return
    majPlaced(placedRef.current.filter((item) => item.id !== jeton.id))
  }

  const retry = () => {
    majPlaced([])
    setResult(null)
  }

  const goNext = () => {
    rounds.next()
    setRound(buildRound(level))
    majPlaced([])
    setResult(null)
  }

  const replay = () => {
    session.reset()
    rounds.restart()
    setRound(buildRound(level))
    majPlaced([])
    setResult(null)
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={replay} />
  }

  const restantes = round.jetons.filter(
    (jeton) => !placed.some((item) => item.id === jeton.id),
  )

  return (
    <div className="game-board">
      <p className="game-round">
        Mot {rounds.round + 1} sur {TOTAL_ROUNDS} · {round.taille} syllabes
      </p>
      <p className="game-prompt">Remets les syllabes dans l’ordre</p>

      <div className={`word-slot${result ? ` word-slot--${result}` : ''}`}>
        {placed.length === 0 ? (
          <span className="word-slot__hint">Clique sur les syllabes ci-dessous…</span>
        ) : (
          placed.map((jeton) => (
            <button
              key={jeton.id}
              type="button"
              className="token"
              onClick={() => remove(jeton)}
              aria-label={`Retirer la syllabe ${jeton.texte}`}
            >
              {jeton.texte}
            </button>
          ))
        )}
      </div>

      <div className="token-row">
        {restantes.map((jeton) => (
          <button key={jeton.id} type="button" className="token" onClick={() => place(jeton)}>
            {jeton.texte}
          </button>
        ))}
      </div>

      {result === 'correct' && (
        <>
          <Feedback status="correct" message={`Bravo : ${round.mot}`} />
          <div className="game-actions">
            <SpeakButton text={round.mot} label="Écouter le mot" />
            <button type="button" className="btn btn--lg" onClick={goNext}>
              Mot suivant
            </button>
          </div>
        </>
      )}

      {result === 'wrong' && (
        <>
          <Feedback status="wrong" message={`« ${proposition} » n’existe pas. Le mot était : ${round.mot}`} />
          <div className="game-actions">
            <button type="button" className="btn btn--subtle" onClick={retry}>
              Réessayer
            </button>
            <button type="button" className="btn" onClick={goNext}>
              Mot suivant
            </button>
          </div>
        </>
      )}
    </div>
  )
}
