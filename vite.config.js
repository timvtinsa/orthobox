import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Relative base: the application is purely client-side, so it can be served
// from any subdirectory (GitHub Pages, Netlify, a USB stick…).
export default defineConfig({
  base: './',
  test: {
    // Tests cover the logic: game data, draws, session plan.
    // Interface checks are done in a real browser.
    include: ['tests/**/*.test.js'],
    environment: 'node',
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      // Scoped to the same "logic" surface the suite itself targets: `.jsx`
      // components and pages render nothing without a DOM, and are checked
      // in a real browser instead (see the note above), so counting them
      // here would only dilute the number with code this suite cannot
      // exercise by design.
      include: ['src/lib/**/*.js', 'src/hooks/**/*.js', 'src/games/**/*.js'],
      // A floor, not a target: kept a few points under what the suite
      // currently reaches, so normal drift (a line or two of a new branch
      // left untested) does not fail CI, while a real regression — a new
      // game landing with no logic tests, a gutted test file — still does.
      // `npm run test:coverage` fails locally the same way CI does.
      thresholds: {
        statements: 80,
        lines: 80,
        functions: 85,
        branches: 85,
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      // ORTHOBOX_NO_PWA=1: build without a service worker, for a hosted
      // preview where offline caching makes no sense.
      disable: process.env.ORTHOBOX_NO_PWA === '1',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Orthobox, jeux pour séances d’orthophonie',
        short_name: 'Orthobox',
        description:
          'Galerie de jeux utilisables en séance d’orthophonie : langage oral, langage écrit, fonctions exécutives et cognition mathématique.',
        lang: 'fr',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        background_color: '#f6f7fb',
        theme_color: '#3f5bd9',
        categories: ['education', 'medical', 'games'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
      },
      devOptions: { enabled: false },
    }),
  ],
})
