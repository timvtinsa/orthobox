/**
 * Prepends the release's user-facing changelog to the GitHub release notes.
 *
 * `public/whats-new.json` is written by the "Write the user-facing
 * changelog" step of the release workflow, a Claude Code Action call that
 * reads the release's commits directly — this script only reads its
 * result back. That step is best-effort (it never blocks a release, see
 * its own step in the workflow), so a missing file or an empty
 * `highlights` list is a normal outcome here, not an error.
 *
 *   NEW_TAG=v0.5.0 node scripts/update-release-notes.mjs
 *
 * Env: NEW_TAG (required, e.g. "v0.5.0"). GH_TOKEN + GH_REPO, if set, also
 * update the GitHub release notes through `gh`; without them the script
 * only prints what it would have done, which is what a local dry run wants.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const newTag = process.env.NEW_TAG
if (!newTag) throw new Error('NEW_TAG is required (e.g. "v0.5.0")')

const whatsNewPath = resolve(ROOT, 'public/whats-new.json')
if (!existsSync(whatsNewPath)) {
  // Not an error (the Claude step is best-effort), but worth a visible
  // annotation in the workflow run: this is silent otherwise, and it did
  // happen once already (v0.5.0) without anyone noticing until a user
  // reported the in-app popup never showing up.
  console.log('::warning::No public/whats-new.json: this release has no user-facing changelog.')
  process.exit(0)
}

const { highlights } = JSON.parse(readFileSync(whatsNewPath, 'utf8'))
if (!Array.isArray(highlights) || highlights.length === 0) {
  console.log('public/whats-new.json has no highlights: nothing to prepend.')
  process.exit(0)
}

console.log(`Highlights for ${newTag}:`)
for (const line of highlights) console.log(` - ${line}`)

if (!process.env.GH_TOKEN) {
  console.log('No GH_TOKEN: dry run, release notes left untouched.')
  process.exit(0)
}

try {
  const notesSection = `## Nouveautés\n\n${highlights.map((line) => `- ${line}`).join('\n')}\n\n---\n\n`
  const currentBody = execFileSync(
    'gh',
    ['release', 'view', newTag, '--json', 'body', '-q', '.body'],
    { cwd: ROOT, encoding: 'utf8' },
  )
  if (currentBody.includes('## Nouveautés')) {
    console.log(`Release notes for ${newTag} already have a "Nouveautés" section: left as they are.`)
    process.exit(0)
  }
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
