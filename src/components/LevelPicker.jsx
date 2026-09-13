export default function LevelPicker({ levels, value, onChange }) {
  if (!levels || levels.length === 0) return null

  return (
    <div className="levels" role="group" aria-label="Niveau de difficulté">
      {levels.map((level) => (
        <button
          key={level.id}
          type="button"
          className={`level${level.id === value ? ' level--active' : ''}`}
          aria-pressed={level.id === value}
          title={level.hint}
          onClick={() => onChange(level.id)}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}
