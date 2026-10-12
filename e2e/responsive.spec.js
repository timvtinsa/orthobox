import { expect, test } from '@playwright/test'
import { GAME_IDS, axeViolations, layoutProblems, open, startGame, watchErrors } from './helpers.js'

const isTouch = (testInfo) => testInfo.project.use.hasTouch === true
// The accessibility audit only runs on the sizes marked in playwright.config.js.
const wantsAxe = (testInfo) => testInfo.project.metadata?.axe === true

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
      if (wantsAxe(testInfo)) expect(await axeViolations(page)).toEqual([])
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
      if (wantsAxe(testInfo)) expect(await axeViolations(page), 'setup accessibility').toEqual([])

      await startGame(page)
      expect(await layoutProblems(page, { touch }), 'board layout').toEqual([])
      if (wantsAxe(testInfo)) expect(await axeViolations(page), 'board accessibility').toEqual([])
      expect(errors).toEqual([])
    })
  }
})
