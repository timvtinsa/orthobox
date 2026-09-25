# Orthobox

A gallery of short games, usable as they are during a speech therapy session.
A **100% client-side** web application (no server, no patient data),
installable as a **PWA**, usable **offline** and designed for tablets.

The interface and all game material are in French, since the application is
built for French-speaking practitioners. The code, the documentation and the
repository itself are in English.

## Orthobox compared to other French tools

Speech therapists already have French-language options for digital material:
general school-game sites, subscription rehabilitation platforms, and paid
tablet apps. Orthobox does not compete on catalogue size; it competes on
being free, private and usable without a connection. Based on each product's
own public presentation as of September 2026:

| | Orthobox | [logicieleducatif.fr](https://www.logicieleducatif.fr/) | [HappyNeuron Pro](https://www.happyneuron.com/orthophonie/pro-abonnements-logiciels/) | [DYNSEO](https://www.dynseo.com/) (Coco / Joe / Edith) | [LenaTheo](https://lenatheo.com/) |
| --- | :---: | :---: | :---: | :---: | :---: |
| Free | 🟢 | 🟢 | 🔴 from ~59 €/month | 🔴 ~88 € excl. tax/year per tablet | 🔴 ~8.90 €/month¹ |
| No advertising | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 |
| Works offline, once loaded | 🟢 | 🔴 browser only | 🔴 cloud platform | 🟢 installed tablet app | 🔴 browser only |
| Built for speech therapy | 🟢 | 🔴 general school exercises | 🟢 | 🟢 | 🟢 |
| No account or sign-up | 🟢 | 🟢 | 🔴 | 🟢 | 🔴¹ |

¹ LenaTheo offers a small number of games playable free and without an
account; its full catalogue needs a paid subscription.

Orthobox is the only one of these built specifically for speech therapy that
also asks for neither payment nor an account, and the only subscription-free
option that is designed for the clinic rather than for the classroom. It has
no paid tier and never will: Orthobox stays free and ad-free for every
practitioner, funded only by whoever chooses to support it.

This table reflects each product's own marketing pages, not a hands-on trial
of every one of them, and pricing or features may have changed since. If you
spot something that has changed, an issue or a pull request is welcome.

Games are filed under four domains:

| Domain | What it works on |
| --- | --- |
| Langage oral (oral language) | Phonology, lexicon, word finding, oral comprehension and expression |
| Langage écrit (written language) | Reading, syllabic awareness, written comprehension, fluency |
| Fonctions exécutives (executive functions) | Inhibition, working memory, attention, flexibility, visual search |
| Cognition mathématique (math cognition) | Number sense, estimation, number chain, calculation |

## The 29 games

**Oral language**

| Game | Principle |
| --- | --- |
| L’intrus sonore | Spot the word that shares neither the onset nor the rhyme of the others |
| Qui suis-je ? | Find a word from progressive clues (lexical retrieval) |
| La suite de sons | Listen to a series of sounds, then put the cards back in order |
| Combien de syllabes ? | Count the syllables of a word, heard or read and heard |
| L’intrus de la famille | Spot the word that does not belong to the same family as the others |
| Le contraire | Find the word that means the opposite, among four options |
| La bonne consigne | Follow a multi-step instruction among decoy shapes |

**Written language**

| Game | Principle |
| --- | --- |
| Le mot en morceaux | Rebuild a word from its scrambled syllables |
| La phrase mélangée | Rebuild a sentence from its scrambled words |
| La phrase à trous | Pick the missing word: meaning, connectors or agreement |
| Les homophones | Choose the right spelling between two identical-sounding words |
| Lecture flash | Identify a word shown very briefly, among close lures |
| L’histoire et les détails | Read a story, then answer multiple-choice questions on its details |
| La bonne lettre | Find a letter among the ones it gets confused with (b d p q, n u, m w) |

**Executive functions**

| Game | Principle |
| --- | --- |
| Encre ou mot ? | Stroop: answer on the ink colour, with the rule sometimes flipped |
| La suite lumineuse | Reproduce a sequence of cells, forward or backward |
| Cherche et trouve | Spot a given object in a scene of 24 to 80 objects |
| La liste de mots | Memorise a list, then recognise its words among new ones |
| La planche d’images | Same principle, with pictures |
| Le rappel de liste | Memorise a list, then recall it freely |
| La suite de chiffres | Hold a digit sequence, then type it forward or backward |
| Le jeu des paires | Concentration: find the picture pairs, at three levels |
| Le tri des formes | Sort objects by colour, by shape, or following a changing rule |

**Math cognition**

| Game | Principle |
| --- | --- |
| Le plus grand tas | Compare two collections (subitizing, estimation, transcoding) |
| Range les nombres | Order numbers, decimals included |
| Le calcul éclair | Find the result of an operation among four options |
| Compter la monnaie | Make up an exact amount with coins and notes |
| Le compte est bon | Find what is missing to reach ten, twenty or a hundred |
| Quelle heure est-il ? | Read an analogue clock, then pick the time it shows |
| La ligne des nombres | Place a number on a line, read a mark, or calculate by moving along it |

**Every game opens on a settings screen**: number of rounds, material,
durations and options are set before pressing « Démarrer », hence before the
patient sees anything. Each game then shows a session score and a « Consignes
et objectifs » block recalling what is being worked on and the possible
variations.

No duration is announced for a game: the number of rounds is adjustable, and
the pace depends on the patient.

## Adult mode and child mode

A switch in the header flips between two modes, and the choice is kept from
one session to the next.

- **Adult**: a sober interface, without superfluous animation.
- **Child**: a little fox joins in. It smiles and jumps on a correct answer,
  looks sorry and encourages on a wrong one, and a successful game ends with
  confetti.

Child mode changes neither the content of the games, nor the settings, nor the
way points are counted: the same exercise stays comparable across modes. Every
animation is disabled when the system asks for reduced motion.

## Session mode

The **Séance** button opens a worksheet: games are composed into a sequence by
dragging them from the catalogue on the right (by finger as well as by mouse),
the sequence is reordered by dragging or with the arrows, and every step keeps
its own settings. The session is kept in the browser from one time to the
next.

Once started, games follow one another in order: a bar shows where you are,
and moving to the next game happens when the practitioner decides so. At the
end, a **summary** lists the score of every game, its success rate and the
session total, printable and never stored.

## Sharing settings

« Partager ces réglages », on a game's settings screen, turns the current
values into a link (`#/games/<id>?...`) and a matching QR code, drawn in the
house style with the Orthobox mark at its centre. Opening that link, or
scanning the code, reopens the same game with the same settings already
applied — handy to pass a configuration to a colleague or another tablet.

Only the settings travel: no patient, no result, no identifier. A value the
game itself would not have offered is dropped on the way in, and the game's
own default takes over for it.

### Sharing a whole session

« Partager la séance », on the session-planning screen, does the same for an
entire plan: every game in it, in order, with each one's own settings, turns
into a single link (`#/session/shared?p=...`) and QR code. Handy to hand a
prepared session to a patient so they can run through the same exercises at
home — scanning the code opens a short recap of what the session contains,
never the board directly, and starting it there replaces whatever plan was
already being prepared on that device.

As with a single game's settings, nothing about a patient or a result
travels in the link, a step naming a game the catalogue no longer has is
simply left out, and every setting is re-checked against what the game
itself allows.

## Getting started

```bash
npm install
npm run dev       # development (http://localhost:5173)
npm run build     # production build in dist/
npm run preview   # preview the build
npm run lint
npm test          # unit tests (Vitest)
```

`npm run build` also regenerates the PWA PNG icons (`npm run icons` to
regenerate them alone). `ORTHOBOX_NO_PWA=1` produces a build without a service
worker, useful for a hosted preview.

## Continuous integration

| File | Role |
| --- | --- |
| `.github/workflows/ci.yml` | lint, tests and build on `main`, `integ` and every pull request |
| `.github/workflows/release-please.yml` | version computation, changelog, tag, release and GitHub Pages deployment |

The repository follows three levels: working branches start from `integ`,
`integ` is the integration branch, and `main` only receives what is ready to
be published.

### Versions and changelog

The version is never picked by hand. Commit messages follow the
[Conventional Commits](https://www.conventionalcommits.org/) convention, and
[release-please](https://github.com/googleapis/release-please) derives the next
version from them: `fix` gives a patch, `feat` a minor version, a `!` or a
`BREAKING CHANGE` a major version.

Concretely, on every landing on `main`:

1. release-please opens or updates a release pull request, holding the updated
   `CHANGELOG.md` and the new version in `package.json`;
2. merging that pull request creates the **tag** and the **GitHub release**,
   then the build is attached to it as an archive.

Publishing therefore stays a deliberate act, while being entirely computed
from the history.

## Deployment

Every release is published to **GitHub Pages** automatically: once the
release pull request is merged, `.github/workflows/release-please.yml` builds
the application and deploys that exact `dist/` — the same one attached to the
GitHub release as a zip — with no separate build for the two.

More generally, the build is a static application: the contents of `dist/`
can be dropped as they are on any hosting (Netlify, a practice intranet, a USB
stick). The base is relative and navigation uses a hash router
(`#/games/...`), so no URL rewriting is needed, including in a subdirectory.

On first load, the service worker caches the application: the following
sessions work without a connection.

## Visual choices

- **Pastel palette**: four domain tints (peach, sage, lavender, sand) over a
  warm neutral, each with a darker variant reserved for text so contrast stays
  readable:
  [coolors.co/f6bdab-b9d8c2-cdc3ec-f4dfa8-a8c8ec](https://coolors.co/f6bdab-b9d8c2-cdc3ec-f4dfa8-a8c8ec).
- **Two typefaces**, embedded in the repository so they stay available
  offline: *Nunito* for the interface, *Atkinson Hyperlegible* for the material
  read by the patient. The latter tells `b/d/p/q` and `I/l/1` apart, which
  avoids adding a visual difficulty to the material
  (see `src/assets/fonts/README.md`).
- **Sounds**: the sound effects of « La suite de sons » are synthesised by the
  application (Web Audio), with no embedded audio file. Dropping MP3 files in
  `public/sounds/` replaces them automatically, without touching the code
  (see `public/sounds/README.md`).
- **No emoji icon**: every game has its own drawn SVG cover
  (`src/games/<id>/cover.svg`), and the interface uses a hand-made icon set.
  The picture games rely on 24 drawn pictograms (`src/lib/pictograms.jsx`).
- **Tablet first**: touch targets of at least 44 px, layouts that reflow in
  landscape as well as in portrait, boards sized to stay visible without
  scrolling.

## Documentation

- [`ARCHITECTURE.md`](ARCHITECTURE.md): code structure and technical decisions
- [`src/games/README.md`](src/games/README.md): the contract a game must honour
- [`public/sounds/README.md`](public/sounds/README.md): plugging in your own sound effects
- [`src/assets/fonts/README.md`](src/assets/fonts/README.md): fonts and licences

## Adding a game

The architecture is modular: one game equals one folder. The registry
(`src/games/registry.js`) discovers games at build time through
`import.meta.glob`, so there is **no central list to update**.

```
src/games/my-game/
  game.js        # manifest: title, domain, settings, objectives, component
  cover.svg      # the card cover
  MyGame.jsx     # the React component of the game
  data.js        # (optional) the material of the game
```

The full contract (props received, reusable building blocks, shared CSS
classes) is described in [`src/games/README.md`](src/games/README.md).

## Code layout

```
src/
  assets/fonts/  embedded fonts (Nunito, Atkinson Hyperlegible)
  components/    shared frame: cards, filters, score, settings, PWA
  games/         one folder per game, plus the registry
  hooks/         useGameSession, useRounds, useCountdown, useAnswerLock,
                 useDragSequence (touch-capable drag and drop)
  lib/           categories, random draws, local storage, lexicon,
                 pictograms, speech synthesis, sound effects, session plan
  pages/         gallery, game page, session (builder and run)
  styles/        fonts, global styles, gallery, game page
scripts/         PWA icon generation (PNG, no dependency)
```

## Technical notes

- React 18 + Vite 5, `vite-plugin-pwa` (Workbox) for offline use
- Lazy loading: every game is a separate chunk
- No data sent anywhere: only favourites are stored in the browser
- Optional speech synthesis through the device Web Speech API

## Scope of use

These games are rehabilitation material: they are neither a standardised test
nor a diagnostic tool. Choosing the game, the level and interpreting the
answers are up to the practitioner.
