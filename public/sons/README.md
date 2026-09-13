# Utiliser vos propres bruitages

Le jeu « La suite de sons » fonctionne sans aucun fichier audio : les bruits
sont fabriqués par l'application (voir `src/lib/audio.js`). Ils sont
reconnaissables, mais stylisés.

Pour les remplacer par de vrais enregistrements, déposez simplement des
fichiers MP3 dans ce dossier, nommés d'après l'identifiant du son. Rien
d'autre à modifier : l'application détecte les fichiers présents au premier
usage et les utilise à la place de la synthèse. Ceux qui manquent restent
synthétisés.

## Noms de fichiers attendus

Bruits du quotidien :

```
sonnette.mp3   telephone.mp3   horloge.mp3      klaxon.mp3
eau.mp3        verre.mp3       tambour.mp3      sifflet.mp3
porte.mp3      applaudissements.mp3             cloche.mp3
moteur.mp3
```

Animaux (aucune synthèse pour ceux-là : sans fichier, c'est la voix de
l'appareil qui prononce le nom de l'animal) :

```
chat.mp3   chien.mp3   oiseau.mp3   vache.mp3   cheval.mp3
```

## Conseils

- **Durée** : 1 à 2 secondes, le son doit être identifiable immédiatement.
- **Poids** : viser 20 à 60 Ko par fichier (mono, 64 kbps suffit). Les
  fichiers sont mis en cache pour l'usage hors ligne, inutile de les alourdir.
- **Niveau** : normaliser les fichiers entre eux, pour qu'aucun son ne soit
  nettement plus fort qu'un autre dans une même suite.
- **Licence** : n'utilisez que des sons dont la licence autorise la
  redistribution (CC0 ou domaine public de préférence) et conservez la trace
  de leur provenance dans ce fichier.

## Provenance des fichiers ajoutés

Complétez ce tableau au fur et à mesure :

| Fichier | Source | Auteur | Licence |
| --- | --- | --- | --- |
| | | | |
