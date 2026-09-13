import { useMemo, useState } from 'react'
import CategoryFilter from '../components/CategoryFilter.jsx'
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
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [favorites, setFavorites] = useLocalStorage('favorites', [])

  const toggleFavorite = (id) =>
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )

  const visible = useMemo(() => {
    let games = GAMES
    if (category !== 'all') games = games.filter((game) => game.category === category)
    if (onlyFavorites) games = games.filter((game) => favorites.includes(game.id))
    return searchGames(games, query)
  }, [category, onlyFavorites, favorites, query])

  const sections =
    category === 'all'
      ? CATEGORIES.map((entry) => ({
          category: entry,
          games: visible.filter((game) => game.category === entry.id),
        })).filter((section) => section.games.length > 0)
      : [{ category: getCategory(category), games: visible }]

  return (
    <div className="stack">
      <section className="hero">
        <h1 className="hero__title">La boîte à jeux de la séance</h1>
        <p className="hero__text">
          {GAMES.length} jeux prêts à l’emploi, classés par domaine. Choisissez un jeu, réglez le
          niveau, puis lancez-le sur l’écran partagé avec le patient.
        </p>
      </section>

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
            placeholder="Rechercher un jeu, un objectif…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <button
          type="button"
          className={`filter${onlyFavorites ? ' filter--active' : ''}`}
          aria-pressed={onlyFavorites}
          onClick={() => setOnlyFavorites((value) => !value)}
        >
          <Icon name="star" size={18} filled={onlyFavorites} />
          Favoris <span className="filter__count">{favorites.length}</span>
        </button>
      </div>

      <CategoryFilter value={category} counts={COUNTS} onChange={setCategory} />

      {visible.length === 0 && (
        <p className="empty panel">
          Aucun jeu ne correspond à cette recherche. Essayez un autre mot-clé, ou revenez à
          « Tous les domaines ».
        </p>
      )}

      {sections.map(({ category: entry, games }) => (
        <section key={entry.id} className="category-section">
          <header className="category-section__header" style={categoryStyle(entry)}>
            <h2 className="category-section__title">{entry.label}</h2>
            <p className="category-section__desc muted">{entry.description}</p>
          </header>

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
        </section>
      ))}
    </div>
  )
}
