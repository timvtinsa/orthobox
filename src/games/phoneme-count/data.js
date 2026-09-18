/**
 * Words sorted by their number of spoken phonemes — sounds, not letters.
 *
 * A silent letter never counts (« loup » is two sounds, not four), a digraph
 * that spells one sound counts once (« ch », « ou », a nasal vowel such as
 * « on » or « in »), and a double letter that spells one sound counts once
 * too (« pomme » is three sounds). Words whose cut is a matter of register —
 * a glided vowel as in « oi », a schwa that some speakers drop and others
 * keep as in « cheval » — are left out entirely, on the same principle as
 * « Combien de syllabes ? »: the practitioner must be able to settle the
 * answer without arguing about it.
 *
 * Counting starts at two: a French word of a single phoneme is almost always
 * a grammatical word (« y », « en »), not the concrete vocabulary the rest of
 * the bank uses.
 */
export const WORDS_BY_PHONEMES = {
  2: [
    'nid', 'riz', 'roue', 'joue', 'loup', 'cou', 'nez', 'pot', 'dos', 'os',
    'or', 'chat', 'pain', 'banc', 'lit', 'main', 'feu', 'jeu',
  ],
  3: [
    'sac', 'train', 'clé', 'pomme', 'sel', 'lac', 'mur', 'ours', 'bus', 'sol', 'mer', 'vase',
  ],
  4: [
    'lapin', 'vélo', 'tapis', 'chapeau', 'bougie', 'gâteau', 'ballon', 'cochon',
    'moulin', 'sapin', 'matin', 'lundi', 'pinceau', 'cadeau', 'bateau', 'manteau',
  ],
  5: [
    'jardin', 'éléphant', 'dragon', 'fantôme', 'montagne', 'tambour', 'serpent',
    'guitare', 'valise', 'banane',
  ],
}
