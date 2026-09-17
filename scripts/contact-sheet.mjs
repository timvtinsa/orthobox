/**
 * Contact sheet of the patient drawing bank.
 *
 * The designer's three readings, side by side for every drawing: 132 px,
 * 52 px, and greyscale. If the three hold, the drawing belongs in the bank.
 *
 *   node scripts/contact-sheet.mjs > /tmp/contact-sheet.html
 *
 * A checking tool, not part of the build.
 */
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(join(ROOT, 'src/lib/pictograms.jsx'), 'utf8')

const palette = Object.fromEntries(
  [...source.matchAll(/^ {2}(\w+): '(#[0-9a-f]{6})',$/gm)].map((match) => [match[1], match[2]]),
)
const INK = source.match(/^const INK = '(#[0-9a-f]{6})'$/m)[1]

const body = source.slice(source.indexOf('const DRAWINGS'), source.indexOf('export const PICTOGRAMS'))
const entries = [
  ...body.matchAll(
    /\n {2}(\w+): \{\n {4}label: '([^']+)',\n {4}draw: \(\n {6}<>\n([\s\S]*?)\n {6}<\/>\n {4}\),\n {2}\},/g,
  ),
]

/** JSX attribute syntax back to plain SVG, for a static page. */
function toSvg(jsx) {
  return jsx
    .replace(/\{C\.(\w+)\}/g, (_, name) => `"${palette[name]}"`)
    .replace(/\{INK\}/g, `"${INK}"`)
    .replace(/strokeWidth=/g, 'stroke-width=')
    .replace(/strokeLinecap=/g, 'stroke-linecap=')
    .replace(/strokeLinejoin=/g, 'stroke-linejoin=')
    .replace(/className=/g, 'class=')
    .replace(/"{2}/g, '"')
}

const cards = entries
  .map(([, id, label, jsx]) => {
    const svg = toSvg(jsx)
    const draw = (size, grey) =>
      `<svg viewBox="0 0 120 120" width="${size}" height="${size}"${
        grey ? ' style="filter:grayscale(1)"' : ''
      } class="${size < 64 ? 'picto--small' : ''}">${svg}</svg>`
    return `<figure>
  <div class="big">${draw(132, false)}</div>
  <div class="row">${draw(52, false)}${draw(52, true)}</div>
  <figcaption>${label}<span>${id}</span></figcaption>
</figure>`
  })
  .join('\n')

process.stdout.write(`<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Banque de dessins</title>
<style>
  body { margin:0; padding:32px; background:#efeae6; color:#33303a;
         font-family:'Nunito',system-ui,sans-serif; }
  h1 { font-size:26px; margin:0 0 4px; }
  p { margin:0 0 24px; color:#6b6674; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(184px,1fr)); gap:16px; }
  figure { margin:0; padding:14px; background:#faf7f5; border:1px solid #e7e0db;
           border-radius:16px; display:flex; flex-direction:column; align-items:center; gap:10px; }
  .row { display:flex; align-items:flex-end; gap:12px; }
  figcaption { font-family:'Atkinson Hyperlegible',system-ui,sans-serif; font-size:24px;
               display:flex; flex-direction:column; align-items:center; }
  figcaption span { font-family:'Nunito',system-ui,sans-serif; font-size:12px; color:#6b6674; }
  .picto--small .picto__fine { display:none; }
</style></head>
<body>
<h1>Banque de dessins patient</h1>
<p>${entries.length} dessins, chacun en 132 px, en 52 px et en niveaux de gris.</p>
<div class="grid">
${cards}
</div>
</body></html>
`)
