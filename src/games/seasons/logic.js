/**
 * Building rounds of « Les quatre saisons ».
 *
 * A round names one season out of the four. It asks for it from a landscape,
 * from an object found in that season, from a clue sentence or from a month.
 * Seasons follow the meteorological calendar — the one children learn at
 * school: spring is March to May, summer June to August, autumn September to
 * November, winter December to February. The answer is computed once, so the
 * right option is always offered exactly once.
 */
import { noRepeatSeries, pick, randomInt, shuffle } from '../../lib/random.js'
import { OBJECT_SEASONS, objectLabel } from './drawings.jsx'

export const SEASONS = ['printemps', 'été', 'automne', 'hiver']

export const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

/** What one sees, wears or does in each season, as a sentence to place. */
export const CLUES = [
  [
    'Les bourgeons s’ouvrent et les premières fleurs apparaissent.',
    'Les oiseaux reviennent construire leurs nids.',
    'Les jours rallongent et il pleut souvent en averses.',
    'On cherche des œufs en chocolat dans le jardin à Pâques.',
  ],
  [
    'On part en vacances et on se baigne à la mer.',
    'Il fait très chaud et les jours sont les plus longs de l’année.',
    'On mange des glaces et on met son maillot de bain.',
    'On entend les cigales et on fait la sieste à l’ombre.',
  ],
  [
    'Les feuilles jaunissent et tombent des arbres.',
    'C’est la rentrée des classes et on ramasse des châtaignes.',
    'On sort son imperméable et ses bottes pour les premières pluies.',
    'On ramasse des champignons en forêt et on fait les vendanges.',
  ],
  [
    'Il neige et on fait un bonhomme de neige.',
    'Il fait très froid, on met un bonnet, une écharpe et des gants.',
    'Les nuits sont longues et on décore le sapin de Noël.',
    'Les arbres sont nus et le givre blanchit l’herbe.',
  ],
]

export const KINDS_BY_LEVEL = {
  easy: ['object', 'landscape'],
  medium: ['object', 'landscape', 'clue'],
  hard: ['object', 'landscape', 'clue', 'month'],
}

/** The meteorological season of a month (0 = January). */
export function seasonOfMonth(month) {
  return Math.floor(((month - 2 + 12) % 12) / 3)
}

function build(kind) {
  switch (kind) {
    case 'object': {
      const answer = randomInt(0, 3)
      const id = pick(OBJECT_SEASONS[answer])
      return {
        prompt: 'Dans quelle saison trouve-t-on cet objet ?',
        answer,
        picture: { type: 'object', id },
        explain: () => `${capitalize(objectLabel(id))} : c’est ${seasonLabel(answer)}.`,
      }
    }
    case 'landscape': {
      const answer = randomInt(0, 3)
      return {
        prompt: 'Quelle saison voit-on sur ce paysage ?',
        answer,
        picture: { type: 'landscape', season: answer },
        explain: () => `Ce paysage, c’est ${seasonLabel(answer)}.`,
      }
    }
    case 'month': {
      const month = randomInt(0, 11)
      return {
        prompt: `En quelle saison est-on en ${MONTHS[month]} ?`,
        answer: seasonOfMonth(month),
        picture: null,
        explain: () => `${capitalize(MONTHS[month])} est un mois ${seasonLabel(seasonOfMonth(month))}.`,
      }
    }
    default: {
      const answer = randomInt(0, 3)
      const clue = pick(CLUES[answer])
      return {
        prompt: `De quelle saison parle-t-on ? « ${clue} »`,
        answer,
        picture: null,
        explain: () => `Ce sont des choses qu’on voit ou qu’on fait ${seasonLabel(answer)}.`,
      }
    }
  }
}

function capitalize(text) {
  return `${text[0].toUpperCase()}${text.slice(1)}`
}

/** « au printemps », « en été », « en automne », « en hiver ». */
export function seasonLabel(season) {
  return season === 0 ? 'au printemps' : `en ${SEASONS[season]}`
}

/** The same question, the same picture or the same answer as the previous round. */
function repeats(previous, round) {
  if (previous === undefined) return false
  const same = (key) => JSON.stringify(previous[key]) === JSON.stringify(round[key])
  return same('answer') || (same('prompt') && same('picture'))
}

export function buildRound(kind) {
  const question = build(kind)
  const answer = SEASONS[question.answer]
  return {
    kind,
    prompt: question.prompt,
    answer,
    // All four seasons are offered: the question is which, not whether.
    options: shuffle([...SEASONS]),
    picture: question.picture,
    explanation: question.explain(),
  }
}

/** The whole session, drawn upfront: kinds rotate through the level's list,
 * and the same question never comes back twice in a row. */
export function buildSeries(config) {
  const kinds = KINDS_BY_LEVEL[config.level] ?? KINDS_BY_LEVEL.easy
  const series = []
  for (const kind of noRepeatSeries(kinds, config.rounds)) {
    let round = buildRound(kind)
    for (let attempt = 0; attempt < 40 && repeats(series.at(-1), round); attempt += 1) {
      round = buildRound(kind)
    }
    series.push(round)
  }
  return series
}
