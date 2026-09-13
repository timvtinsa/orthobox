/**
 * Build de prévisualisation.
 *
 * Produit dans `dist-preview/` un build sans service worker (inutile, voire
 * gênant, pour une page de prévisualisation hébergée) et prépare :
 *   - `page.html` : la page sans <html>/<head>/<body>, avec les chemins
 *     d'assets relatifs, telle que l'attend l'hébergement de prévisualisation ;
 *   - `files.json` : la correspondance « chemin publié → fichier source »,
 *     à passer à l'outil de publication.
 *
 * Les fichiers d'une version précédente qui ne sont plus référencés sont
 * listés avec la valeur `null`, ce qui demande leur suppression en ligne.
 *
 *   npm run build:preview
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SORTIE = join(RACINE, 'dist-preview')
const MANIFESTE = join(SORTIE, 'files.json')
const EXCLUS = new Set(['index.html', 'page.html', 'files.json'])

function lister(dossier) {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom)
    return statSync(chemin).isDirectory() ? lister(chemin) : [chemin]
  })
}

// Les fichiers publiés lors du build précédent, pour repérer les orphelins.
const precedents = existsSync(MANIFESTE)
  ? Object.entries(JSON.parse(readFileSync(MANIFESTE, 'utf8')))
      .filter(([, source]) => source !== null) // les retraits déjà faits ne sont pas rejoués
      .map(([chemin]) => chemin)
  : []

execFileSync('npx', ['vite', 'build', '--outDir', 'dist-preview', '--emptyOutDir'], {
  cwd: RACINE,
  stdio: 'inherit',
  env: { ...process.env, ORTHOBOX_NO_PWA: '1' },
})

const index = readFileSync(join(SORTIE, 'index.html'), 'utf8')
const css = index.match(/href="\.\/(assets\/[^"]+\.css)"/)?.[1]
const js = index.match(/src="\.\/(assets\/[^"]+\.js)"/)?.[1]
if (!css || !js) throw new Error('Feuille de style ou script introuvable dans index.html')

writeFileSync(
  join(SORTIE, 'page.html'),
  `<title>Orthobox</title>
<meta name="description" content="Galerie de jeux pour les séances d’orthophonie : langage oral, langage écrit, fonctions exécutives, cognition mathématique." />
<link rel="icon" type="image/svg+xml" href="favicon.svg" />
<link rel="stylesheet" href="${css}" />
<div id="root"></div>
<script type="module" src="${js}"></script>
`,
)

const actuels = lister(SORTIE)
  .map((chemin) => relative(SORTIE, chemin).split(/[\\/]/).join('/'))
  .filter((chemin) => !EXCLUS.has(chemin))
  .sort()

const fichiers = Object.fromEntries(actuels.map((chemin) => [chemin, chemin]))
const orphelins = precedents.filter((chemin) => !fichiers[chemin])
for (const chemin of orphelins) fichiers[chemin] = null

writeFileSync(MANIFESTE, JSON.stringify(fichiers, null, 2))

console.log(`\npage : dist-preview/page.html`)
console.log(`fichiers : ${actuels.length} à publier, ${orphelins.length} à retirer`)
console.log(`correspondance : dist-preview/files.json`)
