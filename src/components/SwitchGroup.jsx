/** A choice between a few exclusive options (2 to 4). */
export default function SwitchGroup({ labelId, value, options, onChange }) {
  return (
    <div className="switch-group" role="group" aria-labelledby={labelId}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`switch-group__option${
            option.id === value ? ' switch-group__option--active' : ''
          }`}
          aria-pressed={option.id === value}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
