/**
 * Turns the commits of a release into a short, French, user-facing
 * changelog — never the technical CHANGELOG.md release-please already
 * writes from the same commits. Judging which of the release's commits a
 * user would actually notice (a new game, a visible fix) versus which are
 * purely internal (a dependency bump, a refactor, a workflow change) is not
 * something a mechanical rule can do well, so a single Claude call reads the
 * commit log for the release and writes the highlights directly.
 *
 * Writes `public/whats-new.json`, read by the app's "what's new" popup, and
 * prepends the same bullets to the GitHub release notes.
 *
 *   NEW_TAG=v0.5.0 node scripts/build-user-changelog.mjs
 *
 * Env: NEW_TAG (required, e.g. "v0.5.0"). An Anthropic API key must be
 * resolvable (ANTHROPIC_API_KEY, or an `ant auth login` profile locally).
 * GH_TOKEN + GH_REPO, if set, also update the GitHub release notes through
 * `gh`; without them the script only writes the JSON file, which is what a
 * local dry run wants.
 *
 * A release must never be blocked by this step: if the Claude call fails for
 * any reason (missing or invalid API key, rate limit, network error), the
 * script logs a warning and exits successfully without writing
 * `whats-new.json` — the release still publishes, just without a
 * user-facing changelog this time.
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// The cheap tier: this is a short summarisation call, not one that needs
// Opus-level reasoning.
const MODEL = 'claude-haiku-4-5'

const HighlightsSchema = z.object({
  highlights: z.array(z.string()),
})

const SYSTEM_PROMPT = `You write the "what's new" summary shown once to Orthobox users right after they update to a new version.

Orthobox is a French-language web app used during speech-therapy sessions: a toolbox of short games for a speech therapist and their patient, often a child. Your audience is a parent, a speech therapist, or occasionally a curious teenager — never a developer.

You will be given every commit that landed in this release, most recent first, as "<subject>\\n<body>" blocks separated by a line of dashes. Read them and produce a short list of highlights, each a single short French sentence, for a change a user would actually notice: a new game, a visible interface or usability improvement, or a bug fix that affected what they could do or see. Leave out anything purely internal: dependency bumps, CI or release-workflow changes, refactors, test additions, documentation, build tooling, or performance work invisible to the user. If the release has nothing a user would notice, return an empty list rather than inventing a line.

Write in plain, warm French: one clause per idea, no jargon, no markdown, no emoji, each line capitalised and ending with a period like an ordinary sentence. Merge commits that describe facets of the same visible change into a single line rather than listing each separately.`

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' })
}

/** The tag just before `newTag`, or null for a repository's first release. */
function previousTag(newTag) {
  const tags = git(['tag', '--list', 'v*', '--sort=-creatordate'])
    .trim()
    .split('\n')
    .filter(Boolean)
  const index = tags.indexOf(newTag)
  return index >= 0 && index + 1 < tags.length ? tags[index + 1] : null
}

/** Commits in `range`, oldest merge noise dropped, as { subject, body }. */
export function commitLog(newTag, previous) {
  const range = previous ? `${previous}..${newTag}` : newTag
  // \x00 separates commits, \x01 the subject from the body: neither can show
  // up in a commit message by accident, unlike a newline or a comma.
  return git(['log', range, '--no-merges', '--format=%s%x01%b%x00'])
    .split('\x00')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [subject, body = ''] = entry.split('\x01')
      return { subject: subject.trim(), body: body.trim() }
    })
}

export function buildPrompt(commits) {
  return commits
    .map(({ subject, body }) => (body ? `${subject}\n${body}` : subject))
    .join('\n\n---\n\n')
}

export async function generateHighlights(commits) {
  if (commits.length === 0) return []

  const client = new Anthropic()
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    output_config: { format: zodOutputFormat(HighlightsSchema) },
    messages: [{ role: 'user', content: buildPrompt(commits) }],
  })

  if (!response.parsed_output) {
    throw new Error('Claude did not return a valid highlights list')
  }
  return response.parsed_output.highlights
}

async function main() {
  const newTag = process.env.NEW_TAG
  if (!newTag) throw new Error('NEW_TAG is required (e.g. "v0.5.0")')
  const version = newTag.replace(/^v/, '')

  const commits = commitLog(newTag, previousTag(newTag))

  let highlights
  try {
    highlights = await generateHighlights(commits)
  } catch (error) {
    // See the file-level doc comment: this must not fail the release.
    console.warn(`Could not generate the user-facing changelog: ${error.message}`)
    return
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
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
