/**
 * « Découvrir Orthobox »: a single short page that presents the application to
 * a practitioner who has never seen it, at `#/what`.
 *
 * It is meant to be sent as a link. It carries no setting and keeps nothing, so
 * it can be opened from any device, and its figures (number of games, games per
 * domain) are read from the catalogue rather than typed, so it never lags
 * behind the application.
 */
import { Link } from 'react-router-dom'
import CategoryShape from '../components/CategoryShape.jsx'
import { CATEGORIES, categoryStyle } from '../lib/categories.js'
import { GAMES } from '../games/registry.js'

const STEPS = [
  {
    title: 'Choisissez un jeu',
    text: 'La galerie range les jeux par domaine. Une recherche par mot permet de le retrouver vite.',
  },
  {
    title: 'Réglez-le',
    text: 'Nombre d’essais, consigne, matériel : tout se règle avant de commencer, et le patient ne voit rien avant « Démarrer ».',
  },
  {
    title: 'Jouez, ou composez une séance',
    text: 'Lancez le jeu tel quel, ou enchaînez plusieurs jeux dans « Séance » et imprimez le bilan à la fin.',
  },
]

const GOOD_TO_KNOW = [
  {
    title: 'Aucune donnée patient',
    text: 'Rien n’est envoyé nulle part. Le navigateur garde seulement vos favoris, le mode choisi et la séance en préparation.',
  },
  {
    title: 'Un mode Enfant',
    text: 'Un petit renard encourage. Le matériel, les réglages et le calcul du score ne changent pas.',
  },
  {
    title: 'Un lien pour partager',
    text: '« Partager ces réglages » ou « Partager la séance » donne un lien et un QR code, sans aucune donnée patient.',
  },
]

const COUNTS = GAMES.reduce((counts, game) => {
  counts[game.category] = (counts[game.category] ?? 0) + 1
  return counts
}, {})

export default function WhatPage() {
  return (
    <div className="what stack">
      <section className="what__hero">
        <h1 className="what__title">Orthobox, des jeux prêts pour la séance</h1>
        <p className="what__lead">
          {GAMES.length} jeux d’orthophonie à utiliser tels quels sur tablette ou ordinateur, pour le
          langage oral, le langage écrit, les fonctions exécutives et la cognition mathématique.
        </p>
        <ul className="what__promises" aria-label="En bref">
          <li>Gratuit</li>
          <li>Sans compte, sans publicité</li>
          <li>Fonctionne sans connexion une fois chargé</li>
        </ul>
        <div className="what__actions">
          <Link to="/" className="btn btn--lg">
            Ouvrir la galerie
          </Link>
          <Link to="/session" className="btn btn--lg btn--ghost">
            Préparer une séance
          </Link>
        </div>
      </section>

      <section aria-labelledby="what-steps">
        <h2 id="what-steps" className="what__heading">
          Comment ça marche
        </h2>
        <ol className="what__steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="panel what__step">
              <span className="what__number" aria-hidden="true">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="what-domains">
        <h2 id="what-domains" className="what__heading">
          Quatre domaines
        </h2>
        <ul className="what__domains">
          {CATEGORIES.map((category) => (
            <li key={category.id} className="what__domain" style={categoryStyle(category)}>
              <h3>
                <CategoryShape shape={category.shape} size={16} />
                {category.label}
              </h3>
              <p>{category.description}</p>
              <p className="what__count">{COUNTS[category.id] ?? 0} jeux</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="what-know">
        <h2 id="what-know" className="what__heading">
          Bon à savoir
        </h2>
        <ul className="what__know">
          {GOOD_TO_KNOW.map((item) => (
            <li key={item.title} className="panel">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="what__scope">
        Orthobox propose du matériel de rééducation : ce n’est ni un test standardisé, ni un outil de
        diagnostic. Le choix du jeu, du niveau et l’interprétation des réponses restent à la
        praticienne.
      </p>
    </div>
  )
}
