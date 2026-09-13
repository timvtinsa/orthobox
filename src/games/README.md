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
  ages: '5 ans et plus',
  keywords: ['phonologie'],           // utilisés par la recherche
  objectives: ['Discrimination auditive', 'Attention'],
  materials: ['Variante : faire répéter le mot avant de répondre.'],
  instructions: 'Consigne affichée dans le bloc « Consignes et objectifs ».',
  settings: [
    {
      id: 'niveau',                   // type 'choice' : options exclusives
      type: 'choice',
      label: 'Niveau',
      default: 'facile',
      options: [
        { id: 'facile', label: 'Facile', hint: '3 propositions' },
        { id: 'moyen', label: 'Moyen', hint: '4 propositions' },
      ],
    },
    {                                 // type 'number' : réglage à gros boutons
      id: 'manches',
      type: 'number',
      label: 'Nombre de questions',
      min: 5,
      max: 20,
      step: 1,
      default: 10,
      suffix: 's',                    // facultatif
      hint: 'Affiché sous le réglage.',
    },
  ],
  component: lazy(() => import('./MonJeu.jsx')),
}
```

Les réglages sont présentés avant la partie, sur un écran commun à tous les
jeux : le praticien règle, puis appuie sur « Démarrer ». Un jeu sans réglage
déclare `settings: []`.

Champs obligatoires : `id`, `title`, `tagline`, `category`, `cover`, `component`.
Le registre échoue au démarrage si un champ manque, si la catégorie est
inconnue, ou si `id` ne correspond pas au nom du dossier.

Les quatre catégories disponibles sont `langage-oral`, `langage-ecrit`,
`fonctions-executives` et `cognition-mathematique`.

## 2. Le composant

Il reçoit deux props fournies par la page de jeu :

- `config` : un objet `{ <id du réglage>: valeur }` construit à partir des
  `settings` déclarés. Le jeu peut s’y fier, les valeurs par défaut sont
  toujours renseignées ;
- `session` : `{ correct, attempts, streak, bestStreak, register(isCorrect), reset() }`.
  Appeler `session.register(true | false)` à chaque réponse alimente le score
  affiché dans l’en-tête.

« Démarrer » et « Recommencer » remontent le composant : l’état initial peut
donc être calculé directement dans `useState(...)` à partir de `config`.

Le jeu est aussi utilisé tel quel dans le **mode séance**, où le praticien
passe au jeu suivant quand il le décide : ne comptez pas sur une fin de partie
pour transmettre le score, appelez `session.register()` au fil des réponses.

C'est également `session.register()` qui fait réagir la mascotte du **mode
enfant** : un jeu qui appelle cette fonction à chaque réponse en bénéficie
sans rien ajouter, et n'a pas à savoir quel mode est actif.

## 3. La vignette `cover.svg`

Un SVG en `viewBox="0 0 320 200"`, sans texte, qui évoque la mécanique du jeu :
un aplat de fond dans la teinte claire du domaine, puis des formes dans les
couleurs de la palette (`src/lib/categories.js`). Pas d'emoji ni d'icône
générique : la vignette doit rester reconnaissable en petit dans la galerie.

## 4. Briques partagées

- `components/Feedback.jsx` : ligne « Bravo » ou « Presque »
- `components/GameOver.jsx` : écran de fin, score et bouton « Rejouer »
- `components/SpeakButton.jsx` : lecture vocale d’un mot, si une voix est disponible
- `components/GameSetup.jsx` : écran de réglages bâti depuis `settings`
  (`SetupPanel`, `Stepper` et `SwitchGroup` en sont les briques)
- `components/StudyPhase.jsx` : phase de mémorisation avec compte à rebours
- `components/Icon.jsx` : jeu d’icônes SVG (étoile, haut-parleur, flèche)
- `hooks/useRounds.js` : avancement en manches
- `hooks/useCountdown.js` : compte à rebours
- `hooks/useAnswerLock.js` : verrou anti double-clic sur les réponses
- `lib/random.js` : `shuffle`, `sample`, `pick`, `randomInt`
- `lib/lexique.js` : mots fréquents, suites de chiffres, comparaison souple
- `lib/pictos.jsx` : 32 pictogrammes dessinés, réutilisables
- `lib/audio.js` : bruitages, fichier audio s'il existe, synthèse sinon
- `lib/disposition.js` : placement d'éléments sans chevauchement
- `components/ChoixMultiple.jsx` : propositions à choix unique, avec correction
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
