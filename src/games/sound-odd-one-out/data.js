/**
 * Phonological material: families of words sharing an onset (initial sound)
 * or a rhyme (final sound). Concrete, frequent vocabulary, suited to
 * school-age children.
 */

export const ONSETS = [
  { sound: '[b]', words: ['ballon', 'bateau', 'banane', 'bouche', 'bougie', 'biberon', 'balai', 'banc', 'bulle'] },
  { sound: '[ch]', words: ['chat', 'chapeau', 'cheval', 'chaise', 'chocolat', 'chien', 'chemise', 'château', 'chouette'] },
  { sound: '[f]', words: ['fusée', 'feuille', 'fourchette', 'fromage', 'fenêtre', 'fleur', 'farine', 'fantôme', 'forêt'] },
  { sound: '[l]', words: ['lapin', 'lune', 'livre', 'lion', 'lampe', 'lit', 'loup', 'légume', 'limace'] },
  { sound: '[m]', words: ['maison', 'moto', 'montagne', 'mouton', 'main', 'miel', 'manteau', 'morceau', 'muguet'] },
  { sound: '[p]', words: ['papillon', 'poisson', 'pomme', 'porte', 'poule', 'panier', 'parapluie', 'pinceau', 'poussin'] },
  { sound: '[r]', words: ['robot', 'radis', 'rideau', 'renard', 'route', 'riz', 'raisin', 'ruban', 'rocher'] },
  { sound: '[s]', words: ['soleil', 'souris', 'sac', 'savon', 'salade', 'serpent', 'sifflet', 'sapin', 'singe'] },
  { sound: '[t]', words: ['table', 'tortue', 'tomate', 'train', 'tapis', 'téléphone', 'tigre', 'tambour', 'timbre'] },
  { sound: '[v]', words: ['vache', 'vélo', 'voiture', 'valise', 'ville', 'verre', 'veste', 'volet', 'violon'] },
  { sound: '[k]', words: ['canard', 'cadeau', 'camion', 'carotte', 'cube', 'cahier', 'cochon', 'cadenas', 'coussin'] },
  { sound: '[j]', words: ['jardin', 'jupe', 'journal', 'jouet', 'jambe', 'jaune', 'jumelles', 'jonquille', 'jeton'] },
  { sound: '[d]', words: ['dauphin', 'domino', 'doigt', 'dinosaure', 'dent', 'douche', 'dragon', 'disque', 'dessin'] },
  { sound: '[g]', words: ['gâteau', 'gomme', 'garage', 'guitare', 'gorille', 'gant', 'goûter', 'guépard', 'galet'] },
]

export const RHYMES = [
  { sound: '[o]', words: ['chapeau', 'gâteau', 'bateau', 'rideau', 'cadeau', 'château', 'bureau', 'chameau', 'oiseau'] },
  { sound: '[on]', words: ['ballon', 'camion', 'mouton', 'citron', 'savon', 'bonbon', 'dragon', 'poisson', 'avion'] },
  { sound: '[in]', words: ['lapin', 'sapin', 'requin', 'jardin', 'matin', 'dessin', 'magasin', 'moulin', 'coussin'] },
  {
    sound: '[ette]',
    words: [
      'fourchette', 'assiette', 'chaussette', 'raquette', 'trompette', 'casquette',
      'bicyclette', 'brouette', 'allumette',
    ],
  },
  { sound: '[i]', words: ['souris', 'riz', 'fourmi', 'tapis', 'radis', 'abri', 'lit', 'nid', 'épi'] },
  { sound: '[eur]', words: ['fleur', 'cœur', 'docteur', 'facteur', 'ordinateur', 'tracteur', 'chanteur', 'aspirateur', 'moteur'] },
  { sound: '[al]', words: ['cheval', 'journal', 'animal', 'hôpital', 'bocal', 'régal', 'signal', 'canal', 'carnaval'] },
  { sound: '[ine]', words: ['cuisine', 'machine', 'racine', 'usine', 'copine', 'vitrine', 'piscine', 'farine', 'bobine'] },
]
