import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="panel stack empty">
      <h1>Page introuvable</h1>
      <p className="muted">
        Ce jeu n’existe pas (ou plus). Retournez à la galerie pour choisir une activité.
      </p>
      <p>
        <Link to="/" className="btn">
          Revenir à la galerie
        </Link>
      </p>
    </div>
  )
}
