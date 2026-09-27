import { noRepeatSeries, pick, sample, shuffle } from '../../lib/random.js'
import { ONSETS, RHYMES } from './data.js'

export function buildRoundFor(config, families, targetFamily) {
  const oddFamily = pick(families.filter((family) => family !== targetFamily))
  const words = sample(targetFamily.words, config.choices - 1)
  const oddOne = pick(oddFamily.words.filter((word) => !words.includes(word)))

  return {
    criterion: config.criterion,
    sound: targetFamily.sound,
    oddSound: oddFamily.sound,
    oddOne,
    options: shuffle([...words, oddOne]),
  }
}

/** The whole session's target families, drawn upfront so the same sound
 * family does not carry several rounds in a row while the bank has enough
 * to avoid it. The odd-one-out family is still drawn fresh each round. */
export function buildSeries(config) {
  const families = config.criterion === 'rhyme' ? RHYMES : ONSETS
  const targets = noRepeatSeries(families, config.rounds)
  return targets.map((targetFamily) => buildRoundFor(config, families, targetFamily))
}
