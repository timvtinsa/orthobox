/**
 * Options of a `choice` setting, cut into runs of the same `group`, in the
 * order they are declared: `[{ group, options }]`. An option without a group
 * makes a run of its own with `group: null`, shown outside any heading. The
 * drop-down shown for a long list of options (`display: 'select'`) draws one
 * heading per run.
 */
export function optionRuns(options) {
  const runs = []
  for (const option of options) {
    const group = option.group ?? null
    const last = runs.at(-1)
    if (last && last.group === group && group !== null) last.options.push(option)
    else runs.push({ group, options: [option] })
  }
  return runs
}
