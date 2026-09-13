import { Link } from 'react-router-dom'
import { CATEGORIES } from '../lib/categories.js'
import { GAMES } from '../games/registry.js'

export default function AboutPage() {
  return (
    <div className="stack prose">
      <h1>À propos d’Orthobox</h1>

      <p>
        Orthobox rassemble des jeux courts, utilisables tels quels pendant une séance
        d’orthophonie. L’application fonctionne entièrement dans le navigateur : une fois la page
        chargée une première fois, elle reste disponible hors ligne et peut être installée sur la
        tablette ou l’ordinateur du cabinet.
      </p>

      <h2>Les quatre domaines</h2>
      <ul>
        {CATEGORIES.map((category) => (
          <li key={category.id}>
            <strong>
              <span aria-hidden="true">{category.icon}</span> {category.label}
            </strong>{' '}
            — {category.description}
          </li>
        ))}
      </ul>

      <h2>Données et confidentialité</h2>
      <p>
        Aucun compte, aucun serveur, aucune donnée patient. Seules vos préférences d’affichage (les
        jeux mis en favori) sont conservées dans le navigateur, sur le poste utilisé. Les scores
        affichés pendant une partie servent au déroulement du jeu et disparaissent lorsqu’on le
        quitte.
      </p>

      <h2>Cadre d’utilisation</h2>
      <p>
        Ces jeux sont des supports de rééducation : ils ne constituent ni un test étalonné ni un
        outil de diagnostic. Le choix du jeu, du niveau et l’interprétation des réponses relèvent du
        praticien.
      </p>

      <h2>Ajouter un jeu</h2>
      <p>
        La galerie est modulaire : chaque jeu vit dans son propre dossier{' '}
        <code>src/games/&lt;id&gt;/</code> avec un fichier <code>game.js</code> qui le décrit. Le
        registre le détecte automatiquement, il n’y a aucune liste centrale à modifier. La marche à
        suivre détaillée est dans <code>src/games/README.md</code> du dépôt.
      </p>

      <p className="muted">{GAMES.length} jeux disponibles dans cette version.</p>

      <p>
        <Link to="/" className="btn">
          Revenir à la galerie
        </Link>
      </p>
    </div>
  )
}
