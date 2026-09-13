import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import SetupPanel from '../../components/SetupPanel.jsx'
import Stepper from '../../components/Stepper.jsx'
import StudyPhase from '../../components/StudyPhase.jsx'
import { MOTS_COURANTS } from '../../lib/lexique.js'
import { sample, shuffle } from '../../lib/random.js'

const REGLAGES_PAR_DEFAUT = { nombre: 7, duree: 10 }

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

export default function MemoireMots({ session }) {
  const [reglages, setReglages] = useState(REGLAGES_PAR_DEFAUT)
  const [phase, setPhase] = useState('reglages')
  const [partie, setPartie] = useState(null)
  const [index, setIndex] = useState(0)
  const [reponses, setReponses] = useState([])
  const [dernier, setDernier] = useState(null)

  const demarrer = () => {
    setPartie(preparer(reglages))
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

  if (phase === 'reglages') {
    return (
      <SetupPanel
        title="Réglages de la liste"
        description="Choisissez le nombre de mots et le temps de mémorisation avant de montrer l’écran au patient."
        onStart={demarrer}
        actionLabel="Afficher la liste"
      >
        <Stepper
          label="Nombre de mots"
          hint="Repère : 5 à 7 mots pour commencer."
          value={reglages.nombre}
          min={3}
          max={12}
          onChange={(nombre) => setReglages({ ...reglages, nombre })}
        />
        <Stepper
          label="Temps de mémorisation"
          hint="Le patient peut aussi passer au test dès qu’il se sent prêt."
          value={reglages.duree}
          min={5}
          max={60}
          step={5}
          suffix="s"
          onChange={(duree) => setReglages({ ...reglages, duree })}
        />
      </SetupPanel>
    )
  }

  if (phase === 'memorisation') {
    return (
      <StudyPhase
        seconds={reglages.duree}
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
        <button type="button" className="btn btn--ghost" onClick={() => setPhase('reglages')}>
          Changer les réglages
        </button>
      </div>
    </div>
  )
}
