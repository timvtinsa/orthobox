/**
 * Building rounds of « Les quatre saisons ».
 *
 * The year is a cycle of four seasons: after winter comes spring again. A
 * round is one question about a season's place on that cycle, or about what
 * happens in it (a clue, a month). Seasons follow the meteorological
 * calendar — the one children learn at school: spring is March to May,
 * summer June to August, autumn September to November, winter December to
 * February. The answer is computed once, so the right option is always
 * offered exactly once.
 */
import { noRepeatSeries, pick, randomInt, shuffle } from '../../lib/random.js'

export const SEASONS = ['printemps', 'été', 'automne', 'hiver']

const WITH_ARTICLE = ['le printemps', 'l’été', 'l’automne', 'l’hiver']

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
  easy: ['next', 'previous', 'clue'],
  medium: ['next', 'previous', 'clue', 'month', 'between'],
  hard: ['clue', 'month', 'between', 'later', 'earlier'],
}

const COUNT_WORDS = { 2: 'deux', 3: 'trois' }

/** Position on the year's cycle, whatever the offset's sign or size. */
export function wrap(index) {
  return ((index % 4) + 4) % 4
}

/** The meteorological season of a month (0 = January). */
export function seasonOfMonth(month) {
  return Math.floor(((month - 2 + 12) % 12) / 3)
}

function build(kind) {
  const from = randomInt(0, 3)
  const name = WITH_ARTICLE[from]

  switch (kind) {
    case 'next':
      return {
        prompt: `Quelle saison vient après ${name} ?`,
        answer: wrap(from + 1),
        pivots: [from],
        explain: () => `Après ${name} vient ${WITH_ARTICLE[wrap(from + 1)]}.`,
      }
    case 'previous':
      return {
        prompt: `Quelle saison vient avant ${name} ?`,
        answer: wrap(from - 1),
        pivots: [from],
        explain: () => `Avant ${name} vient ${WITH_ARTICLE[wrap(from - 1)]}.`,
      }
    case 'between':
      return {
        prompt: `Quelle saison vient après ${name} et avant ${WITH_ARTICLE[wrap(from + 2)]} ?`,
        answer: wrap(from + 1),
        pivots: [from, wrap(from + 2)],
        explain: () =>
          `Entre ${name} et ${WITH_ARTICLE[wrap(from + 2)]}, il y a ${WITH_ARTICLE[wrap(from + 1)]}.`,
      }
    case 'later': {
      const gap = randomInt(2, 3)
      return {
        prompt: `Quelle saison arrive ${COUNT_WORDS[gap]} saisons après ${name} ?`,
        answer: wrap(from + gap),
        pivots: [from],
        explain: () => `${COUNT_WORDS[gap]} saisons après ${name} arrive ${WITH_ARTICLE[wrap(from + gap)]}.`,
      }
    }
    case 'earlier': {
      const gap = randomInt(2, 3)
      return {
        prompt: `Quelle saison y avait-il ${COUNT_WORDS[gap]} saisons avant ${name} ?`,
        answer: wrap(from - gap),
        pivots: [from],
        explain: () => `${COUNT_WORDS[gap]} saisons avant ${name}, c’était ${WITH_ARTICLE[wrap(from - gap)]}.`,
      }
    }
    case 'month': {
      const month = randomInt(0, 11)
      return {
        prompt: `En quelle saison est-on en ${MONTHS[month]} ?`,
        answer: seasonOfMonth(month),
        pivots: [],
        explain: () => `${MONTHS[month][0].toUpperCase()}${MONTHS[month].slice(1)} est un mois ${seasonLabel(seasonOfMonth(month))}.`,
      }
    }
    default: {
      const answer = randomInt(0, 3)
      const clue = pick(CLUES[answer])
      return {
        prompt: `De quelle saison parle-t-on ? « ${clue} »`,
        answer,
        pivots: [],
        explain: () => `Ce sont des choses qu’on voit ou qu’on fait ${seasonLabel(answer)}.`,
      }
    }
  }
}

/** « au printemps », « en été », « en automne », « en hiver ». */
function seasonLabel(season) {
  return season === 0 ? 'au printemps' : `en ${SEASONS[season]}`
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
    pivots: question.pivots,
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
    for (let attempt = 0; attempt < 20 && series.at(-1)?.prompt === round.prompt; attempt += 1) {
      round = buildRound(kind)
    }
    series.push(round)
  }
  return series
}
