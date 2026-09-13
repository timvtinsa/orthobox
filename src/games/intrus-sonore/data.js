/**
 * Matériel phonologique : des familles de mots partageant une attaque
 * (son initial) ou une rime (son final). Vocabulaire concret et fréquent,
 * adapté à des enfants d'âge scolaire.
 */

export const ATTAQUES = [
  { son: '[b]', mots: ['ballon', 'bateau', 'banane', 'bouche', 'bougie', 'biberon'] },
  { son: '[ch]', mots: ['chat', 'chapeau', 'cheval', 'chaise', 'chocolat', 'chien'] },
  { son: '[f]', mots: ['fusée', 'feuille', 'fourchette', 'fromage', 'fenêtre', 'fleur'] },
  { son: '[l]', mots: ['lapin', 'lune', 'livre', 'lion', 'lampe', 'lit'] },
  { son: '[m]', mots: ['maison', 'moto', 'montagne', 'mouton', 'main', 'miel'] },
  { son: '[p]', mots: ['papillon', 'poisson', 'pomme', 'porte', 'poule', 'panier'] },
  { son: '[r]', mots: ['robot', 'radis', 'rideau', 'renard', 'route', 'riz'] },
  { son: '[s]', mots: ['soleil', 'souris', 'sac', 'savon', 'salade', 'serpent'] },
  { son: '[t]', mots: ['table', 'tortue', 'tomate', 'train', 'tapis', 'téléphone'] },
  { son: '[v]', mots: ['vache', 'vélo', 'voiture', 'valise', 'ville', 'verre'] },
  { son: '[k]', mots: ['canard', 'cadeau', 'camion', 'carotte', 'cube', 'cahier'] },
  { son: '[j]', mots: ['jardin', 'jupe', 'journal', 'jouet', 'jambe', 'jaune'] },
  { son: '[d]', mots: ['dauphin', 'domino', 'doigt', 'dinosaure', 'dent', 'douche'] },
  { son: '[g]', mots: ['gâteau', 'gomme', 'garage', 'guitare', 'gorille', 'gant'] },
]

export const RIMES = [
  { son: '[o]', mots: ['chapeau', 'gâteau', 'bateau', 'rideau', 'cadeau', 'château'] },
  { son: '[on]', mots: ['ballon', 'camion', 'mouton', 'citron', 'savon', 'bonbon'] },
  { son: '[in]', mots: ['lapin', 'sapin', 'requin', 'jardin', 'matin', 'dessin'] },
  {
    son: '[ette]',
    mots: ['fourchette', 'assiette', 'chaussette', 'raquette', 'trompette', 'casquette'],
  },
  { son: '[i]', mots: ['souris', 'riz', 'fourmi', 'tapis', 'radis', 'abri'] },
  { son: '[eur]', mots: ['fleur', 'cœur', 'docteur', 'facteur', 'ordinateur', 'tracteur'] },
  { son: '[al]', mots: ['cheval', 'journal', 'animal', 'hôpital', 'bocal', 'régal'] },
  { son: '[ine]', mots: ['cuisine', 'machine', 'racine', 'usine', 'copine', 'vitrine'] },
]
