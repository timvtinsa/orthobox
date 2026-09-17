# Adding a game

Every game is self-contained in its folder. There is no central list to edit:
`src/games/registry.js` discovers games at build time through
`import.meta.glob`.

```
src/games/
  my-game/
    game.js        <- descriptive manifest (required)
    cover.svg      <- the card cover (required)
    MyGame.jsx     <- the React component of the game
    data.js        <- (optional) the material of the game
```

The code is written in English; every string shown to the user, and all game
material, is written in French.

## 1. The `game.js` manifest

```js
import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'my-game',                      // identical to the folder name
  title: 'Mon jeu',
  tagline: 'Une phrase qui dit ce qu’on travaille.',
  category: 'oral-language',          // see src/lib/categories.js
  cover,                              // SVG cover from the folder
  ages: '5 ans et plus',
  keywords: ['phonologie'],           // used by the search box
  objectives: ['Discrimination auditive', 'Attention'],
  materials: ['Variante : faire répéter le mot avant de répondre.'],
  instructions: 'Consigne affichée dans le bloc « Consignes et objectifs ».',
  settings: [
    {
      id: 'level',                    // type 'choice': exclusive options
      type: 'choice',
      label: 'Niveau',
      default: 'easy',
      options: [
        { id: 'easy', label: 'Facile', hint: '3 propositions' },
        { id: 'medium', label: 'Moyen', hint: '4 propositions' },
      ],
    },
    {                                 // type 'number': large-button stepper
      id: 'rounds',
      type: 'number',
      label: 'Nombre de questions',
      min: 5,
      max: 20,
      step: 1,
      default: 10,
      suffix: 's',                    // optional
      hint: 'Affiché sous le réglage.',
    },
  ],
  component: lazy(() => import('./MyGame.jsx')),
}
```

Settings are presented before the game, on a screen shared by every game: the
practitioner adjusts them, then presses « Démarrer ». A game without any
setting declares `settings: []`.

Required fields: `id`, `title`, `tagline`, `category`, `cover`, `component`.
The registry fails at startup when a field is missing, when the category is
unknown, or when `id` does not match the folder name.

The four available categories are `oral-language`, `written-language`,
`executive-functions` and `math-cognition`.

Identifiers (`id` of the game, of a setting, of an option) are in English;
`title`, `tagline`, `label`, `hint`, `objectives`, `materials` and
`instructions` are the French texts shown on screen.

## 2. The component

It receives two props provided by the game page:

- `config`: an object `{ <setting id>: value }` built from the declared
  `settings`. A game can rely on it, the defaults are always filled in;
- `session`: `{ correct, attempts, streak, bestStreak, register(isCorrect), reset() }`.
  Calling `session.register(true | false)` on every answer feeds the score
  shown in the header.

« Démarrer » and « Recommencer » remount the component: the initial state can
therefore be computed directly in `useState(...)` from `config`.

The game is also used as is in **session mode**, where the practitioner moves
to the next game whenever they decide to: do not rely on an end screen to hand
over the score, call `session.register()` as the answers come.

`session.register()` is also what makes the **child mode** mascot react: a game
calling it on every answer benefits from it without adding anything, and never
has to know which mode is active.

## 3. The `cover.svg` file

An SVG in `viewBox="0 0 320 200"`, without text, evoking the mechanics of the
game: a flat background in the light tint of the domain, then two or three
shapes in its pastel and its ink (`src/lib/categories.js`), stroked at 6 units.
No emoji, no generic icon: the cover must stay recognisable small in the
gallery.

A cover shows the gesture, not the theme: comparing two piles, setting an odd
one aside, putting back in order. The twenty covers are composed with one
vocabulary, so a practitioner who has read one has read them all:

| Sign | Means |
| --- | --- |
| dashed outline | the element to designate |
| bent arrow | a movement |
| pile of tokens | a quantity |
| empty dashed rectangle | a place to fill |

Unlike the drawings of the patient bank, a cover belongs to a domain, so its
stroke takes the ink of that domain rather than the constant black.

## 4. Shared building blocks

- `components/Feedback.jsx`: the « Bravo » or « Presque » line
- `components/GameOver.jsx`: end screen, score and « Rejouer » button
- `components/SpeakButton.jsx`: reads a word aloud, when a voice is available
- `components/GameSetup.jsx`: settings screen built from `settings`
  (`Stepper` and `SwitchGroup` are its building blocks)
- `components/StateMark.jsx`: the corner pictogram of a correction state
- `components/CategoryShape.jsx`: the geometric shape of a domain
- `components/StudyPhase.jsx`: memorisation phase with a countdown
- `components/Icon.jsx`: the SVG icon set (star, speaker, arrow)
- `components/MultipleChoice.jsx`: single-answer options, with correction
- `hooks/useRounds.js`: progress in rounds
- `hooks/useCountdown.js`: countdown
- `hooks/useAnswerLock.js`: double-click guard on answers
- `lib/random.js`: `shuffle`, `sample`, `pick`, `randomInt`
- `lib/lexicon.js`: frequent words, digit sequences, lenient comparison
- `lib/pictograms.jsx`: the bank of 32 drawings, reusable, each in three
  layers on a 120 by 120 grid (flat colour, one shadow plane, outline plus
  ground ellipse), with the fine details in a `picto__fine` group dropped
  below 64 px. `node scripts/contact-sheet.mjs` renders the whole bank in the
  three readings a drawing has to hold: 132 px, 52 px and greyscale
- `lib/audio.js`: sound effects, an audio file when one exists, synthesis otherwise
- `lib/layout.js`: placing items without overlap
- `lib/answer-state.js`: the correction state of an option, `answerState`
  and `stateClass`
- shared CSS classes: `.game-board`, `.game-prompt`, `.choice-grid`,
  `.choice` (+ `.is-ok`, `.is-err`, `.is-expected`, `.is-selected`,
  `--dim`), `.game-actions`, `.token`, `.setup`, `.word-list`,
  `.picture-grid`, `.quiz`, `.scene`

A correction state is never carried by colour alone: it always shows a border
stroke (solid, dashed, dotted), a corner pictogram and a tint, which is what
`answerState` plus `StateMark` produce. The expected answer revealed after a
miss carries its own state, `expected`, and is never credited as correct.

Honouring these blocks keeps the games consistent with one another and
readable on a tablet: touch targets of at least 44 px on the practitioner's
side and 64 px for anything the patient touches on a board, sufficient
contrast, and no information carried by colour alone.

### Games with adjustable material

A game whose material is adjustable (number of items, display time) declares
those values in `settings`: the practitioner fixes them **before** the patient
sees the material. The usual flow is `settings → memorisation → test →
results`, with two ways out: replaying with the same settings, or going back to
the settings.

## 5. Checking

```
npm run dev     # the game shows up in its section as soon as the file is saved
npm run lint
npm run build
```
