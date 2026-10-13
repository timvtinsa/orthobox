import { optionRuns } from '../lib/setting-options.js'

/**
 * A choice among many options, as a drop-down: for a setting whose list is
 * too long to show as cards (`display: 'select'` in the manifest). Options can
 * carry a `group`, drawn as a heading, and the hint of the option picked is
 * shown under the list, as the cards would show it.
 */
export default function SettingSelect({ labelId, value, options, onChange }) {
  const picked = options.find((option) => option.id === value)

  return (
    <div className="setting-select">
      <select
        className="setting-select__control"
        aria-labelledby={labelId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {optionRuns(options).map((run) =>
          run.group === null ? (
            run.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))
          ) : (
            <optgroup key={run.group} label={run.group}>
              {run.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ),
        )}
      </select>
      {picked?.hint && <p className="setting-select__hint">{picked.hint}</p>}
    </div>
  )
}
