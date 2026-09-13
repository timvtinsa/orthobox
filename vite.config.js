import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Base relative : l'application est purement client-side et peut donc être servie
// depuis n'importe quel sous-répertoire (GitHub Pages, Netlify, clé USB…).
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      // ORTHOBOX_NO_PWA=1 : build sans service worker, pour une prévisualisation
      // hébergée où la mise en cache hors ligne n'a pas lieu d'être.
      disable: process.env.ORTHOBOX_NO_PWA === '1',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Orthobox — jeux pour séances d’orthophonie',
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
