/**
 * Turns the commits of a release into a short, French, user-facing
 * changelog — never the technical CHANGELOG.md release-please already
 * writes from the same commits.
 *
 * A `feat`/`fix` commit contributes a bullet if its body carries a
 * `Release-Notes: <french sentence>` trailer; without one, its subject line
 * is used as a fallback (English, since commit subjects are English here,
 * but better than nothing — the convention is meant to make this fallback
 * rare going forward). Every other commit type (chore, refactor, docs,
 * style, test, perf, ci, build, revert) is folded into a single generic
 * bullet, added once, only if the release actually has one.
 *
 * Writes `public/whats-new.json`, read by the app's "what's new" popup, and
 * prepends the same bullets to the GitHub release notes.
 *
 *   NEW_TAG=v0.5.0 node scripts/build-user-changelog.mjs
 *
 * Env: NEW_TAG (required, e.g. "v0.5.0"). GH_TOKEN + GH_REPO, if set, also
 * update the GitHub release notes through `gh`; without them the script
 * only writes the JSON file, which is what a local dry run wants.
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const newTag = process.env.NEW_TAG
if (!newTag) throw new Error('NEW_TAG is required (e.g. "v0.5.0")')
const version = newTag.replace(/^v/, '')

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' })
}

/** The tag just before `newTag`, or null for a repository's first release. */
function previousTag() {
  const tags = git(['tag', '--list', 'v*', '--sort=-creatordate'])
    .trim()
    .split('\n')
    .filter(Boolean)
  const index = tags.indexOf(newTag)
  return index >= 0 && index + 1 < tags.length ? tags[index + 1] : null
}

const previous = previousTag()
const range = previous ? `${previous}..${newTag}` : newTag
// \x00 separates commits, \x01 the subject from the body: neither can show
// up in a commit message by accident, unlike a newline or a comma.
const log = git(['log', range, '--format=%s%x01%b%x00'])

const TYPE_RE = /^(\w+)(\([^)]*\))?(!)?:\s*(.+)$/
const RELEASE_NOTES_RE = /^Release-Notes:\s*(.+)$/

const highlights = []
const seen = new Set()
let hasTechnical = false

for (const entry of log.split('\x00')) {
  if (!entry.trim()) continue
  const [subject, body = ''] = entry.split('\x01')
  const match = subject.trim().match(TYPE_RE)
  if (!match) continue
  const [, type, , , description] = match

  if (type !== 'feat' && type !== 'fix') {
    hasTechnical = true
    continue
  }

  const trailerLine = body.split('\n').map((line) => line.trim()).find((line) => RELEASE_NOTES_RE.test(line))
  const line = trailerLine
    ? trailerLine.match(RELEASE_NOTES_RE)[1].trim()
    : description.charAt(0).toUpperCase() + description.slice(1)

  if (line && !seen.has(line)) {
    seen.add(line)
    highlights.push(line)
  }
}

if (hasTechnical) {
  highlights.push('Améliorations techniques et corrections internes.')
}

writeFileSync(
  resolve(ROOT, 'public/whats-new.json'),
  `${JSON.stringify({ version, highlights }, null, 2)}\n`,
)

console.log(`public/whats-new.json written for ${version}:`)
for (const line of highlights) console.log(` - ${line}`)

// A dry run (no GH_TOKEN, or no `gh` binary, as in a plain local checkout)
// stops here: the JSON file above is the part that matters for that case.
if (highlights.length > 0 && process.env.GH_TOKEN) {
  try {
    const notesSection = `## Nouveautés\n\n${highlights.map((line) => `- ${line}`).join('\n')}\n\n---\n\n`
    const currentBody = execFileSync(
      'gh',
      ['release', 'view', newTag, '--json', 'body', '-q', '.body'],
      { cwd: ROOT, encoding: 'utf8' },
    )
    execFileSync('gh', ['release', 'edit', newTag, '--notes', notesSection + currentBody], {
      cwd: ROOT,
      encoding: 'utf8',
    })
    console.log(`Release notes for ${newTag} updated with the "Nouveautés" section.`)
  } catch (error) {
    // The release itself, and public/whats-new.json, are already done: a
    // release-notes edit failing here must not fail the whole build.
    console.warn(`Could not update the release notes for ${newTag}: ${error.message}`)
  }
}
