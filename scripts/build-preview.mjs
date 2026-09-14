/**
 * Preview build.
 *
 * Produces in `dist-preview/` a build without a service worker (useless, even
 * harmful, for a hosted preview page) and prepares:
 *   - `page.html`: the page without <html>/<head>/<body>, with relative asset
 *     paths, as the preview hosting expects it;
 *   - `files.json`: the « published path -> source file » mapping to hand over
 *     to the publishing tool.
 *
 * Files from a previous version that are no longer referenced are listed with
 * the value `null`, which asks for their removal online.
 *
 *   npm run build:preview
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = join(ROOT, 'dist-preview')
const MANIFEST = join(OUTPUT, 'files.json')
const EXCLUDED = new Set(['index.html', 'page.html', 'files.json'])

function list(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    return statSync(path).isDirectory() ? list(path) : [path]
  })
}

// Files published by the previous build, used to spot orphans.
const previous = existsSync(MANIFEST)
  ? Object.entries(JSON.parse(readFileSync(MANIFEST, 'utf8')))
      .filter(([, source]) => source !== null) // removals already done are not replayed
      .map(([path]) => path)
  : []

execFileSync('npx', ['vite', 'build', '--outDir', 'dist-preview', '--emptyOutDir'], {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, ORTHOBOX_NO_PWA: '1' },
})

const index = readFileSync(join(OUTPUT, 'index.html'), 'utf8')
const css = index.match(/href="\.\/(assets\/[^"]+\.css)"/)?.[1]
const js = index.match(/src="\.\/(assets\/[^"]+\.js)"/)?.[1]
if (!css || !js) throw new Error('Stylesheet or script not found in index.html')

writeFileSync(
  join(OUTPUT, 'page.html'),
  `<title>Orthobox</title>
<meta name="description" content="Galerie de jeux pour les séances d’orthophonie : langage oral, langage écrit, fonctions exécutives, cognition mathématique." />
<link rel="icon" type="image/svg+xml" href="favicon.svg" />
<link rel="stylesheet" href="${css}" />
<div id="root"></div>
<script type="module" src="${js}"></script>
`,
)

const current = list(OUTPUT)
  .map((path) => relative(OUTPUT, path).split(/[\\/]/).join('/'))
  .filter((path) => !EXCLUDED.has(path))
  .sort()

const files = Object.fromEntries(current.map((path) => [path, path]))
const orphans = previous.filter((path) => !files[path])
for (const path of orphans) files[path] = null

writeFileSync(MANIFEST, JSON.stringify(files, null, 2))

console.log(`\npage: dist-preview/page.html`)
console.log(`files: ${current.length} to publish, ${orphans.length} to remove`)
console.log(`mapping: dist-preview/files.json`)
