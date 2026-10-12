# Orthobox presentation deck

A short deck (five 16:9 slides) to present Orthobox to speech therapists:
title, the essentials, the gallery, the session mode, and how to try it. Every
slide carries speaker notes.

Open `index.html` in a browser. It is self-contained (no network access
needed): the Nunito font and the images sit next to it.

- **Présenter** shows one slide at a time in full screen (arrow keys to move,
  `N` for the speaker notes, `Esc` to leave).
- **Imprimer ou PDF** prints one slide per page, so the browser can save a PDF.

## Before sharing it

Fill in the two constants at the top of the `<script>` in `index.html`:

```js
var SITE = ''      // the address of the deployed application
var CONTACT = ''   // where practitioners can send feedback
```

While they are empty, the last slide shows dashed placeholders.

## Keeping it accurate

The slides state the number of games (41) and the games per domain (10, 8, 12
and 11). Update them, and take the two screenshots again (`images/gallery.png`
and `images/session.png`, tablet landscape 1024 × 768, adult mode, no patient
data), when the catalogue or the interface changes. The same message is also
available in the application itself, on the `#/what` page.

The slides are in French, like the interface. The tokens at the top of the
stylesheet are copied from `src/styles/global.css` and `src/lib/categories.js`.
