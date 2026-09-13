import { CATEGORIES } from '../lib/categories.js'

export default function CategoryFilter({ value, counts, onChange }) {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="filters" role="group" aria-label="Filtrer par domaine">
      <button
        type="button"
        className={`filter${value === 'all' ? ' filter--active' : ''}`}
        aria-pressed={value === 'all'}
        onClick={() => onChange('all')}
      >
        Tous les domaines <span className="filter__count">{total}</span>
      </button>

      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`filter${value === category.id ? ' filter--active' : ''}`}
          aria-pressed={value === category.id}
          style={{ '--category': category.color, '--category-tint': category.tint }}
          onClick={() => onChange(category.id)}
        >
          <span aria-hidden="true">{category.icon}</span> {category.label}
          <span className="filter__count">{counts[category.id] ?? 0}</span>
        </button>
      ))}
    </div>
  )
}
