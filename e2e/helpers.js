import { readdirSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'

/** Every game folder under src/games: the suite follows the registry by itself. */
export const GAME_IDS = readdirSync(new URL('../src/games', import.meta.url), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

/**
 * Collects the layout problems visible in the page right now. Runs in the
 * browser; returns plain objects so a failure message says exactly what broke.
 */
export function layoutProblems(page, { touch }) {
  return page.evaluate(({ touch }) => {
    const problems = []
    const vw = document.documentElement.clientWidth
    const describe = (el) => {
      const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''
      const text = (el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40)
      return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}${text ? ` “${text}”` : ''}`
    }
    const visible = (el) => {
      const style = getComputedStyle(el)
      if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) return false
      const rect = el.getBoundingClientRect()
      return rect.width > 1 && rect.height > 1
    }
    // An ancestor that scrolls (or clips) on purpose legitimately holds wide content.
    const insideScroller = (el) => {
      for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
        const { overflowX } = getComputedStyle(node)
        if (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'hidden' || overflowX === 'clip') return true
      }
      return false
    }

    if (document.documentElement.scrollWidth > vw + 1) {
      problems.push(`page scrolls horizontally (${document.documentElement.scrollWidth}px > ${vw}px)`)
    }

    for (const el of document.body.querySelectorAll('*')) {
      if (!visible(el) || el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue
      const rect = el.getBoundingClientRect()
      const style = getComputedStyle(el)
      if (style.position !== 'fixed' && !insideScroller(el) && (rect.right > vw + 1 || rect.left < -1)) {
        problems.push(`sticks out of the screen: ${describe(el)} (${Math.round(rect.left)}→${Math.round(rect.right)} of ${vw})`)
      }
      // Text cut off without an ellipsis or a scrollbar: the reader loses words.
      const hasOwnText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
      if (
        hasOwnText &&
        el.scrollWidth > el.clientWidth + 2 &&
        ['hidden', 'clip'].includes(style.overflowX) &&
        style.textOverflow !== 'ellipsis'
      ) {
        problems.push(`text clipped: ${describe(el)}`)
      }
      if (hasOwnText && parseFloat(style.fontSize) < 12) {
        problems.push(`text under 12px (${style.fontSize}): ${describe(el)}`)
      }
    }

    const interactive = 'button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=radio], [role=checkbox], [role=switch], [tabindex="0"]'
    // Touch devices: every control must be comfortably tappable (WCAG 2.5.8 asks 24px, we hold 40px).
    const floor = touch ? 40 : 24
    for (const el of document.querySelectorAll(interactive)) {
      if (!visible(el) || el.closest('[aria-hidden="true"]')) continue
      // A pseudo-element stretched over the control (whole-card links, enlarged
      // favourite buttons) is part of what a finger can hit.
      if (['::before', '::after'].some((pseudo) => getComputedStyle(el, pseudo).position === 'absolute' && getComputedStyle(el, pseudo).content !== 'none')) continue
      const rect = el.getBoundingClientRect()
      if (rect.right < 0 || rect.bottom < 0) continue
      // Scene objects are the exercise (a crowd to search): 32px, not the 40px of ordinary controls.
      const needed = el.classList.contains('scene__item') ? Math.min(floor, 32) : floor
      if (Math.min(rect.width, rect.height) < needed) {
        problems.push(`tap target too small (${Math.round(rect.width)}×${Math.round(rect.height)}): ${describe(el)}`)
      }
    }
    return problems
  }, { touch })
}

/** Axe rules that matter for the audience: WCAG A/AA plus the best-practice set. */
export async function axeViolations(page) {
  const results = await new AxeBuilder({ page })
    // The Stroop ink colours are the stimulus itself (a yellow word must stay yellow).
    .exclude('.stroop-word')
    // Tap-target size is checked by layoutProblems (stricter: 40px on touch). Axe's
    // own rule also depends on what is scrolled into view and on the crowd of a
    // visual-search scene touching by design, which made it flaky.
    .disableRules(['target-size'])
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze()
  return results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`,
  )
}

/** Opens a hash route and waits for the app to render something. */
export async function open(page, route) {
  await page.goto(`/#${route}`)
  await page.waitForSelector('main, .setup, .game-board, .gallery, h1', { timeout: 10_000 })
  await page.waitForTimeout(250)
}

/** Records uncaught errors and console errors so a test can assert there were none. */
export function watchErrors(page) {
  const errors = []
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
  })
  return errors
}
