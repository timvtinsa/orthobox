/**
 * Browser checks: responsive layout and accessibility on the device sizes the
 * app is used on (phones, tablets, desktop). The unit tests (Vitest) cover the
 * logic; these cover what only a real layout engine can tell — overflow,
 * clipped text, undersized tap targets, contrast, roles and labels.
 *
 * Run with `npm run test:e2e`. Locally, point PLAYWRIGHT_CHROMIUM at a
 * browser binary if the bundled one is not installed.
 */
import { availableParallelism } from 'node:os'
import { defineConfig } from '@playwright/test'

const executablePath = process.env.PLAYWRIGHT_CHROMIUM || undefined
const PORT = 4173

// `axe`: whether the accessibility audit (axe, about two thirds of the time of
// a test) runs on this size. The DOM, the roles, the labels and the colours are
// the same on every size, so three are enough: a phone, the tablet in landscape
// (the device the app is mostly used on) and the desktop. The layout checks,
// which are cheap and the ones that really depend on the size, run on all.
const device = (name, width, height, extra = {}, { axe = false } = {}) => ({
  name,
  metadata: { axe },
  use: { viewport: { width, height }, launchOptions: { executablePath }, ...extra },
})

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.js',
  timeout: 60_000,
  fullyParallel: true,
  // Most of a test is CPU (axe, layout): as many workers as the machine has
  // cores, less a quarter for the browsers' own processes and the server.
  workers: process.env.CI ? Math.max(2, Math.floor(availableParallelism() * 0.75)) : 4,
  retries: process.env.CI ? 1 : 0,
  // A broken screen shows on every page and every size: stop after a few
  // failures instead of running (and retrying) the other hundreds.
  maxFailures: process.env.CI ? 10 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'fr-FR',
    reducedMotion: 'reduce',
    // Recorded on the retry only: tracing every test costs time and makes a
    // heavy report for tests that pass.
    trace: 'on-first-retry',
  },
  projects: [
    device('phone-tiny', 320, 568, { isMobile: true, hasTouch: true }),
    device('phone-small', 360, 640, { isMobile: true, hasTouch: true }),
    device('phone', 390, 844, { isMobile: true, hasTouch: true }, { axe: true }),
    device('phone-landscape', 740, 360, { isMobile: true, hasTouch: true }),
    device('tablet-portrait', 768, 1024, { hasTouch: true }),
    device('tablet-landscape', 1024, 768, { hasTouch: true }, { axe: true }),
    device('desktop', 1440, 900, {}, { axe: true }),
  ],
  webServer: {
    // No service worker: a stale cache must never mask a layout regression.
    command: `ORTHOBOX_NO_PWA=1 npx vite build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
