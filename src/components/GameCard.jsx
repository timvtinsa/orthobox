/**
 * Carte d'un jeu dans la galerie : vignette, accroche, objectifs, favori.
 */
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { categoryStyle, getCategory } from '../lib/categories.js'

export default function GameCard({ game, isFavorite, onToggleFavorite }) {
  const category = getCategory(game.category)

  return (
    <article className="game-card" style={categoryStyle(category)}>
      <img className="game-card__cover" src={game.cover} alt="" width="320" height="200" />

      <button
        type="button"
        className="game-card__fav"
        aria-pressed={isFavorite}
        aria-label={
          isFavorite ? `Retirer ${game.title} des favoris` : `Ajouter ${game.title} aux favoris`
        }
        onClick={() => onToggleFavorite(game.id)}
      >
        <Icon name="star" size={22} filled={isFavorite} />
      </button>

      <div className="game-card__body">
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
        </div>
      </div>
    </article>
  )
}
