/**
 * Building rounds of « Les jours de la semaine ».
 *
 * The week is a cycle: the day after Sunday is Monday. Every round is one
 * question about a position on that cycle, asked in the different ways a
 * child meets it in daily life (the day after, tomorrow, in three days...).
 * The answer is computed once, from the position and an offset, so the right
 * option is always offered exactly once.
 */
import { noRepeatSeries, randomInt, sample, shuffle } from '../../lib/random.js'

export const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

const ORDINALS = ['premier', 'deuxième', 'troisième', 'quatrième', 'cinquième', 'sixième', 'septième']

export const KINDS_BY_LEVEL = {
  easy: ['tomorrow', 'yesterday'],
  medium: ['tomorrow', 'yesterday', 'afterTomorrow', 'beforeYesterday', 'between'],
  hard: ['afterTomorrow', 'beforeYesterday', 'between', 'later', 'earlier', 'position'],
}

/** Position on the week's cycle, whatever the offset's sign or size. */
export function wrap(index) {
  return ((index % 7) + 7) % 7
}

function build(kind) {
  const from = randomInt(0, 6)
  const day = DAYS[from]

  switch (kind) {
    case 'tomorrow':
      return {
        prompt: `Aujourd’hui, c’est ${day}. Quel jour sera-t-on demain ?`,
        answer: wrap(from + 1),
        pivots: [from],
        explain: (answer) => `Si on est ${day}, demain on sera ${answer}.`,
      }
    case 'yesterday':
      return {
        prompt: `Aujourd’hui, c’est ${day}. Quel jour était-on hier ?`,
        answer: wrap(from - 1),
        pivots: [from],
        explain: (answer) => `Si on est ${day}, hier on était ${answer}.`,
      }
    case 'afterTomorrow':
      return {
        prompt: `Aujourd’hui, c’est ${day}. Quel jour sera-t-on après-demain ?`,
        answer: wrap(from + 2),
        pivots: [from],
        explain: (answer) => `Si on est ${day}, après-demain on sera ${answer}.`,
      }
    case 'beforeYesterday':
      return {
        prompt: `Aujourd’hui, c’est ${day}. Quel jour était-on avant-hier ?`,
        answer: wrap(from - 2),
        pivots: [from],
        explain: (answer) => `Si on est ${day}, avant-hier on était ${answer}.`,
      }
    case 'between': {
      const to = wrap(from + 2)
      return {
        prompt: `Quel jour est entre ${day} et ${DAYS[to]} ?`,
        answer: wrap(from + 1),
        pivots: [from, to],
        explain: (answer) => `Entre ${day} et ${DAYS[to]}, il y a ${answer}.`,
      }
    }
    case 'later': {
      const gap = randomInt(2, 6)
      return {
        prompt: `Aujourd’hui, c’est ${day}. Quel jour sera-t-on dans ${gap} jours ?`,
        answer: wrap(from + gap),
        pivots: [from],
        explain: (answer) => `${gap} jours après ${day}, on sera ${answer}.`,
      }
    }
    case 'earlier': {
      const gap = randomInt(2, 6)
      return {
        prompt: `Aujourd’hui, c’est ${day}. Quel jour était-on il y a ${gap} jours ?`,
        answer: wrap(from - gap),
        pivots: [from],
        explain: (answer) => `${gap} jours avant ${day}, on était ${answer}.`,
      }
    }
    default: {
      const rank = randomInt(2, 7)
      return {
        prompt: `En comptant depuis lundi, quel est le ${ORDINALS[rank - 1]} jour de la semaine ?`,
        answer: rank - 1,
        pivots: [],
        explain: (answer) => `Le ${ORDINALS[rank - 1]} jour de la semaine est ${answer}, la semaine commençant le lundi.`,
      }
    }
  }
}

/** Three wrong days: the two neighbours of the answer — the usual slip of
 * one day — then random ones until there are three. */
function distractors(answer) {
  const near = [wrap(answer + 1), wrap(answer - 1)]
  const far = DAYS.map((_, index) => index).filter((index) => index !== answer && !near.includes(index))
  return [...shuffle(near).slice(0, 1 + randomInt(0, 1)), ...sample(far, 3)].slice(0, 3)
}

export function buildRound(kind) {
  const question = build(kind)
  const options = shuffle([question.answer, ...distractors(question.answer)]).map((index) => DAYS[index])
  const answer = DAYS[question.answer]
  return {
    kind,
    prompt: question.prompt,
    answer,
    options,
    pivots: question.pivots,
    explanation: question.explain(answer),
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
