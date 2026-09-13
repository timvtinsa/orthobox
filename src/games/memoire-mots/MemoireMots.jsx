/**
 * La liste de mots : mémorisation puis reconnaissance verbale.
 *
 * Le test présente autant de mots nouveaux que de mots de la liste, ce qui
 * permet de distinguer les oublis des faux souvenirs.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import StudyPhase from '../../components/StudyPhase.jsx'
import { MOTS_COURANTS } from '../../lib/lexique.js'
import { sample, shuffle } from '../../lib/random.js'

/**
 * Prépare une passation : les mots à mémoriser, puis la série d'épreuves
 * (autant de mots présentés que de mots nouveaux, mélangés).
 */
function preparer({ nombre }) {
  const tirage = sample(MOTS_COURANTS, nombre * 2)
  const liste = tirage.slice(0, nombre)
  const intrus = tirage.slice(nombre)
  const epreuves = shuffle([
    ...liste.map((mot) => ({ mot, dansLaListe: true })),
    ...intrus.map((mot) => ({ mot, dansLaListe: false })),
  ])
  return { liste, epreuves }
}

export default function MemoireMots({ config, session }) {
  const [phase, setPhase] = useState('memorisation')
  const [partie, setPartie] = useState(() => preparer(config))
  const [index, setIndex] = useState(0)
  const [reponses, setReponses] = useState([])
  const [dernier, setDernier] = useState(null)

  const demarrer = () => {
    setPartie(preparer(config))
    setIndex(0)
    setReponses([])
    setDernier(null)
    setPhase('memorisation')
  }

  const repondre = (reponseOui) => {
    const epreuve = partie.epreuves[index]
    const juste = reponseOui === epreuve.dansLaListe
    session.register(juste)
    setReponses((current) => [...current, { ...epreuve, reponseOui, juste }])
    setDernier(juste ? 'correct' : 'wrong')
    if (index + 1 >= partie.epreuves.length) {
      setPhase('resultats')
    } else {
      setIndex(index + 1)
    }
  }

  if (phase === 'memorisation') {
    return (
      <StudyPhase
        seconds={config.duree}
        instruction="Retiens bien ces mots"
        onDone={() => setPhase('test')}
      >
        <ul className="word-list">
          {partie.liste.map((mot) => (
            <li key={mot} className="word-list__item">
              {mot}
            </li>
          ))}
        </ul>
      </StudyPhase>
    )
  }

  if (phase === 'test') {
    const epreuve = partie.epreuves[index]
    return (
      <div className="game-board">
        <p className="game-round">
          Mot {index + 1} sur {partie.epreuves.length}
        </p>
        <p className="game-prompt">Ce mot était-il dans la liste ?</p>
        <p className="flash-word">{epreuve.mot}</p>

        <div className="game-actions">
          <button type="button" className="btn btn--lg" onClick={() => repondre(true)}>
            Oui, il y était
          </button>
          <button type="button" className="btn btn--ghost btn--lg" onClick={() => repondre(false)}>
            Non, il est nouveau
          </button>
        </div>

        <Feedback status={dernier} message={dernier === null ? ' ' : undefined} />
      </div>
    )
  }

  const oublies = reponses.filter((item) => item.dansLaListe && !item.juste)
  const fauxPositifs = reponses.filter((item) => !item.dansLaListe && !item.juste)
  const justes = reponses.filter((item) => item.juste).length

  return (
    <div className="game-final">
      <p className="game-round">Résultats</p>
      <p className="game-final__score">
        {justes} / {reponses.length}
      </p>
      <p className="muted">
        {oublies.length} mot{oublies.length > 1 ? 's' : ''} de la liste non reconnu
        {oublies.length > 1 ? 's' : ''} · {fauxPositifs.length} mot
        {fauxPositifs.length > 1 ? 's' : ''} nouveau{fauxPositifs.length > 1 ? 'x' : ''} pris pour
        un mot de la liste
      </p>

      <div className="recall-chips">
        {partie.liste.map((mot) => (
          <span
            key={mot}
            className={`chip ${oublies.some((item) => item.mot === mot) ? 'chip--missed' : 'chip--found'}`}
          >
            {mot}
          </span>
        ))}
      </div>

      <div className="game-actions">
        <button type="button" className="btn btn--lg" onClick={demarrer}>
          Nouvelle liste
        </button>
      </div>
    </div>
  )
}
