/**
 * Gallery: every game, filtered by domain and keyword.
 *
 * Pinned games are promoted to a row of their own above the domain sections,
 * rather than hidden behind a filter: the practitioner reaches their usual
 * games without giving up the view of the whole catalogue.
 */
import { useMemo, useState } from 'react'
import CategoryFilter from '../components/CategoryFilter.jsx'
import CategoryShape from '../components/CategoryShape.jsx'
import GameCard from '../components/GameCard.jsx'
import Icon from '../components/Icon.jsx'
import { CATEGORIES, categoryStyle, getCategory } from '../lib/categories.js'
import { GAMES, searchGames } from '../games/registry.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const COUNTS = GAMES.reduce((counts, game) => {
  counts[game.category] = (counts[game.category] ?? 0) + 1
  return counts
}, {})

export default function GalleryPage() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useLocalStorage('favorites', [])

  const toggleFavorite = (id) =>
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )

  const visible = useMemo(() => {
    let games = GAMES
    if (category !== 'all') games = games.filter((game) => game.category === category)
    return searchGames(games, query)
  }, [category, query])

  const pinned = visible.filter((game) => favorites.includes(game.id))

  const sections =
    category === 'all'
      ? CATEGORIES.map((entry) => ({
          category: entry,
          games: visible.filter((game) => game.category === entry.id),
        })).filter((section) => section.games.length > 0)
      : [{ category: getCategory(category), games: visible }]

  const renderCards = (games) => (
    <div className="game-grid">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          isFavorite={favorites.includes(game.id)}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  )

  return (
    <div className="gallery">
      <div className="toolbar">
        <div className="search">
          <label htmlFor="search" className="visually-hidden">
            Rechercher un jeu
          </label>
          <Icon name="search" className="search__icon" size={20} filled={false} />
          <input
            id="search"
            type="search"
            className="search__input"
            placeholder="Chercher un jeu"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <CategoryFilter value={category} counts={COUNTS} onChange={setCategory} />

      {visible.length === 0 && (
        <p className="empty panel">
          Aucun jeu ne correspond à cette recherche. Essayez un autre mot-clé, ou revenez à
          « Tous les domaines ».
        </p>
      )}

      {pinned.length > 0 && (
        <section className="category-section">
          <header className="category-section__header">
            <Icon name="star" size={18} className="category-section__star" />
            <h2 className="category-section__title">Épinglés</h2>
            <span className="category-section__count">
              {pinned.length} jeu{pinned.length > 1 ? 'x' : ''}
            </span>
            <span className="category-section__rule" />
          </header>
          {renderCards(pinned)}
        </section>
      )}

      {sections.map(({ category: entry, games }) => (
        <section key={entry.id} className="category-section" style={categoryStyle(entry)}>
          <header className="category-section__header">
            <CategoryShape shape={entry.shape} size={14} />
            <h2 className="category-section__title">{entry.label}</h2>
            <span className="category-section__count">
              {games.length} jeu{games.length > 1 ? 'x' : ''}
            </span>
            <span className="category-section__rule" />
          </header>
          {renderCards(games)}
        </section>
      ))}
    </div>
  )
}
