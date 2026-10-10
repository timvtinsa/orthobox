/**
 * Words sorted by their number of spoken syllables.
 *
 * Spoken syllables, not written ones: a silent final « e » does not count, so
 * « girafe » is two and not three. Words whose cut varies from one region to
 * the next are left out, because the practitioner has to be able to settle the
 * answer without arguing about it.
 */
export const WORDS_BY_SYLLABLES = {
  1: [
    'chat', 'pain', 'fleur', 'loup', 'pont', 'sac', 'nid', 'train', 'banc', 'riz', 'pied', 'clé',
    'roi', 'dos', 'bras', 'sol',
    'main', 'mur', 'lait', 'mer', 'ciel', 'bleu', 'feu', 'chou', 'nez', 'dent', 'vent', 'sel', 'œuf', 'bol', 'four', 'lune',
  ],
  2: [
    'lapin', 'maison', 'bateau', 'vélo', 'jardin', 'tapis', 'chapeau', 'girafe',
    'bougie', 'gâteau', 'ballon', 'fromage', 'cheval', 'crayon', 'poisson', 'tambour',
    'oiseau', 'cadeau', 'copain', 'moulin',
    'soleil', 'cuisine', 'valise', 'lunettes', 'tortue', 'citron', 'savon', 'bonbon', 'pinceau', 'écharpe', 'nuage', 'sirop',
  ],
  3: [
    'parapluie', 'téléphone', 'chocolat', 'éléphant', 'papillon', 'crocodile',
    'escargot', 'bicyclette', 'casserole', 'domino', 'hirondelle', 'coquillage',
    'kangourou', 'dinosaure', 'ambulance', 'toboggan', 'thermomètre',
    'animal', 'pyjama', 'spaghetti', 'dentifrice', 'boulanger', 'parachute', 'lavabo', 'couverture', 'cinéma', 'astronaute', 'infirmière',
  ],
  4: [
    'ordinateur', 'hélicoptère', 'aspirateur', 'calculatrice', 'vétérinaire',
    'anniversaire', 'imperméable', 'rhinocéros', 'téléviseur',
    'automobile', 'parachutiste', 'collectionneur', 'télécommande',
    'hippopotame', 'caméléon', 'mathématique', 'ambulancier', 'météorite', 'cérémonie',
  ],
}
