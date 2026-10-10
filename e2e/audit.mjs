// Non-asserting sweep: prints every distinct problem with the screens it appears on.
import { chromium } from '@playwright/test'
import { GAME_IDS, axeViolations, layoutProblems, open } from './helpers.js'

const VIEWPORTS = {
  'phone-small': [360, 640, true], phone: [390, 844, true], 'phone-landscape': [740, 360, true],
  'tablet-portrait': [768, 1024, true], 'tablet-landscape': [1024, 768, true], desktop: [1440, 900, false],
}
const only = process.argv[2] ? process.argv[2].split(',') : Object.keys(VIEWPORTS)
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM })
const found = new Map()
const note = (kind, msg, where) => {
  const key = `${kind}|${msg.replace(/“[^”]*”/g, '').replace(/\d+/g, 'N')}`
  if (!found.has(key)) found.set(key, { sample: msg, where: new Set() })
  found.get(key).where.add(where)
}
for (const name of only) {
  const [width, height, touch] = VIEWPORTS[name]
  const ctx = await browser.newContext({ viewport: { width, height }, hasTouch: touch, isMobile: touch && width < 700, reducedMotion: 'reduce', locale: 'fr-FR', baseURL: 'http://localhost:4173' })
  const page = await ctx.newPage()
  const targets = [['/', 'gallery'], ['/session', 'session'], ['/nope', '404'], ...GAME_IDS.map((g) => [`/games/${g}`, g])]
  for (const [route, label] of targets) {
    await open(page, route)
    for (const p of await layoutProblems(page, { touch })) note('layout', p, `${name}:${label}`)
    for (const v of await axeViolations(page)) note('axe', v, `${name}:${label}`)
    if (route.startsWith('/games/')) {
      const start = page.getByRole('button', { name: /démarrer|commencer|lancer/i }).first()
      if (await start.count()) {
        await start.click(); await page.waitForTimeout(600)
        for (const p of await layoutProblems(page, { touch })) note('layout', p, `${name}:${label}#board`)
        for (const v of await axeViolations(page)) note('axe', v, `${name}:${label}#board`)
      } else note('flow', 'no start button', `${name}:${label}`)
    }
  }
  await ctx.close()
}
for (const [key, { sample, where }] of [...found].sort((a, b) => b[1].where.size - a[1].where.size)) {
  console.log(`\n[${key.split('|')[0]}] x${where.size}  ${sample}\n   e.g. ${[...where].slice(0, 6).join(', ')}`)
}
await browser.close()
