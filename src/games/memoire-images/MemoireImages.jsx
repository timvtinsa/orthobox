/**
 * La planche d'images : mémorisation puis reconnaissance visuelle.
 *
 * Le test présente autant d'images nouvelles que d'images de la planche, ce
 * qui permet de distinguer les oublis des faux souvenirs.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import StudyPhase from '../../components/StudyPhase.jsx'
import { PICTOS, Picto } from '../../lib/pictos.jsx'
import { sample, shuffle } from '../../lib/random.js'

function preparer({ nombre }) {
  const tirage = sample(PICTOS, Math.min(nombre * 2, PICTOS.length))
  const planche = tirage.slice(0, nombre)
  const intrus = tirage.slice(nombre)
  const epreuves = shuffle([
    ...planche.map((picto) => ({ picto, dansLaPlanche: true })),
    ...intrus.map((picto) => ({ picto, dansLaPlanche: false })),
  ])
  return { planche, epreuves }
}

export default function MemoireImages({ config, session }) {
  const [phase, setPhase] = useState('memorisation')
  const [partie, setPartie] = useState(() => preparer(config))
  const [index, setIndex] = useState(0)
  const [reponses, setReponses] = useState([])
  const [dernier, setDernier] = useState(null)

  const avecNoms = config.noms === 'avec'

  const demarrer = () => {
    setPartie(preparer(config))
    setIndex(0)
    setReponses([])
    setDernier(null)
    setPhase('memorisation')
  }

  const repondre = (reponseOui) => {
    const epreuve = partie.epreuves[index]
    const juste = reponseOui === epreuve.dansLaPlanche
    session.register(juste)
    setReponses((current) => [...current, { ...epreuve, juste }])
    setDernier(juste ? 'correct' : 'wrong')
    if (index + 1 >= partie.epreuves.length) setPhase('resultats')
    else setIndex(index + 1)
  }

  if (phase === 'memorisation') {
    return (
      <StudyPhase
        seconds={config.duree}
        instruction="Retiens bien ces images"
        onDone={() => setPhase('test')}
      >
        <ul className="picture-grid">
          {partie.planche.map(({ id, label }) => (
            <li key={id} className="picture-card">
              <Picto id={id} title={avecNoms ? undefined : label} />
              {avecNoms && <span className="picture-card__label">{label}</span>}
            </li>
          ))}
        </ul>
      </StudyPhase>
    )
  }

  if (phase === 'test') {
    const { picto } = partie.epreuves[index]
    return (
      <div className="game-board">
        <p className="game-round">
          Image {index + 1} sur {partie.epreuves.length}
        </p>
        <p className="game-prompt">Cette image était-elle affichée ?</p>

        <div className="picture-card picture-card--large">
          <Picto id={picto.id} size={132} title={picto.label} />
        </div>

        <div className="game-actions">
          <button type="button" className="btn btn--lg" onClick={() => repondre(true)}>
            Oui, elle y était
          </button>
          <button type="button" className="btn btn--ghost btn--lg" onClick={() => repondre(false)}>
            Non, elle est nouvelle
          </button>
        </div>

        <Feedback status={dernier} message={dernier === null ? ' ' : undefined} />
      </div>
    )
  }

  const justes = reponses.filter((item) => item.juste).length
  const oubliees = reponses.filter((item) => item.dansLaPlanche && !item.juste)

  return (
    <div className="game-final">
      <p className="game-round">Résultats</p>
      <p className="game-final__score">
        {justes} / {reponses.length}
      </p>

      <ul className="picture-grid">
        {partie.planche.map(({ id, label }) => {
          const ratee = oubliees.some((item) => item.picto.id === id)
          return (
            <li
              key={id}
              className={`picture-card ${ratee ? 'picture-card--wrong' : 'picture-card--correct'}`}
            >
              <Picto id={id} size={56} title={label} />
              <span className="picture-card__label">{label}</span>
            </li>
          )
        })}
      </ul>

      <div className="game-actions">
        <button type="button" className="btn btn--lg" onClick={demarrer}>
          Nouvelle planche
        </button>
      </div>
    </div>
  )
}
