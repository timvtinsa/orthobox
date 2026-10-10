/**
 * Browser checks: responsive layout and accessibility on the device sizes the
 * app is used on (phones, tablets, desktop). The unit tests (Vitest) cover the
 * logic; these cover what only a real layout engine can tell — overflow,
 * clipped text, undersized tap targets, contrast, roles and labels.
 *
 * Run with `npm run test:e2e`. Locally, point PLAYWRIGHT_CHROMIUM at a
 * browser binary if the bundled one is not installed.
 */
import { defineConfig } from '@playwright/test'

const executablePath = process.env.PLAYWRIGHT_CHROMIUM || undefined
const PORT = 4173

const device = (name, width, height, extra = {}) => ({
  name,
  use: { viewport: { width, height }, launchOptions: { executablePath }, ...extra },
})

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.js',
  timeout: 60_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'fr-FR',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  projects: [
    device('phone-tiny', 320, 568, { isMobile: true, hasTouch: true }),
    device('phone-small', 360, 640, { isMobile: true, hasTouch: true }),
    device('phone', 390, 844, { isMobile: true, hasTouch: true }),
    device('phone-landscape', 740, 360, { isMobile: true, hasTouch: true }),
    device('tablet-portrait', 768, 1024, { hasTouch: true }),
    device('tablet-landscape', 1024, 768, { hasTouch: true }),
    device('desktop', 1440, 900),
  ],
  webServer: {
    // No service worker: a stale cache must never mask a layout regression.
    command: `ORTHOBOX_NO_PWA=1 npx vite build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
