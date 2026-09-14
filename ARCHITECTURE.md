# Architecture

Ce document décrit comment Orthobox est construit et pourquoi. Pour ajouter un
jeu, voir [`src/games/README.md`](src/games/README.md), qui détaille le contrat
à respecter.

## Vue d'ensemble

Orthobox est une application React servie comme un site statique. Il n'y a ni
serveur, ni base de données, ni compte utilisateur : tout s'exécute dans le
navigateur du praticien, et rien n'en sort.

```
                 ┌──────────────────────────────────────┐
   Galerie  ───► │  Page de jeu : réglages, puis partie │
                 └──────────────────────────────────────┘
                                  ▲
                                  │ même composant de jeu,
                                  │ mêmes réglages
                 ┌────────────────┴─────────────────────┐
   Séance   ───► │  Déroulé : jeu 1, jeu 2, ..., bilan  │
                 └──────────────────────────────────────┘
```

Un jeu ne sait pas s'il est lancé depuis la galerie ou depuis une séance. Il
reçoit dans les deux cas les mêmes props et rend compte de la même façon, ce
qui évite d'avoir deux chemins de code à maintenir.

## Arborescence

```
src/
  assets/fonts/    polices embarquées (Nunito, Atkinson Hyperlegible)
  components/      cadre commun, réutilisable par tous les jeux
  games/           un dossier par jeu, plus le registre
  hooks/           logique d'état réutilisable
  lib/             données et fonctions sans interface
  pages/           une page par route
  styles/          feuilles globales, galerie, page de jeu
public/
  icons/           icônes de la PWA (générées par scripts/generate-icons.mjs)
  sons/            emplacement des fichiers audio facultatifs
scripts/           génération des icônes, build de prévisualisation
```

## Le registre de jeux

`src/games/registry.js` est le seul point qui connaît la liste des jeux, et il
ne la contient pas : il la découvre au build.

```js
const modules = import.meta.glob('./*/game.js', { eager: true })
```

Chaque dossier de jeu expose une fiche `game.js` décrivant le jeu (titre,
domaine, vignette, objectifs, réglages) et pointant vers son composant en
import paresseux. Le registre valide ces fiches au démarrage : un champ
obligatoire manquant, une catégorie inconnue ou un identifiant qui ne
correspond pas au dossier arrêtent l'application avec un message explicite,
plutôt que de produire une galerie silencieusement incomplète.

Conséquence : **ajouter un jeu ne demande de modifier aucun fichier existant.**
C'est la propriété que toute évolution doit préserver.

## Le contrat d'un jeu

Un composant de jeu reçoit exactement deux props :

| Prop | Rôle |
| --- | --- |
| `config` | valeurs des réglages, construites depuis `settings` |
| `session` | compteur de score partagé avec le cadre |

`session.register(true \| false)` est appelé à chaque réponse. C'est le seul
canal par lequel un score remonte : ni la page de jeu ni le mode séance
n'attendent d'écran de fin, puisque la plupart des jeux peuvent être
interrompus en cours de route par le praticien.

Le composant est remonté (via une `key`) à chaque « Démarrer » et à chaque
« Recommencer ». Un jeu peut donc calculer son état initial directement dans
`useState`, sans se soucier de réinitialisation.

## Réglages

Un jeu décrit ses paramètres de façon déclarative :

```js
settings: [
  { id: 'critere', type: 'choice', label: '…', default: '…', options: [...] },
  { id: 'manches', type: 'number', label: '…', min: 5, max: 20, default: 10 },
]
```

`GameSetup` traduit cette description en contrôles (`SwitchGroup` pour un
choix, `Stepper` pour un nombre) et produit l'objet `config`. Aucun jeu ne
dessine son propre écran de réglages : c'est ce qui garantit que tous se
règlent de la même manière, et que le mode séance peut régler n'importe quel
jeu sans rien savoir de lui.

Les valeurs restent brutes (`14` et non `'1,4 s'`) ; seul l'affichage est mis
en forme, via le champ `unite`. Une config est ainsi sérialisable telle quelle
dans une séance enregistrée.

## Mode séance

Une séance est une liste d'étapes `{ id, gameId, config }`, conservée dans le
navigateur (`localStorage`).

- `SeancePage` la compose : catalogue à gauche, séquence à droite, réordonnable
  par glissement ou aux flèches, chaque étape ayant son bouton de réglages.
- `SeanceRunPage` la déroule : une étape à la fois, chacune montée avec sa
  propre `session`. Le passage au jeu suivant est déclenché par le praticien,
  jamais par le jeu, et le score au moment du passage est conservé pour le
  récapitulatif final.

Le glisser-déposer est maison (`hooks/useDragSequence.js`), en Pointer Events :
le glisser-déposer HTML5 natif ne fonctionne pas au doigt, ce qui le rendrait
inutilisable sur tablette. Le geste en cours est suivi dans des refs et non
dans l'état React, car un glissement rapide peut produire déplacement et
relâchement dans la même frame, avant tout nouveau rendu.

## Mode adulte et mode enfant

`ModeProvider` porte le mode courant, le conserve dans le navigateur et le
pose sur l'élément racine (`data-mode`). Le mode enfant ajoute une couche
d'encouragement, jamais une variante d'exercice : ni les réglages, ni le
matériel, ni le calcul du score ne dépendent du mode.

Le compagnon ne connaît aucun jeu. Il observe la session, qui note la dernière
réponse et incrémente un compteur d'évènements à chaque appel de
`session.register()` ; ce compteur permet de rejouer l'animation même sur deux
bonnes réponses de suite, où l'état ne change pas. Un nouveau jeu bénéficie
donc de la mascotte sans une ligne de code supplémentaire.

Les animations sont en CSS et disparaissent sous `prefers-reduced-motion`,
comme le reste de l'application.

## Données et confidentialité

Trois choses seulement sont écrites dans le navigateur : la liste des jeux mis
en favori, la séance en préparation, et le mode d'affichage. Aucune donnée patient, aucun score
historisé, aucun appel réseau en cours d'utilisation. `lib/storage.js` protège
chaque accès : navigation privée ou stockage bloqué ne doivent jamais empêcher
un jeu de fonctionner.

## Hors ligne

`vite-plugin-pwa` (Workbox) précharge l'application au premier chargement. Pour
que le mode hors ligne soit réel, **aucune ressource distante n'est utilisée** :
les polices sont embarquées dans le dépôt, les illustrations sont des SVG
écrits à la main, les bruitages sont fabriqués par Web Audio. Toute dépendance
à un CDN casserait cette propriété.

`ORTHOBOX_NO_PWA=1` produit un build sans service worker, utilisé pour la
prévisualisation hébergée.

## Son

`lib/audio.js` expose une banque de sons dont la provenance est transparente
pour les jeux :

1. si `public/sons/<id>.mp3` existe, ce fichier est utilisé ;
2. sinon, un bruitage est synthétisé (oscillateurs, bruit filtré, courte
   réverbération de convolution).

Le dépôt n'embarque donc aucun fichier audio, tout en permettant d'en ajouter
sans toucher au code. Les noms d'animaux, faute de synthèse crédible, passent
par la synthèse vocale du système tant qu'aucun fichier ne les remplace.

## Identité visuelle

Les couleurs vivent dans `lib/categories.js` (trois teintes par domaine) et
dans les variables de `styles/global.css`. Un composant ne fixe jamais une
couleur en dur : il pose `categoryStyle(category)` sur un conteneur et utilise
`var(--category)`, `var(--category-pastel)` et `var(--category-tint)`. Changer
la palette d'un domaine ne demande donc de toucher qu'un objet.

Deux familles typographiques, avec des rôles distincts : Nunito pour
l'interface, Atkinson Hyperlegible pour tout ce que le patient doit lire, car
elle différencie `b/d/p/q` et `I/l/1`.

## Contraintes d'interface

Elles sont valables pour tout ajout :

- français accentué partout, y compris dans le matériel des jeux ;
- pas d'emoji : icônes SVG, vignettes dessinées, pictogrammes ;
- cibles tactiles d'au moins 44 px, et aucune information portée par la seule
  couleur ;
- aucun débordement horizontal, du téléphone à la tablette en paysage.

## Outillage

| Commande | Effet |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` | icônes PWA puis build de production |
| `npm run build:preview` | build sans service worker, prêt à publier |
| `npm run lint` | ESLint sur tout le dépôt |
| `npm test` | tests unitaires (Vitest) |

### Ce que les tests couvrent

Les tests portent sur la logique et sur les données, là où une régression
passerait inaperçue : le contrat des fiches de jeu (champs obligatoires,
réglages exploitables, valeurs par défaut dans les bornes et atteignables au
pas déclaré), les tirages aléatoires, le placement sans chevauchement, l'ordre
des étapes d'une séance, la comparaison souple des mots et le stockage local,
y compris lorsqu'il est refusé par le navigateur.

Le rendu, lui, se vérifie dans un navigateur réel, aux trois formats de
référence : c'est là que se voient les débordements et les cibles trop
petites, que des tests unitaires ne détecteraient pas.

### Intégration continue

`.github/workflows/ci.yml` rejoue lint, tests et build sur `main`, sur `integ`
et sur chaque pull request. `.github/workflows/release-please.yml` calcule la
version à partir des messages de commit, tient le `CHANGELOG.md`, et crée le
tag et la release au moment où la pull request de release est fusionnée.
