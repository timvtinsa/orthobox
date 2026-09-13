# Orthobox

Galerie de jeux courts, utilisables tels quels pendant une séance
d’orthophonie. Application web **100 % client-side** (aucun serveur, aucune
donnée patient), installable comme **PWA**, utilisable **hors ligne** et pensée
pour la tablette.

Les jeux sont classés en quatre domaines :

| Domaine | Ce qu’on y travaille |
| --- | --- |
| Langage oral | Phonologie, lexique, évocation, compréhension et expression à l’oral |
| Langage écrit | Lecture, conscience syllabique, compréhension écrite, fluence |
| Fonctions exécutives | Inhibition, mémoire de travail, attention, flexibilité, recherche visuelle |
| Cognition mathématique | Sens du nombre, estimation, chaîne numérique, calcul |

## Les 14 jeux

**Langage oral**

| Jeu | Principe |
| --- | --- |
| L’intrus sonore | Repérer le mot qui ne partage pas l’attaque ou la rime des autres |
| Qui suis-je ? | Retrouver un mot à partir d’indices progressifs (évocation lexicale) |

**Langage écrit**

| Jeu | Principe |
| --- | --- |
| Le mot en morceaux | Reconstruire un mot à partir de ses syllabes mélangées |
| Lecture flash | Identifier un mot affiché très brièvement parmi des leurres proches |
| L’histoire et les détails | Lire une histoire, puis répondre à un QCM sur ses détails |

**Fonctions exécutives**

| Jeu | Principe |
| --- | --- |
| Encre ou mot ? | Stroop : répondre sur la couleur de l’encre, consigne parfois inversée |
| La suite lumineuse | Reproduire une suite de cases, à l’endroit ou à l’envers |
| Cherche et trouve | Repérer un objet précis dans un décor de 24 à 80 objets |
| La liste de mots | Mémoriser une liste, puis reconnaître les mots parmi des mots nouveaux |
| La planche d’images | Même principe, avec des images |
| Le rappel de liste | Mémoriser une liste, puis la restituer de mémoire |
| La suite de chiffres | Retenir une suite de chiffres, la retaper à l’endroit ou à l’envers |

**Cognition mathématique**

| Jeu | Principe |
| --- | --- |
| Le plus grand tas | Comparer deux collections (subitizing, estimation, transcodage) |
| Range les nombres | Ordonner des nombres, y compris décimaux |

Chaque jeu affiche un score de séance et un bloc « Consignes et objectifs »
rappelant ce qui est travaillé et les variantes possibles. Les jeux de
mémorisation s’ouvrent sur un **écran de réglages** : nombre d’éléments, temps
d’affichage et options se fixent avant que le patient ne voie le matériel.

## Démarrer

```bash
npm install
npm run dev       # développement (http://localhost:5173)
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build
npm run lint
```

`npm run build` régénère au passage les icônes PNG de la PWA
(`npm run icons` pour les régénérer seules). `ORTHOBOX_NO_PWA=1` produit un
build sans service worker, utile pour une prévisualisation hébergée.

## Déploiement

Le build est une application statique : le contenu de `dist/` se dépose tel
quel sur n’importe quel hébergement (GitHub Pages, Netlify, intranet du
cabinet, clé USB). La base est relative et la navigation utilise un routeur à
fragment (`#/jeux/...`), donc aucune réécriture d’URL n’est nécessaire, y
compris dans un sous-répertoire.

Au premier chargement, le service worker met l’application en cache : les
séances suivantes fonctionnent sans connexion.

## Parti pris visuel

- **Palette pastel** : quatre teintes de domaine (pêche, sauge, lavande, sable)
  sur un neutre chaud, chacune déclinée en version foncée réservée au texte
  pour garder des contrastes lisibles —
  [coolors.co/f6bdab-b9d8c2-cdc3ec-f4dfa8-a8c8ec](https://coolors.co/f6bdab-b9d8c2-cdc3ec-f4dfa8-a8c8ec).
- **Deux typographies**, embarquées dans le dépôt pour rester disponibles hors
  ligne : *Nunito* pour l’interface, *Atkinson Hyperlegible* pour le matériel
  lu par le patient — cette dernière différencie `b/d/p/q` et `I/l/1`, ce qui
  évite d’ajouter une difficulté visuelle au matériel
  (voir `src/assets/fonts/README.md`).
- **Aucune icône emoji** : chaque jeu a sa vignette SVG dessinée
  (`src/games/<id>/cover.svg`), et l’interface utilise un jeu d’icônes maison.
  Les jeux d’images reposent sur 24 pictogrammes dessinés (`src/lib/pictos.jsx`).
- **Tablette d’abord** : cibles tactiles d’au moins 44 px, mises en page qui se
  réorganisent en paysage comme en portrait, plateaux dimensionnés pour rester
  visibles sans défiler.

## Ajouter un jeu

L’architecture est modulaire : un jeu = un dossier. Le registre
(`src/games/registry.js`) détecte les jeux au build via `import.meta.glob`,
il n’y a **aucune liste centrale à mettre à jour**.

```
src/games/mon-jeu/
  game.js        # fiche : titre, domaine, niveaux, objectifs, composant
  cover.svg      # vignette de la carte
  MonJeu.jsx     # le composant React du jeu
  data.js        # (optionnel) le matériel du jeu
```

Le contrat complet (props reçues, briques réutilisables, classes CSS
communes) est décrit dans [`src/games/README.md`](src/games/README.md).

## Organisation du code

```
src/
  assets/fonts/  polices embarquées (Nunito, Atkinson Hyperlegible)
  components/    cadre commun : cartes, filtres, score, réglages, PWA
  games/         un dossier par jeu + le registre
  hooks/         useGameSession, useRounds, useCountdown, useAnswerLock…
  lib/           domaines, tirage aléatoire, stockage local, lexique,
                 pictogrammes, synthèse vocale
  pages/         galerie, page de jeu
  styles/        polices, styles globaux, galerie, page de jeu
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
