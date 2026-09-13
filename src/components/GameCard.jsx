import { Link } from 'react-router-dom'
import { getCategory } from '../lib/categories.js'

export default function GameCard({ game, isFavorite, onToggleFavorite }) {
  const category = getCategory(game.category)

  return (
    <article
      className="game-card"
      style={{ '--category': category.color, '--category-tint': category.tint }}
    >
      <button
        type="button"
        className="game-card__fav"
        aria-pressed={isFavorite}
        aria-label={
          isFavorite ? `Retirer ${game.title} des favoris` : `Ajouter ${game.title} aux favoris`
        }
        onClick={() => onToggleFavorite(game.id)}
      >
        {isFavorite ? '★' : '☆'}
      </button>

      <span className="game-card__icon" aria-hidden="true">
        {game.icon ?? category.icon}
      </span>

      <h3 className="game-card__title">
        <Link to={`/jeux/${game.id}`} className="game-card__link">
          {game.title}
        </Link>
      </h3>

      <p className="game-card__tagline">{game.tagline}</p>

      <ul className="game-card__objectives">
        {game.objectives.slice(0, 3).map((objective) => (
          <li key={objective}>{objective}</li>
        ))}
      </ul>

      <div className="game-card__meta">
        <span className="badge badge--category">{category.short}</span>
        <span className="badge">{game.ages}</span>
        <span className="badge">{game.duration}</span>
      </div>
    </article>
  )
}
