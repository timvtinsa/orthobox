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
  { word: 'lune', distractors: ['lume', 'lnue', 'lunne'] },
  { word: 'jupe', distractors: ['jube', 'jupp', 'jpue'] },
  { word: 'mare', distractors: ['nare', 'mrae', 'marre'] },
  { word: 'vase', distractors: ['vaze', 'vsae', 'vasse'] },
  { word: 'banc', distractors: ['danc', 'bnac', 'banq'] },
  { word: 'lampe', distractors: ['nampe', 'lanpe', 'lampme'] },
  { word: 'bulle', distractors: ['dulle', 'bulla', 'bulel'] },
  { word: 'cloche', distractors: ['closhe', 'colche', 'clohce'] },
  { word: 'tigre', distractors: ['digre', 'tirge', 'tigrre'] },
  { word: 'poule', distractors: ['boule', 'poulle', 'pouel'] },
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
  { word: 'papillon', distractors: ['bapillon', 'papillion', 'papyllon'] },
  { word: 'ordinateur', distractors: ['erdinateur', 'ordinateru', 'ordinnateur'] },
  { word: 'téléphone', distractors: ['délephone', 'télephonne', 'télephnoe'] },
  { word: 'chocolat', distractors: ['chocolot', 'chocolta', 'checolat'] },
  { word: 'montagne', distractors: ['montagme', 'montange', 'motangne'] },
  { word: 'aquarium', distractors: ['aquarum', 'aqarium', 'aquariun'] },
  { word: 'parapluie', distractors: ['parapluue', 'paraplule', 'parapuile'] },
  { word: 'ambulance', distractors: ['anbulance', 'ambulence', 'ambulanse'] },
  { word: 'kangourou', distractors: ['kangorou', 'kangoutou', 'kangourouu'] },
  { word: 'toboggan', distractors: ['tobogan', 'tobbogan', 'toboggam'] },
]
