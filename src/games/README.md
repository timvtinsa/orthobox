# Ajouter un jeu

Chaque jeu est autonome dans son dossier. Aucune liste centrale à modifier :
`src/games/registry.js` détecte les jeux au build via `import.meta.glob`.

```
src/games/
  mon-jeu/
    game.js        <- fiche descriptive (obligatoire)
    cover.svg      <- vignette de la carte (obligatoire)
    MonJeu.jsx     <- le composant React du jeu
    data.js        <- (optionnel) le matériel du jeu
```

## 1. La fiche `game.js`

```js
import { lazy } from 'react'
import cover from './cover.svg'

export default {
  id: 'mon-jeu',                      // identique au nom du dossier
  title: 'Mon jeu',
  tagline: 'Une phrase qui dit ce qu’on travaille.',
  category: 'langage-oral',           // voir src/lib/categories.js
  cover,                              // vignette SVG du dossier
  ages: '5 à 8 ans',
  duration: '5 min',
  keywords: ['phonologie'],           // utilisés par la recherche
  objectives: ['Discrimination auditive', 'Attention'],
  materials: ['Variante : faire répéter le mot avant de répondre.'],
  instructions: 'Consigne affichée dans le bloc « Consignes et objectifs ».',
  levels: [
    { id: 'facile', label: 'Facile', hint: '3 propositions' },
    { id: 'moyen', label: 'Moyen', hint: '4 propositions' },
  ],
  component: lazy(() => import('./MonJeu.jsx')),
}
```

Champs obligatoires : `id`, `title`, `tagline`, `category`, `cover`, `component`.
Le registre échoue au démarrage si un champ manque, si la catégorie est
inconnue, ou si `id` ne correspond pas au nom du dossier.

Les quatre catégories disponibles sont `langage-oral`, `langage-ecrit`,
`fonctions-executives` et `cognition-mathematique`.

## 2. Le composant

Il reçoit deux props fournies par la page de jeu :

- `level` : l’`id` du niveau sélectionné (`null` si le jeu n’en déclare pas) ;
- `session` : `{ correct, attempts, streak, bestStreak, register(isCorrect), reset() }`.
  Appeler `session.register(true | false)` à chaque réponse alimente le score
  affiché dans l’en-tête.

Changer de niveau ou cliquer sur « Recommencer » remonte le composant : l’état
initial peut donc être calculé directement dans `useState(...)`.

## 3. La vignette `cover.svg`

Un SVG en `viewBox="0 0 320 200"`, sans texte, qui évoque la mécanique du jeu :
un aplat de fond dans la teinte claire du domaine, puis des formes dans les
couleurs de la palette (`src/lib/categories.js`). Pas d'emoji ni d'icône
générique : la vignette doit rester reconnaissable en petit dans la galerie.

## 4. Briques partagées

- `components/Feedback.jsx` — ligne « Bravo / Presque… »
- `components/GameOver.jsx` — écran de fin, score et bouton « Rejouer »
- `components/SpeakButton.jsx` — lecture vocale d’un mot (si une voix est disponible)
- `components/SetupPanel.jsx` + `Stepper.jsx` / `SwitchGroup.jsx` — écran de
  réglages affiché avant la partie (nombre d’items, durée, options)
- `components/StudyPhase.jsx` — phase de mémorisation avec compte à rebours
- `components/Icon.jsx` — jeu d’icônes SVG (étoile, haut-parleur, flèche…)
- `hooks/useRounds.js` — avancement en manches
- `hooks/useCountdown.js` — compte à rebours
- `hooks/useAnswerLock.js` — verrou anti double-clic sur les réponses
- `lib/random.js` — `shuffle`, `sample`, `pick`, `randomInt`
- `lib/lexique.js` — mots fréquents, suites de chiffres, comparaison souple
- `lib/pictos.jsx` — 24 pictogrammes dessinés, réutilisables
- classes CSS communes : `.game-board`, `.game-prompt`, `.choice-grid`,
  `.choice` (+ `--correct`, `--wrong`, `--dim`), `.game-actions`, `.token`,
  `.setup`, `.field`, `.word-list`, `.picture-grid`, `.quiz`, `.scene`

Respecter ces briques garde les jeux cohérents entre eux et lisibles sur
tablette : cibles tactiles d’au moins 44 px, contrastes suffisants, et aucune
information portée par la seule couleur.

### Jeux paramétrables

Un jeu dont le matériel se règle (nombre d’éléments, durée d’affichage)
déclare `levels: []` et ouvre sur un `SetupPanel` : le praticien fixe les
réglages **avant** que le patient ne voie le matériel. Le déroulé habituel est
`réglages → mémorisation → test → résultats`, avec deux sorties : relancer avec
les mêmes réglages, ou revenir aux réglages.

## 5. Vérifier

```
npm run dev     # le jeu apparaît dans sa section dès l’enregistrement du fichier
npm run lint
npm run build
```
