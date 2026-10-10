import { expect, test } from '@playwright/test'
import { open } from './helpers.js'

test('the document declares its language and a title', async ({ page }) => {
  await open(page, '/')
  await expect(page.locator('html')).toHaveAttribute('lang', /^fr/)
  await expect(page).toHaveTitle(/\S/)
})

test('every focusable control shows where the keyboard focus is', async ({ page }) => {
  await open(page, '/')
  const missing = []
  for (let i = 0; i < 12; i += 1) {
    await page.keyboard.press('Tab')
    const state = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      const style = getComputedStyle(el)
      const outline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0
      const shadow = style.boxShadow !== 'none'
      return { name: (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 30), visible: outline || shadow }
    })
    if (state && !state.visible) missing.push(state.name)
  }
  expect(missing).toEqual([])
})

test('a game can be started and left with the keyboard alone', async ({ page }) => {
  await open(page, '/games/opposites')
  const start = page.getByRole('button', { name: /démarrer/i }).first()
  await start.focus()
  await page.keyboard.press('Enter')
  const quit = page.getByRole('button', { name: /quitter la partie/i })
  await expect(quit).toBeVisible()
  await quit.focus()
  await page.keyboard.press('Enter')
  await expect(start).toBeVisible()
})

test('the board opens at the top of the page, below the sticky header', async ({ page }) => {
  await open(page, '/games/opposites')
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }))
  await page.getByRole('button', { name: /démarrer/i }).first().click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  const quit = page.getByRole('button', { name: /quitter la partie/i })
  const header = await page.locator('header').first().boundingBox()
  const box = await quit.boundingBox()
  expect(box.y).toBeGreaterThanOrEqual(header.y + header.height - 1)
})
