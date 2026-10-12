import { describe, expect, it } from 'vitest'
import { optionRuns } from '../src/lib/setting-options.js'

describe('optionRuns', () => {
  it('keeps the declared order and gathers consecutive options of a group', () => {
    const runs = optionRuns([
      { id: 'a', group: 'X' },
      { id: 'b', group: 'X' },
      { id: 'c', group: 'Y' },
      { id: 'd', group: 'X' },
    ])
    expect(runs.map((run) => [run.group, run.options.map((option) => option.id)])).toEqual([
      ['X', ['a', 'b']],
      ['Y', ['c']],
      ['X', ['d']],
    ])
  })

  it('leaves options without a group outside any heading, one run each', () => {
    const runs = optionRuns([{ id: 'a', group: 'X' }, { id: 'b' }, { id: 'c' }])
    expect(runs.map((run) => run.group)).toEqual(['X', null, null])
    expect(runs.flatMap((run) => run.options.map((option) => option.id))).toEqual(['a', 'b', 'c'])
  })

  it('returns nothing for nothing', () => {
    expect(optionRuns([])).toEqual([])
  })
})
