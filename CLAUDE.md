# Orthobox — repères pour Claude

Application React + Vite, entièrement client-side, utilisée en séance
d'orthophonie. Voir `README.md` pour le détail et `src/games/README.md` pour
le contrat d'un jeu.

## Prévisualisation — à faire à chaque changement

L'utilisateur attend **un lien de prévisualisation à jour à la fin de chaque
série de modifications**, sans avoir à le demander.

```bash
npm run build:preview      # build sans service worker + dist-preview/page.html + files.json
```

Publier ensuite `dist-preview/page.html` en artefact, avec `root: dist-preview`
et la correspondance `dist-preview/files.json` (les entrées à `null` retirent
les fichiers devenus inutiles). **Republier toujours le même chemin de fichier
pour conserver la même URL** ; si l'URL a été perdue, la retrouver via la liste
des artefacts plutôt que d'en créer un nouveau.

## Avant de livrer

```bash
npm run lint
npm run build
```

Vérifier les changements d'interface dans un vrai navigateur (Chromium est
préinstallé, `executablePath: '/opt/pw-browsers/chromium'`), en desktop **et**
en tablette (1024×768 et 768×1024) : l'application est utilisée sur tablette.

## Conventions

- Toute l'interface est en français, accentuée, y compris le matériel des jeux.
- Pas d'emoji dans l'interface : icônes SVG (`src/components/Icon.jsx`),
  vignettes dessinées (`src/games/<id>/cover.svg`), pictogrammes
  (`src/lib/pictos.jsx`).
- Palette pastel et polices embarquées : ne pas charger de ressource distante,
  l'application doit fonctionner hors ligne.
- Cibles tactiles d'au moins 44 px, aucune information portée par la seule
  couleur.
- Tout jeu déclare ses paramètres dans `settings` (`game.js`) : le cadre
  affiche l'écran de réglages et ne lance la partie qu'au « Démarrer ».
- Les jeux doivent rester utilisables dans le mode séance : le score passe par
  `session.register()`, jamais par un écran de fin.
