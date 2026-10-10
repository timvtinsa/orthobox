/**
 * Phonological material: families of words sharing an onset (initial sound)
 * or a rhyme (final sound). Concrete, frequent vocabulary, suited to
 * school-age children.
 */

export const ONSETS = [
  { sound: '[b]', words: ['ballon', 'bateau', 'banane', 'bouche', 'bougie', 'biberon', 'balai', 'banc', 'bulle', 'bébé', 'balle', 'botte'] },
  { sound: '[ch]', words: ['chat', 'chapeau', 'cheval', 'chaise', 'chocolat', 'chien', 'chemise', 'château', 'chouette', 'cheminée', 'champignon', 'chaussure'] },
  { sound: '[f]', words: ['fusée', 'feuille', 'fourchette', 'fromage', 'fenêtre', 'fleur', 'farine', 'fantôme', 'forêt', 'fil', 'fée'] },
  { sound: '[l]', words: ['lapin', 'lune', 'livre', 'lion', 'lampe', 'lit', 'loup', 'légume', 'limace', 'lait', 'lunettes', 'lézard'] },
  { sound: '[m]', words: ['maison', 'moto', 'montagne', 'mouton', 'main', 'miel', 'manteau', 'morceau', 'muguet', 'mer', 'mouche', 'melon'] },
  { sound: '[p]', words: ['papillon', 'poisson', 'pomme', 'porte', 'poule', 'panier', 'parapluie', 'pinceau', 'poussin', 'pain', 'peigne', 'pied'] },
  { sound: '[r]', words: ['robot', 'radis', 'rideau', 'renard', 'route', 'riz', 'raisin', 'ruban', 'rocher', 'rose', 'roue', 'rat'] },
  { sound: '[s]', words: ['soleil', 'souris', 'sac', 'savon', 'salade', 'serpent', 'sifflet', 'sapin', 'singe', 'sel', 'sirop', 'sucre'] },
  { sound: '[t]', words: ['table', 'tortue', 'tomate', 'train', 'tapis', 'téléphone', 'tigre', 'tambour', 'timbre', 'tasse', 'toit', 'tableau'] },
  { sound: '[v]', words: ['vache', 'vélo', 'voiture', 'valise', 'ville', 'verre', 'veste', 'volet', 'violon', 'vent', 'vase', 'vis'] },
  { sound: '[k]', words: ['canard', 'cadeau', 'camion', 'carotte', 'cube', 'cahier', 'cochon', 'cadenas', 'coussin', 'canne', 'cuillère', 'couteau'] },
  { sound: '[j]', words: ['jardin', 'jupe', 'journal', 'jouet', 'jambe', 'jaune', 'jumelles', 'jonquille', 'jeton', 'jus', 'jeu', 'jarre'] },
  { sound: '[d]', words: ['dauphin', 'domino', 'doigt', 'dinosaure', 'dent', 'douche', 'dragon', 'disque', 'dessin', 'dé', 'dame', 'dos'] },
  { sound: '[g]', words: ['gâteau', 'gomme', 'garage', 'guitare', 'gorille', 'gant', 'goûter', 'guépard', 'galet', 'gare', 'garçon', 'gorge'] },
  { sound: '[n]', words: ['nuage', 'nez', 'noix', 'nid', 'navire', 'nuit', 'nappe', 'noir', 'neige'] },
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
  { sound: '[ou]', words: ['chou', 'genou', 'hibou', 'caillou', 'bijou', 'clou', 'trou', 'joujou', 'verrou'] },
  { sound: '[é]', words: ['été', 'café', 'clé', 'bébé', 'épée', 'fée', 'pré', 'blé', 'nez'] },
  { sound: '[oir]', words: ['miroir', 'tiroir', 'soir', 'arrosoir', 'couloir', 'espoir', 'trottoir', 'rasoir', 'peignoir'] },
  { sound: '[age]', words: ['nuage', 'image', 'village', 'fromage', 'voyage', 'plage', 'visage', 'orage', 'garage'] },
  { sound: '[ard]', words: ['renard', 'canard', 'brouillard', 'léopard', 'hasard', 'retard', 'lézard', 'regard', 'vieillard'] },
  { sound: '[ille]', words: ['bille', 'famille', 'fille', 'coquille', 'chenille', 'aiguille', 'quille', 'vanille', 'cheville'] },
]
