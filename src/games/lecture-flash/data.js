/**
 * Mots cibles et leurres orthographiquement proches : inversions de lettres,
 * confusions visuelles (b/d, p/q, m/n) et lettres ajoutées ou manquantes.
 * Les leurres sont écrits à la main pour rester crédibles.
 */
export const MOTS_COURTS = [
  { mot: 'bain', leurres: ['dain', 'bian', 'brin'] },
  { mot: 'pont', leurres: ['pomt', 'ponc', 'plont'] },
  { mot: 'dent', leurres: ['bent', 'dnet', 'dant'] },
  { mot: 'chat', leurres: ['chad', 'cath', 'chait'] },
  { mot: 'pluie', leurres: ['pulie', 'pliue', 'bluie'] },
  { mot: 'train', leurres: ['tarin', 'trian', 'drain'] },
  { mot: 'ferme', leurres: ['frem', 'fenne', 'ferne'] },
  { mot: 'porte', leurres: ['prote', 'porde', 'potre'] },
  { mot: 'brique', leurres: ['birque', 'briqe', 'drique'] },
  { mot: 'monde', leurres: ['mnode', 'monbe', 'nonde'] },
]

export const MOTS_LONGS = [
  { mot: 'lapin', leurres: ['lipan', 'lapun', 'labin'] },
  { mot: 'tablier', leurres: ['tablire', 'talbier', 'tabiler'] },
  { mot: 'chameau', leurres: ['chameu', 'chamaeu', 'chameua'] },
  { mot: 'fenêtre', leurres: ['fentêre', 'fenêrte', 'fnêetre'] },
  { mot: 'escalier', leurres: ['escalire', 'escaiier', 'esclaier'] },
  { mot: 'pantalon', leurres: ['pantolan', 'pantalom', 'pantlaon'] },
  { mot: 'bouteille', leurres: ['boutielle', 'bouteile', 'doutéille'] },
  { mot: 'crocodile', leurres: ['crocodlie', 'crocidole', 'crocodible'] },
  { mot: 'printemps', leurres: ['pritemps', 'prinstemp', 'printemsp'] },
  { mot: 'dictionnaire', leurres: ['dictionaire', 'dicitonnaire', 'distionnaire'] },
]
