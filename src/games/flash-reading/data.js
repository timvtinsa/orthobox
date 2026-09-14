/**
 * Target words and orthographically close lures: letter inversions, visual
 * confusions (b/d, p/q, m/n) and added or missing letters. The lures are
 * written by hand so they stay believable.
 */
export const SHORT_WORDS = [
  { word: 'bain', distractors: ['dain', 'bian', 'brin'] },
  { word: 'pont', distractors: ['pomt', 'ponc', 'plont'] },
  { word: 'dent', distractors: ['bent', 'dnet', 'dant'] },
  { word: 'chat', distractors: ['chad', 'cath', 'chait'] },
  { word: 'pluie', distractors: ['pulie', 'pliue', 'bluie'] },
  { word: 'train', distractors: ['tarin', 'trian', 'drain'] },
  { word: 'ferme', distractors: ['frem', 'fenne', 'ferne'] },
  { word: 'porte', distractors: ['prote', 'porde', 'potre'] },
  { word: 'brique', distractors: ['birque', 'briqe', 'drique'] },
  { word: 'monde', distractors: ['mnode', 'monbe', 'nonde'] },
]

export const LONG_WORDS = [
  { word: 'lapin', distractors: ['lipan', 'lapun', 'labin'] },
  { word: 'tablier', distractors: ['tablire', 'talbier', 'tabiler'] },
  { word: 'chameau', distractors: ['chameu', 'chamaeu', 'chameua'] },
  { word: 'fenêtre', distractors: ['fentêre', 'fenêrte', 'fnêetre'] },
  { word: 'escalier', distractors: ['escalire', 'escaiier', 'esclaier'] },
  { word: 'pantalon', distractors: ['pantolan', 'pantalom', 'pantlaon'] },
  { word: 'bouteille', distractors: ['boutielle', 'bouteile', 'doutéille'] },
  { word: 'crocodile', distractors: ['crocodlie', 'crocidole', 'crocodible'] },
  { word: 'printemps', distractors: ['pritemps', 'prinstemp', 'printemsp'] },
  { word: 'dictionnaire', distractors: ['dictionaire', 'dicitonnaire', 'distionnaire'] },
]
