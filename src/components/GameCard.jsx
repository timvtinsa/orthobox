/**
 * A game card in the gallery.
 *
 * It carries nothing but cover, domain, title and launch. No tagline, no
 * objectives, no score: nothing survives a session, so the card is identical
 * at the first launch and at the hundredth, and the practitioner always aims
 * at the same thing in the same place. The tagline and the objectives live in
 * the game page's instructions panel.
 */
import { Link } from 'react-router-dom'
import CategoryShape from './CategoryShape.jsx'
import Icon from './Icon.jsx'
import { categoryStyle, getCategory } from '../lib/categories.js'

export default function GameCard({ game, isFavorite, onToggleFavorite }) {
  const category = getCategory(game.category)

  return (
    <article className="game-card" style={categoryStyle(category)}>
      <div className="game-card__media">
        <img className="game-card__cover" src={game.cover} alt="" width="320" height="200" />

        <span className="game-card__domain">
          <CategoryShape shape={category.shape} size={8} />
          {category.short}
        </span>

        <button
          type="button"
          className="game-card__fav"
          aria-pressed={isFavorite}
          aria-label={
            isFavorite ? `Retirer ${game.title} des favoris` : `Ajouter ${game.title} aux favoris`
          }
          onClick={() => onToggleFavorite(game.id)}
        >
          <Icon name="star" size={18} filled={isFavorite} />
        </button>
      </div>

      <div className="game-card__body">
        <h3 className="game-card__title">
          <Link to={`/games/${game.id}`} className="game-card__link">
            {game.title}
          </Link>
        </h3>

        {/* Toute la carte reste cliquable : ce bouton ne donne qu'une cible
            sûre au doigt et rend l'action évidente. */}
        <span className="game-card__launch" aria-hidden="true">
          Lancer
        </span>
      </div>
    </article>
  )
}
