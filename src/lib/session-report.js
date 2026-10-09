/**
 * The session report: what was played and how it went.
 *
 * Built from the plan and the result of each step, once the session is over.
 * Nothing is stored: the report is shown, printed, copied or downloaded, and
 * disappears with the page, like the scores it is made of.
 */
import { getGame } from '../games/registry.js'
import { getCategory } from './categories.js'
import { successRate, summariseConfig } from './session-plan.js'

function stateOf(result) {
  if (!result || !result.played) return 'unplayed'
  if (result.completed === false) return 'interrupted'
  return 'done'
}

/** One report row per step of the plan, in order. */
export function reportRows(steps, results) {
  return steps.map((step, position) => {
    const game = getGame(step.gameId)
    const result = results[position]
    const state = stateOf(result)
    return {
      rank: position + 1,
      gameId: step.gameId,
      title: game?.title ?? step.gameId,
      settings: game ? summariseConfig(game, step.config) : 'jeu retiré de la galerie',
      category: game?.category ?? null,
      state,
      correct: result?.correct ?? 0,
      attempts: result?.attempts ?? 0,
      rate: state === 'unplayed' ? null : successRate(result),
    }
  })
}

/** Success per domain, over the games that were actually played. */
export function reportDomains(rows) {
  const totals = new Map()
  for (const row of rows) {
    if (row.state === 'unplayed' || !row.category || row.attempts === 0) continue
    const total = totals.get(row.category) ?? { correct: 0, attempts: 0 }
    total.correct += row.correct
    total.attempts += row.attempts
    totals.set(row.category, total)
  }
  return [...totals].map(([category, { correct, attempts }]) => ({
    category,
    label: getCategory(category)?.label ?? category,
    correct,
    attempts,
    rate: Math.round((correct / attempts) * 100),
  }))
}

/** The score as written on the report: a state in words, or « 7 / 10 (70 %) ». */
export function scoreLabel(row) {
  if (row.state === 'unplayed') return 'non joué'
  if (row.state === 'interrupted') return `interrompu (${row.correct} / ${row.attempts})`
  return `${row.correct} / ${row.attempts}${row.rate === null ? '' : ` (${row.rate} %)`}`
}

/** The whole report as plain text, for copying or downloading. */
export function reportText({ rows, domains, date, patient, note }) {
  const lines = [`Séance du ${date}`]
  if (patient) lines.push(`Patient : ${patient}`)
  lines.push('')
  for (const row of rows) {
    lines.push(`${row.rank}. ${row.title} — ${scoreLabel(row)}`)
    lines.push(`   ${row.settings}`)
  }
  if (domains.length > 0) {
    lines.push('', 'Par domaine :')
    for (const domain of domains) {
      lines.push(`- ${domain.label} : ${domain.correct} / ${domain.attempts} (${domain.rate} %)`)
    }
  }
  if (note.trim()) lines.push('', 'Observations :', note.trim())
  return `${lines.join('\n')}\n`
}
