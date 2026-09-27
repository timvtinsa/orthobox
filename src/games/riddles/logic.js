import { noRepeatSeries } from '../../lib/random.js'
import { RIDDLES } from './data.js'

/** The whole session's riddles, drawn upfront from the chosen theme. */
export function buildDeck(config) {
  const byTheme = RIDDLES.filter((item) => item.theme === config.theme)
  const pool = config.theme === 'mixed' || byTheme.length === 0 ? RIDDLES : byTheme
  return noRepeatSeries(pool, config.rounds)
}
