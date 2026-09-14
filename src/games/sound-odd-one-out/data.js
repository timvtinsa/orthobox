/**
 * Phonological material: families of words sharing an onset (initial sound)
 * or a rhyme (final sound). Concrete, frequent vocabulary, suited to
 * school-age children.
 */

export const ONSETS = [
  { sound: '[b]', words: ['ballon', 'bateau', 'banane', 'bouche', 'bougie', 'biberon'] },
  { sound: '[ch]', words: ['chat', 'chapeau', 'cheval', 'chaise', 'chocolat', 'chien'] },
  { sound: '[f]', words: ['fusée', 'feuille', 'fourchette', 'fromage', 'fenêtre', 'fleur'] },
  { sound: '[l]', words: ['lapin', 'lune', 'livre', 'lion', 'lampe', 'lit'] },
  { sound: '[m]', words: ['maison', 'moto', 'montagne', 'mouton', 'main', 'miel'] },
  { sound: '[p]', words: ['papillon', 'poisson', 'pomme', 'porte', 'poule', 'panier'] },
  { sound: '[r]', words: ['robot', 'radis', 'rideau', 'renard', 'route', 'riz'] },
  { sound: '[s]', words: ['soleil', 'souris', 'sac', 'savon', 'salade', 'serpent'] },
  { sound: '[t]', words: ['table', 'tortue', 'tomate', 'train', 'tapis', 'téléphone'] },
  { sound: '[v]', words: ['vache', 'vélo', 'voiture', 'valise', 'ville', 'verre'] },
  { sound: '[k]', words: ['canard', 'cadeau', 'camion', 'carotte', 'cube', 'cahier'] },
  { sound: '[j]', words: ['jardin', 'jupe', 'journal', 'jouet', 'jambe', 'jaune'] },
  { sound: '[d]', words: ['dauphin', 'domino', 'doigt', 'dinosaure', 'dent', 'douche'] },
  { sound: '[g]', words: ['gâteau', 'gomme', 'garage', 'guitare', 'gorille', 'gant'] },
]

export const RHYMES = [
  { sound: '[o]', words: ['chapeau', 'gâteau', 'bateau', 'rideau', 'cadeau', 'château'] },
  { sound: '[on]', words: ['ballon', 'camion', 'mouton', 'citron', 'savon', 'bonbon'] },
  { sound: '[in]', words: ['lapin', 'sapin', 'requin', 'jardin', 'matin', 'dessin'] },
  {
    sound: '[ette]',
    words: ['fourchette', 'assiette', 'chaussette', 'raquette', 'trompette', 'casquette'],
  },
  { sound: '[i]', words: ['souris', 'riz', 'fourmi', 'tapis', 'radis', 'abri'] },
  { sound: '[eur]', words: ['fleur', 'cœur', 'docteur', 'facteur', 'ordinateur', 'tracteur'] },
  { sound: '[al]', words: ['cheval', 'journal', 'animal', 'hôpital', 'bocal', 'régal'] },
  { sound: '[ine]', words: ['cuisine', 'machine', 'racine', 'usine', 'copine', 'vitrine'] },
]
