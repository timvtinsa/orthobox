/**
 * Free recall: unprompted restitution of a word list.
 *
 * The comparison ignores case and accents: memory is what is assessed here,
 * not spelling.
 */
import { useRef, useState } from 'react'
import StudyPhase from '../../components/StudyPhase.jsx'
import { COMMON_WORDS, sameWord } from '../../lib/lexicon.js'
import { sample } from '../../lib/random.js'

export default function FreeRecall({ config, session }) {
  const [phase, setPhase] = useState('study')
  const [list, setList] = useState(() => sample(COMMON_WORDS, config.count))
  const [input, setInput] = useState('')
  const [recalled, setRecalled] = useState([])
  const field = useRef(null)

  const restart = () => {
    setList(sample(COMMON_WORDS, config.count))
    setRecalled([])
    setInput('')
    setPhase('study')
  }

  const add = (event) => {
    event.preventDefault()
    const word = input.trim()
    if (!word) return
    // A word already given does not count twice.
    if (recalled.some((item) => sameWord(item, word))) {
      setInput('')
      return
    }
    setRecalled([...recalled, word])
    setInput('')
    field.current?.focus()
  }

  const finish = () => {
    // One point per word of the list: recalled or not.
    for (const word of list) {
      session.register(recalled.some((given) => sameWord(given, word)))
    }
    setPhase('results')
  }

  if (phase === 'study') {
    return (
      <StudyPhase
        seconds={config.duration}
        instruction="Retiens bien ces mots"
        onDone={() => setPhase('recall')}
      >
        <ul className="word-list">
          {list.map((word) => (
            <li key={word} className="word-list__item">
              {word}
            </li>
          ))}
        </ul>
      </StudyPhase>
    )
  }

  if (phase === 'recall') {
    return (
      <div className="game-board">
        <p className="game-round">Rappel</p>
        <p className="game-prompt">Quels mots étaient dans la liste ?</p>
        <p className="game-instruction">
          Le praticien peut saisir les mots dictés par le patient. L’ordre n’a pas d’importance ;
          l’orthographe et les accents ne sont pas pris en compte.
        </p>

        <form className="recall-form" onSubmit={add}>
          <label htmlFor="recall-word" className="visually-hidden">
            Mot rappelé
          </label>
          <input
            id="recall-word"
            ref={field}
            className="text-input"
            type="text"
            autoComplete="off"
            placeholder="Un mot, puis Entrée…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit" className="btn" disabled={input.trim() === ''}>
            Ajouter
          </button>
        </form>

        <div className="recall-chips">
          {recalled.map((word) => (
            <span key={word} className="chip">
              {word}
              <button
                type="button"
                className="chip__remove"
                aria-label={`Retirer ${word}`}
                onClick={() => setRecalled(recalled.filter((item) => item !== word))}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <button type="button" className="btn btn--lg" onClick={finish}>
          Terminer le rappel ({recalled.length}/{list.length})
        </button>
      </div>
    )
  }

  const found = list.filter((word) => recalled.some((given) => sameWord(given, word)))
  const missed = list.filter((word) => !found.includes(word))
  const oddOne = recalled.filter((given) => !list.some((word) => sameWord(given, word)))

  return (
    <div className="game-final">
      <p className="game-round">Résultats</p>
      <p className="game-final__score">
        {found.length} / {list.length}
      </p>
      <p className="muted">
        {missed.length === 0
          ? 'Liste restituée en entier.'
          : `${missed.length} mot${missed.length > 1 ? 's' : ''} non rappelé${missed.length > 1 ? 's' : ''}.`}
        {oddOne.length > 0 &&
          ` ${oddOne.length} mot${oddOne.length > 1 ? 's' : ''} ajouté${oddOne.length > 1 ? 's' : ''} hors liste.`}
      </p>

      <div className="recall-chips">
        {list.map((word) => (
          <span
            key={word}
            className={`chip ${found.includes(word) ? 'chip--found' : 'chip--missed'}`}
          >
            {word}
          </span>
        ))}
        {oddOne.map((word) => (
          <span key={word} className="chip chip--intruder">
            {word}
          </span>
        ))}
      </div>

      <div className="game-actions">
        <button type="button" className="btn btn--lg" onClick={restart}>
          Nouvelle liste
        </button>
      </div>
    </div>
  )
}
