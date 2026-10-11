import { expect, test } from '@playwright/test'
import { GAME_IDS, axeViolations, layoutProblems, open, watchErrors } from './helpers.js'

const isTouch = (testInfo) => testInfo.project.use.hasTouch === true

test.describe('pages', () => {
  for (const [name, route] of [
    ['gallery', '/'],
    ['session builder', '/session'],
    ['not found', '/nope'],
  ]) {
    test(`${name}: layout and accessibility`, async ({ page }, testInfo) => {
      const errors = watchErrors(page)
      await open(page, route)
      expect(await layoutProblems(page, { touch: isTouch(testInfo) })).toEqual([])
      expect(await axeViolations(page)).toEqual([])
      expect(errors).toEqual([])
    })
  }
})

test.describe('games', () => {
  for (const id of GAME_IDS) {
    test(`${id}: setup then board`, async ({ page }, testInfo) => {
      const errors = watchErrors(page)
      const touch = isTouch(testInfo)

      await open(page, `/games/${id}`)
      expect(await layoutProblems(page, { touch }), 'setup layout').toEqual([])
      expect(await axeViolations(page), 'setup accessibility').toEqual([])

      const start = page.getByRole('button', { name: /démarrer|commencer|lancer/i }).first()
      await expect(start).toBeVisible()
      await start.click()
      await page.waitForTimeout(600)
      expect(await layoutProblems(page, { touch }), 'board layout').toEqual([])
      expect(await axeViolations(page), 'board accessibility').toEqual([])
      expect(errors).toEqual([])
    })
  }
})
