/**
 * La suite de sons : mémoire auditive séquentielle.
 *
 * Les cartes ne sont montrées qu'après la première écoute, pour que la suite
 * soit mémorisée à l'oreille et non associée visuellement.
 */
import { useEffect, useRef, useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { useRounds } from '../../hooks/useRounds.js'
import {
  ANIMAUX,
  SONS,
  aUnEnregistrement,
  isAudioAvailable,
  jouerSuite,
  prechargerSons,
  preparerAudio,
} from '../../lib/audio.js'
import { Picto } from '../../lib/pictos.jsx'
import { isSpeechAvailable, speakSequence } from '../../lib/speech.js'
import { sample, shuffle } from '../../lib/random.js'

function tirerSuite(config) {
  const banque = config.banque === 'animaux' ? ANIMAUX : SONS
  return sample(banque, Math.min(config.longueur, banque.length))
}

export default function SuiteSons({ config, session }) {
  const rounds = useRounds(config.manches)
  const [suite, setSuite] = useState(() => tirerSuite(config))
  const [cartes, setCartes] = useState(() => shuffle(suite))
  const [proposition, setProposition] = useState([])
  const [ecoutes, setEcoutes] = useState(0)
  const [enLecture, setEnLecture] = useState(false)
  const [resultat, setResultat] = useState(null)
  const minuterie = useRef(null)

  // Les animaux n'ont pas de bruitage de synthèse : sans fichier audio dans
  // public/sons/, c'est la voix de l'appareil qui les nomme.
  const [enregistrements, setEnregistrements] = useState(false)
  const parole = config.banque === 'animaux' && !enregistrements
  const disponible = parole ? isSpeechAvailable() : isAudioAvailable()
  const reecoutesRestantes = config.reecoutes - Math.max(0, ecoutes - 1)

  useEffect(() => () => window.clearTimeout(minuterie.current), [])

  // Un fichier déposé dans public/sons/ remplace le son de synthèse.
  useEffect(() => {
    let actif = true
    prechargerSons(suite).then(() => {
      if (actif) setEnregistrements(suite.every((son) => aUnEnregistrement(son.id)))
    })
    return () => {
      actif = false
    }
  }, [suite])

  const ecouter = () => {
    if (enLecture) return
    preparerAudio()
    setEnLecture(true)
    setEcoutes((nombre) => nombre + 1)

    if (parole) {
      speakSequence(
        suite.map((item) => item.label),
        { onFin: () => setEnLecture(false) },
      )
      return
    }
    const duree = jouerSuite(suite)
    minuterie.current = window.setTimeout(() => setEnLecture(false), duree * 1000)
  }

  const ajouter = (carte) => {
    if (resultat || enLecture) return
    if (proposition.some((item) => item.id === carte.id)) return
    const suivante = [...proposition, carte]
    setProposition(suivante)
    if (suivante.length === suite.length) {
      const exact = suivante.every((item, index) => item.id === suite[index].id)
      session.register(exact)
      setResultat(exact ? 'correct' : 'wrong')
    }
  }

  const nouvelleManche = () => {
    const prochaine = tirerSuite(config)
    setSuite(prochaine)
    setCartes(shuffle(prochaine))
    setProposition([])
    setResultat(null)
    setEcoutes(0)
    rounds.next()
  }

  const rejouer = () => {
    session.reset()
    rounds.restart()
    const prochaine = tirerSuite(config)
    setSuite(prochaine)
    setCartes(shuffle(prochaine))
    setProposition([])
    setResultat(null)
    setEcoutes(0)
  }

  if (rounds.isOver) {
    return <GameOver correct={session.correct} total={session.attempts} onReplay={rejouer} />
  }

  if (!disponible) {
    return (
      <div className="game-board">
        <p className="game-prompt">Son indisponible sur ce poste</p>
        <p className="game-instruction">
          {parole
            ? 'La banque « animaux » utilise la voix de l’appareil, et aucune voix n’est installée ici. Choisissez « bruits du quotidien » dans les réglages : ces sons sont fabriqués par l’application.'
            : 'Ce navigateur ne fournit pas la synthèse audio nécessaire aux bruitages.'}
        </p>
      </div>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        Suite {rounds.round + 1} sur {rounds.total} · {suite.length} sons
      </p>

      {ecoutes === 0 ? (
        <>
          <p className="game-prompt">Écoute bien la suite de sons</p>
          <p className="game-instruction">
            Les cartes ne sont montrées qu’après l’écoute : il faut retenir l’ordre des sons.
          </p>
          <button type="button" className="btn btn--lg" onClick={ecouter} disabled={enLecture}>
            {enLecture ? 'Écoute…' : 'Écouter la suite'}
          </button>
        </>
      ) : (
        <>
          <p className="game-prompt">Remets les cartes dans l’ordre entendu</p>

          <div className="ordre-slot">
            {suite.map((_, index) => {
              const carte = proposition[index]
              const juste = resultat && carte && carte.id === suite[index].id
              const faux = resultat && carte && carte.id !== suite[index].id
              return (
                <div
                  key={index}
                  className={`ordre-case${juste ? ' ordre-case--juste' : ''}${
                    faux ? ' ordre-case--faux' : ''
                  }`}
                >
                  <span className="ordre-case__rang">{index + 1}</span>
                  {carte ? <Picto id={carte.picto} size={52} title={carte.label} /> : null}
                </div>
              )
            })}
          </div>

          <div className="token-row">
            {cartes.map((carte) => {
              const place = proposition.some((item) => item.id === carte.id)
              return (
                <button
                  key={carte.id}
                  type="button"
                  className={`son-carte${place ? ' son-carte--placee' : ''}`}
                  disabled={place || Boolean(resultat) || enLecture}
                  aria-label={carte.label}
                  onClick={() => ajouter(carte)}
                >
                  <Picto id={carte.picto} size={56} />
                  <span className="son-carte__label">{carte.label}</span>
                </button>
              )
            })}
          </div>

          {!resultat && (
            <div className="game-actions">
              <button
                type="button"
                className="btn btn--subtle"
                onClick={ecouter}
                disabled={enLecture || reecoutesRestantes <= 0}
              >
                {reecoutesRestantes > 0
                  ? `Réécouter (${reecoutesRestantes} restante${reecoutesRestantes > 1 ? 's' : ''})`
                  : 'Plus de réécoute'}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setProposition([])}
                disabled={proposition.length === 0 || enLecture}
              >
                Effacer
              </button>
            </div>
          )}

          {resultat && (
            <>
              <Feedback
                status={resultat}
                message={
                  resultat === 'correct'
                    ? 'Suite reconstituée dans le bon ordre !'
                    : `Ordre entendu : ${suite.map((item) => item.label).join(', ')}.`
                }
              />
              <div className="game-actions">
                <button type="button" className="btn btn--lg" onClick={nouvelleManche}>
                  Suite suivante
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
