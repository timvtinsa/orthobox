/**
 * La suite lumineuse : reproduire une séquence de cases allumées.
 *
 * La suite s'allonge d'un élément à chaque réussite, ce qui donne l'empan
 * atteint en fin de partie.
 */
import { useEffect, useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { randomInt } from '../../lib/random.js'

const COLONNES = { 4: 2, 6: 3, 9: 3 }

const DUREE_ALLUMEE = 450
const DUREE_PAS = 700
const EMPAN_MAX = 9

export default function SequenceMemoire({ config, session }) {
  const cases = Number(config.cases)
  const colonnes = COLONNES[cases] ?? 3
  const [sequence, setSequence] = useState(() => creerSequence(cases, config.depart))
  const [phase, setPhase] = useState('montre') // montre -> repete -> reussi | rate
  const [step, setStep] = useState(0)
  const [allumee, setAllumee] = useState(null)
  const [saisie, setSaisie] = useState([])
  const [fini, setFini] = useState(false)
  // Longueur de la plus longue suite reproduite sans erreur.
  const [empan, setEmpan] = useState(0)
  // Miroir synchrone de `saisie` : une case tapée deux fois très vite ne doit
  // pas être comparée deux fois à la même position de la suite.
  const saisieRef = useRef([])

  // Défilement de la séquence à mémoriser.
  useEffect(() => {
    if (phase !== 'montre') return undefined
    if (step >= sequence.length) {
      setAllumee(null)
      setPhase('repete')
      return undefined
    }
    setAllumee(sequence[step])
    const extinction = window.setTimeout(() => setAllumee(null), DUREE_ALLUMEE)
    const suivant = window.setTimeout(() => setStep(step + 1), DUREE_PAS)
    return () => {
      window.clearTimeout(extinction)
      window.clearTimeout(suivant)
    }
  }, [phase, step, sequence])

  const attendue = config.sens === 'inverse' ? [...sequence].reverse() : sequence

  const clic = (index) => {
    if (phase !== 'repete' || saisieRef.current.length >= attendue.length) return
    const position = saisieRef.current.length
    const suite = [...saisieRef.current, index]
    saisieRef.current = suite
    setSaisie(suite)

    if (index !== attendue[position]) {
      session.register(false)
      setPhase('rate')
      setFini(true)
      return
    }
    if (suite.length === attendue.length) {
      session.register(true)
      setEmpan(Math.max(empan, attendue.length))
      setPhase('reussi')
    }
  }

  const sequenceSuivante = () => {
    const taille = Math.min(sequence.length + 1, EMPAN_MAX)
    setSequence(creerSequence(cases, taille))
    saisieRef.current = []
    setSaisie([])
    setStep(0)
    setPhase('montre')
  }

  const replay = () => {
    session.reset()
    setSequence(creerSequence(cases, config.depart))
    saisieRef.current = []
    setSaisie([])
    setStep(0)
    setAllumee(null)
    setFini(false)
    setEmpan(0)
    setPhase('montre')
  }

  if (fini) {
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={replay}>
        <p className="muted">
          {empan === 0
            ? 'Aucune suite complète cette fois, on peut repartir plus lentement.'
            : `Empan atteint : ${empan} ${empan > 1 ? 'éléments' : 'élément'}${
                config.sens === 'inverse' ? ' (ordre inverse)' : ''
              }`}
        </p>
      </GameOver>
    )
  }

  const consigne =
    phase === 'montre'
      ? 'Regarde bien la suite…'
      : config.sens === 'inverse'
        ? 'À toi : reproduis la suite À L’ENVERS'
        : 'À toi : reproduis la suite dans le même ordre'

  return (
    <div className="game-board">
      <p className="game-round">
        Suite de {sequence.length} · {config.sens === 'inverse' ? 'ordre inverse' : 'ordre direct'}
      </p>
      <p className="game-prompt">{consigne}</p>

      <div
        className="memo-grid"
        style={{ gridTemplateColumns: `repeat(${colonnes}, minmax(72px, 110px))` }}
      >
        {Array.from({ length: cases }, (_, index) => (
          <button
            key={index}
            type="button"
            className={`memo-cell${allumee === index ? ' memo-cell--on' : ''}${
              phase === 'repete' ? ' memo-cell--active' : ''
            }`}
            disabled={phase !== 'repete'}
            aria-label={`Case ${index + 1}`}
            onClick={() => clic(index)}
          />
        ))}
      </div>

      <div className="memo-progress" aria-hidden="true">
        {attendue.map((_, index) => (
          <span
            key={index}
            className={`memo-dot${index < saisie.length ? ' memo-dot--done' : ''}`}
          />
        ))}
      </div>

      {phase === 'reussi' && (
        <>
          <Feedback status="correct" message="Suite complète, bravo !" />
          <div className="game-actions">
            <button type="button" className="btn btn--lg" onClick={sequenceSuivante}>
              Suite plus longue
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/** Suite aléatoire sans répétition immédiate de la même case. */
function creerSequence(cases, taille) {
  const suite = []
  for (let i = 0; i < taille; i += 1) {
    let index = randomInt(0, cases - 1)
    while (cases > 1 && index === suite[suite.length - 1]) index = randomInt(0, cases - 1)
    suite.push(index)
  }
  return suite
}
