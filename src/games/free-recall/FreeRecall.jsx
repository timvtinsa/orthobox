/**
 * Free recall: unprompted restitution of a word list.
 *
 * Three recall modes share the same list and the same scoring: typing
 * (the practitioner enters what the patient dictates), a word cloud (the
 * patient points at the right words among lures) and oral (the practitioner
 * simply validates each word said aloud, nothing to type). Whichever mode
 * fills it, `recalled` stays a plain array of words, so the results screen
 * below needs no branching of its own.
 *
 * The comparison ignores case and accents: memory is what is assessed here,
 * not spelling.
 */
import { useRef, useState } from 'react'
import StudyPhase from '../../components/StudyPhase.jsx'
import { COMMON_WORDS, sameWord } from '../../lib/lexicon.js'
import { sample, shuffle } from '../../lib/random.js'

/** The list to memorise, plus whatever board a non-typed mode needs to show
 * during recall: a mixed cloud of list words and lures, or the list itself
 * in a fresh order for a practitioner-only checklist. */
function buildMaterial(config) {
  const list = sample(COMMON_WORDS, config.count)
  const mode = config.mode ?? 'text'

  let board = []
  if (mode === 'cloud') {
    const lures = sample(
      COMMON_WORDS.filter((word) => !list.includes(word)),
      list.length,
    )
    board = shuffle([...list, ...lures])
  } else if (mode === 'oral') {
    board = shuffle(list)
  }

  return { list, board }
}

export default function FreeRecall({ config, session }) {
  const mode = config.mode ?? 'text'
  const [phase, setPhase] = useState('study')
  const [material, setMaterial] = useState(() => buildMaterial(config))
  const [input, setInput] = useState('')
  const [recalled, setRecalled] = useState([])
  const field = useRef(null)

  const { list, board } = material

  const restart = () => {
    setMaterial(buildMaterial(config))
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

  const toggle = (word) => {
    setRecalled((current) =>
      current.includes(word) ? current.filter((item) => item !== word) : [...current, word],
    )
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

        {mode === 'text' && (
          <>
            <p className="game-instruction">
              Le praticien peut saisir les mots dictés par le patient. L’ordre n’a pas
              d’importance ; l’orthographe et les accents ne sont pas pris en compte.
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
          </>
        )}

        {(mode === 'cloud' || mode === 'oral') && (
          <>
            <p className="game-instruction">
              {mode === 'cloud'
                ? 'Le patient touche, parmi ce nuage, les mots dont il se souvient.'
                : 'Le patient rappelle les mots à voix haute ; le praticien touche chacun d’eux au fur et à mesure, sans rien saisir.'}
            </p>
            <div className="recall-chips">
              {board.map((word) => {
                const selected = recalled.includes(word)
                return (
                  <button
                    key={word}
                    type="button"
                    className="chip chip--toggle"
                    aria-pressed={selected}
                    onClick={() => toggle(word)}
                  >
                    {word}
                  </button>
                )
              })}
            </div>
          </>
        )}

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
