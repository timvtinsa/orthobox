/**
 * The texts of « Les terminaisons ».
 *
 * A text is a few short sentences. A word whose ending is to be chosen is
 * written `{stem|ending|why}`: the part that is always the same, the right
 * ending (empty for « nothing to add »), and the reason, shown when the
 * answer is wrong. `options` are the endings offered in the drop-down, the
 * same for every gap of the text, so that the right one cannot be found by
 * elimination.
 *
 * Three topics, six texts each: the infinitive, the past participle and the
 * « vous » form (-er, -é, -ez); the imperfect and the present of the third
 * person (-ait, -aient, -ent); the gender and number of adjectives and nouns.
 */

export const TOPICS = ['infinitive', 'tenses', 'agreement']

const INFINITIVE = ['er', 'é', 'ez']
const TENSES = ['ait', 'aient', 'ent']
const GENDER = ['', 'e', 's', 'es']
const PLURAL = ['', 's', 'x']

const inf = 'Après « {w} », un verbe à l’infinitif : on peut dire « vendre ».'
const pp = 'Après « {w} », un participe passé : on peut dire « vendu ».'

function infinitive(word) {
  return inf.replace('{w}', word)
}

function participle(word) {
  return pp.replace('{w}', word)
}

export const TEXTS = [
  {
    topic: 'infinitive',
    options: INFINITIVE,
    text: `Le matin, Léo aime {march|er|${infinitive('aime')}} jusqu’à l’école. Hier, il a {march|é|${participle('a')}} très vite. Et vous, vous {march|ez|Avec « vous », on écrit -ez.} aussi vite ?`,
  },
  {
    topic: 'infinitive',
    options: INFINITIVE,
    text: `Maman va {prépar|er|${infinitive('va')}} le repas. Elle a déjà {coup|é|${participle('a')}} les légumes. Voulez-vous nous {aid|er|${infinitive('voulez-vous nous')}} ?`,
  },
  {
    topic: 'infinitive',
    options: INFINITIVE,
    text: `Nous allons {jou|er|${infinitive('allons')}} dans le jardin. Les enfants ont {jou|é|${participle('ont')}} toute la journée. Vous {jou|ez|Avec « vous », on écrit -ez.} bien !`,
  },
  {
    topic: 'infinitive',
    options: INFINITIVE,
    text: `Il faut {ferm|er|${infinitive('il faut')}} la porte. Qui a {ferm|é|${participle('a')}} la fenêtre ? Vous {ferm|ez|Avec « vous », on écrit -ez.} toujours trop fort !`,
  },
  {
    topic: 'infinitive',
    options: INFINITIVE,
    text: `Papa veut {répar|er|${infinitive('veut')}} le vélo. Hier, il l’a {lav|é|${participle('a')}} dans la cour. Vous pouvez l’{aid|er|${infinitive('pouvez')}}.`,
  },
  {
    topic: 'infinitive',
    options: INFINITIVE,
    text: `Pour {chant|er|${infinitive('pour')}} devant tout le monde, Zoé a {répét|é|${participle('a')}} sa chanson. Vous {chant|ez|Avec « vous », on écrit -ez.} avec elle ?`,
  },

  {
    topic: 'tenses',
    options: TENSES,
    text: 'Autrefois, les enfants {jou|aient|Le sujet « les enfants » est au pluriel et la phrase est au passé : on écrit -aient.} dans la cour. Le chat {dorm|ait|Le sujet « le chat » est au singulier et la phrase est au passé : on écrit -ait.} sur le canapé. Maintenant, les oiseaux {chant|ent|Le sujet « les oiseaux » est au pluriel et la phrase est au présent : on écrit -ent.} dans le jardin.',
  },
  {
    topic: 'tenses',
    options: TENSES,
    text: 'Hier, mon frère {march|ait|« Hier » : le passé. Le sujet « mon frère » est au singulier : on écrit -ait.} sous la pluie. Les voisins {parl|aient|Le passé, avec un sujet au pluriel : on écrit -aient.} fort. Aujourd’hui, ils {parl|ent|Le présent, avec un sujet au pluriel : on écrit -ent.} moins.',
  },
  {
    topic: 'tenses',
    options: TENSES,
    text: 'Quand j’étais petit, ma sœur {chant|ait|« Quand j’étais petit » : le passé. Le sujet « ma sœur » est au singulier : on écrit -ait.} tout le temps. Mes parents l’{écout|aient|Le passé, avec un sujet au pluriel : on écrit -aient.}. Maintenant, mes amis la {félicit|ent|Le présent, avec un sujet au pluriel : on écrit -ent.}.',
  },
  {
    topic: 'tenses',
    options: TENSES,
    text: 'Autrefois, le facteur {pass|ait|« Autrefois » : le passé. Le sujet « le facteur » est au singulier : on écrit -ait.} chaque matin. Les enfants le {regard|aient|Le passé, avec un sujet au pluriel : on écrit -aient.}. Aujourd’hui, les voitures {pass|ent|Le présent, avec un sujet au pluriel : on écrit -ent.} sans s’arrêter.',
  },
  {
    topic: 'tenses',
    options: TENSES,
    text: 'Hier, la maîtresse {racont|ait|« Hier » : le passé. Le sujet « la maîtresse » est au singulier : on écrit -ait.} une histoire. Les élèves {rêv|aient|Le passé, avec un sujet au pluriel : on écrit -aient.}. Aujourd’hui, ils {dessin|ent|Le présent, avec un sujet au pluriel : on écrit -ent.} la fin.',
  },
  {
    topic: 'tenses',
    options: TENSES,
    text: 'Autrefois, mon grand-père {pêch|ait|« Autrefois » : le passé. Le sujet « mon grand-père » est au singulier : on écrit -ait.} dans la rivière. Mes oncles {pêch|aient|Le passé, avec un sujet au pluriel : on écrit -aient.} avec lui. Aujourd’hui, ils {pêch|ent|Le présent, avec un sujet au pluriel : on écrit -ent.} encore le dimanche.',
  },

  {
    topic: 'agreement',
    options: GENDER,
    text: 'Léa a une {petit|e|« sœur » est féminin singulier : on ajoute -e.} sœur et un {petit||« frère » est masculin singulier : on n’ajoute rien.} frère. Elle porte des chaussettes {vert|es|« chaussettes » est féminin pluriel : on ajoute -es.}.',
  },
  {
    topic: 'agreement',
    options: GENDER,
    text: 'Dans la cour, il y a une {grand|e|« balançoire » est féminin singulier : on ajoute -e.} balançoire et deux {grand|s|« toboggans » est masculin pluriel : on ajoute -s.} toboggans. Les {petit|s|« enfants » est masculin pluriel : on ajoute -s.} enfants jouent.',
  },
  {
    topic: 'agreement',
    options: GENDER,
    text: 'Mon ami Paul est {content||Paul est masculin singulier : on n’ajoute rien.}. Mon amie Lina est {content|e|Lina est féminin singulier : on ajoute -e.}. Mes deux amies sont {content|es|« amies » est féminin pluriel : on ajoute -es.} de se revoir.',
  },
  {
    topic: 'agreement',
    options: GENDER,
    text: 'J’ai acheté une {joli|e|« robe » est féminin singulier : on ajoute -e.} robe, un {joli||« pull » est masculin singulier : on n’ajoute rien.} pull et de {joli|s|« gants » est masculin pluriel : on ajoute -s.} gants.',
  },
  {
    topic: 'agreement',
    options: PLURAL,
    text: 'Dans le jardin, les {oiseau|x|Les noms en -eau prennent un -x au pluriel.} chantent. Les {chat|s|La plupart des noms prennent un -s au pluriel.} dorment sous les {chou|x|Exception : chou, bijou, genou, caillou, hibou et joujou prennent un -x au pluriel.}.',
  },
  {
    topic: 'agreement',
    options: PLURAL,
    text: 'Mes {cadeau|x|Les noms en -eau prennent un -x au pluriel.} sont dans des {boîte|s|La plupart des noms prennent un -s au pluriel.} avec de beaux {ruban|s|La plupart des noms prennent un -s au pluriel.}.',
  },
]

export const TOPIC_COUNTS = Object.fromEntries(
  TOPICS.map((topic) => [topic, TEXTS.filter((entry) => entry.topic === topic).length]),
)
