# Orthobox, notes for Claude

A React + Vite application, fully client-side, used during speech therapy
sessions. See `ARCHITECTURE.md` for the code structure, `src/games/README.md`
for the contract of a game, `README.md` for the general presentation.

## Language

**Code and repository in English, interface in French.**

- English: identifiers, comments, documentation, commit messages, branch and
  pull request titles, workflow names, file and folder names, CSS classes,
  setting and option ids.
- French: everything the user reads on screen, the game material (words,
  sentences, stories, riddles, pictogram and sound labels) and the texts of a
  `game.js` manifest (`title`, `tagline`, `label`, `hint`, `objectives`,
  `materials`, `instructions`).

## Preview, on every change

The user expects **an up-to-date preview link at the end of every batch of
changes**, without having to ask for it.

```bash
npm run build:preview      # build without a service worker + dist-preview/page.html + files.json
```

Then publish `dist-preview/page.html` as an artifact, with `root: dist-preview`
and the mapping from `dist-preview/files.json` (entries set to `null` remove
files that are no longer needed). **Always republish the same file path to keep
the same URL**; if the URL has been lost, find it again through the artifact
list rather than creating a new one.

## Commit messages

**Conventional Commits** format: `type(scope): imperative summary`.

```
feat(games): add shape sorting
fix(session): fix the progress bar
refactor(audio): extract the sound synthesis
docs: start ARCHITECTURE.md
```

Types in use: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `perf`.
Common scopes: `games`, `session`, `gallery`, `audio`, `ui`, `pwa`, `build`.
Summary in English, no final full stop, 72 characters at most. The body
explains the why, not the how.

This format is not cosmetic: release-please derives the published version and
the changelog content from it. A `feat` gives a minor version, a `fix` a patch,
a `!` after the scope a major version.

## Branches

Working branches start from `integ`, the integration branch. `main` only
receives what is ready to be published, and then triggers the release pull
request.

## Before delivering

```bash
npm run lint
npm test
npm run build
```

Check interface changes in a real browser (Chromium is preinstalled,
`executablePath: '/opt/pw-browsers/chromium'`), in desktop **and** tablet
(1024×768 and 768×1024): the application is used on tablets.

## Conventions

- The whole interface is in French, accented, game material included.
- No emoji in the interface: SVG icons (`src/components/Icon.jsx`), drawn
  covers (`src/games/<id>/cover.svg`), pictograms (`src/lib/pictograms.jsx`).
- Pastel palette and embedded fonts: never load a remote resource, the
  application has to work offline.
- Touch targets of at least 44 px, no information carried by colour alone.
- No em dash in the texts of the application: colon, comma or parentheses.
- No duration estimate on the games: it depends on the patient.
- Every game declares its parameters in `settings` (`game.js`): the frame
  displays the settings screen and only starts the game on « Démarrer ».
- Games must stay usable in session mode: the score goes through
  `session.register()`, never through an end screen.
- Child mode only adds encouragement: it changes neither the material, nor the
  settings, nor the score computation. A game never reads the mode.
