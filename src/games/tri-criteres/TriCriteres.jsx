/**
 * Le tri des formes : classer des objets selon un critère.
 *
 * Le réglage « règle qui change » bascule le critère à mi parcours, ce qui
 * met à l'épreuve la flexibilité plutôt que la seule catégorisation.
 */
import { useState } from 'react'
import Feedback from '../../components/Feedback.jsx'
import GameOver from '../../components/GameOver.jsx'
import { shuffle } from '../../lib/random.js'
import { COULEURS, FORMES, FormeColoree } from './formes.jsx'

/**
 * Répartition en carré latin : dès quatre objets, les quatre formes et les
 * quatre couleurs sont représentées, donc tous les bacs servent quel que soit
 * le critère de tri.
 */
function distribuer(nombre) {
  const objets = []
  for (let i = 0; i < nombre; i += 1) {
    objets.push({
      cle: `objet-${i}`,
      forme: FORMES[i % FORMES.length].id,
      couleur: COULEURS[(i + Math.floor(i / FORMES.length)) % COULEURS.length].id,
    })
  }
  return shuffle(objets)
}

export default function TriCriteres({ config, session }) {
  const [objets, setObjets] = useState(() => distribuer(config.nombre))
  const [classes, setClasses] = useState([])
  const [selection, setSelection] = useState(null)
  const [erreur, setErreur] = useState(null)

  // En mode « critère qui change », on trie par couleur puis par forme.
  const bascule = Math.ceil(config.nombre / 2)
  const critere =
    config.critere === 'alterne'
      ? classes.length < bascule
        ? 'couleur'
        : 'forme'
      : config.critere
  const vientDeBasculer = config.critere === 'alterne' && classes.length === bascule

  const bacs = critere === 'couleur' ? COULEURS : FORMES

  const deposer = (bac) => {
    if (!selection) return
    const juste = (critere === 'couleur' ? selection.couleur : selection.forme) === bac.id
    session.register(juste)
    if (juste) {
      setClasses([...classes, { ...selection, bac: bac.id, critere }])
      setObjets(objets.filter((objet) => objet.cle !== selection.cle))
      setSelection(null)
      setErreur(null)
    } else {
      setErreur(bac.id)
      setSelection(null)
    }
  }

  const rejouer = () => {
    session.reset()
    setObjets(distribuer(config.nombre))
    setClasses([])
    setSelection(null)
    setErreur(null)
  }

  if (objets.length === 0) {
    return (
      <GameOver correct={session.correct} total={session.attempts} onReplay={rejouer}>
        <p className="muted">
          {config.nombre} objets classés en {session.attempts} dépôts.
        </p>
      </GameOver>
    )
  }

  return (
    <div className="game-board">
      <p className="game-round">
        {classes.length} objet{classes.length > 1 ? 's' : ''} classé
        {classes.length > 1 ? 's' : ''} sur {config.nombre}
      </p>
      <p className="game-prompt">
        {critere === 'couleur' ? 'Range les objets par couleur' : 'Range les objets par forme'}
      </p>

      {vientDeBasculer && (
        <p className="rule-change">
          Attention, la règle change : on ne trie plus par couleur, mais par forme.
        </p>
      )}

      <p className="game-instruction">
        Choisis un objet, puis touche le bac où il doit aller.
      </p>

      <div className="tri-reserve">
        {objets.map((objet) => (
          <button
            key={objet.cle}
            type="button"
            className={`tri-objet${selection?.cle === objet.cle ? ' tri-objet--choisi' : ''}`}
            aria-pressed={selection?.cle === objet.cle}
            aria-label={`${FORMES.find((f) => f.id === objet.forme).label} ${
              COULEURS.find((c) => c.id === objet.couleur).label
            }`}
            onClick={() => {
              setSelection(objet)
              setErreur(null)
            }}
          >
            <FormeColoree forme={objet.forme} couleur={objet.couleur} />
          </button>
        ))}
      </div>

      <div className="tri-bacs">
        {bacs.map((bac) => {
          const contenu = classes.filter((objet) => objet.bac === bac.id && objet.critere === critere)
          return (
            <button
              key={bac.id}
              type="button"
              className={`tri-bac${erreur === bac.id ? ' tri-bac--erreur' : ''}${
                selection ? ' tri-bac--actif' : ''
              }`}
              disabled={!selection}
              onClick={() => deposer(bac)}
            >
              <span className="tri-bac__titre">{bac.pluriel}</span>
              <span className="tri-bac__apercu">
                {critere === 'couleur' ? (
                  <FormeColoree forme="rond" couleur={bac.id} size={30} />
                ) : (
                  <FormeColoree forme={bac.id} couleur="bleu" size={30} />
                )}
              </span>
              <span className="tri-bac__compte">{contenu.length}</span>
            </button>
          )
        })}
      </div>

      <Feedback
        status={erreur ? 'wrong' : null}
        message={erreur ? 'Pas dans ce bac : regarde bien la consigne.' : ' '}
      />
    </div>
  )
}
