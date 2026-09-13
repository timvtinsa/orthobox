# Orthobox

Galerie de jeux courts, utilisables tels quels pendant une séance d’orthophonie.
Application web **100 % client-side** (aucun serveur, aucune donnée patient),
installable comme **PWA** et utilisable **hors ligne**.

Les jeux sont classés en quatre domaines :

| Domaine | Ce qu’on y travaille |
| --- | --- |
| 🗣️ Langage oral | Phonologie, lexique, évocation, compréhension et expression à l’oral |
| 📖 Langage écrit | Lecture, conscience syllabique, orthographe, fluence |
| 🧩 Fonctions exécutives | Inhibition, mémoire de travail, flexibilité, attention |
| 🔢 Cognition mathématique | Sens du nombre, estimation, chaîne numérique, calcul |

## Jeux disponibles

| Jeu | Domaine | Principe |
| --- | --- | --- |
| L’intrus sonore | Oral | Repérer le mot qui ne partage pas l’attaque ou la rime des autres |
| Qui suis-je ? | Oral | Retrouver un mot à partir d’indices progressifs (évocation lexicale) |
| Le mot en morceaux | Écrit | Reconstruire un mot à partir de ses syllabes mélangées |
| Lecture flash | Écrit | Identifier un mot affiché très brièvement parmi des leurres proches |
| Encre ou mot ? | Exécutif | Stroop : répondre sur la couleur de l’encre, consigne parfois inversée |
| La suite lumineuse | Exécutif | Reproduire une suite de cases, à l’endroit ou à l’envers (empan) |
| Le plus grand tas | Maths | Comparer deux collections (subitizing, estimation, transcodage) |
| Range les nombres | Maths | Ordonner des nombres, y compris décimaux |

Chaque jeu propose plusieurs niveaux, un score de séance et un bloc
« Consignes et objectifs » rappelant ce qui est travaillé et les variantes
possibles.

## Démarrer

```bash
npm install
npm run dev       # développement (http://localhost:5173)
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build
npm run lint
```

`npm run build` régénère au passage les icônes PNG de la PWA
(`npm run icons` pour les régénérer seules).

## Déploiement

Le build est une application statique : le contenu de `dist/` se dépose tel
quel sur n’importe quel hébergement (GitHub Pages, Netlify, intranet du
cabinet, clé USB). La base est relative et la navigation utilise un routeur à
fragment (`#/jeux/...`), donc aucune réécriture d’URL n’est nécessaire, y
compris dans un sous-répertoire.

Au premier chargement, le service worker met l’application en cache : les
séances suivantes fonctionnent sans connexion.

## Ajouter un jeu

L’architecture est modulaire : un jeu = un dossier. Le registre
(`src/games/registry.js`) détecte les jeux au build via `import.meta.glob`,
il n’y a **aucune liste centrale à mettre à jour**.

```
src/games/mon-jeu/
  game.js        # fiche : titre, domaine, niveaux, objectifs, composant
  MonJeu.jsx     # le composant React du jeu
  data.js        # (optionnel) le matériel du jeu
```

Le contrat complet (props reçues, briques réutilisables, classes CSS
communes) est décrit dans [`src/games/README.md`](src/games/README.md).

## Organisation du code

```
src/
  components/    cadre commun : galerie, cartes, filtres, score, niveaux, PWA
  games/         un dossier par jeu + le registre
  hooks/         useGameSession, useRounds, useCountdown, useAnswerLock…
  lib/           catégories, tirage aléatoire, stockage local, synthèse vocale
  pages/         galerie, page de jeu, à propos
  styles/        styles globaux, galerie, page de jeu
scripts/         génération des icônes PWA (PNG, sans dépendance)
```

## Technique

- React 18 + Vite 5, `vite-plugin-pwa` (Workbox) pour le hors-ligne
- Chargement paresseux : chaque jeu est un chunk séparé
- Aucune donnée envoyée : seuls les favoris sont stockés dans le navigateur
- Lecture vocale facultative via l’API Web Speech du poste

## Cadre d’usage

Ces jeux sont des supports de rééducation : ils ne constituent ni un test
étalonné ni un outil de diagnostic. Le choix du jeu, du niveau et
l’interprétation des réponses relèvent du praticien.
