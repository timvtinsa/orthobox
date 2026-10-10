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
 * Eight topics. Spelling of inflectional endings: the infinitive, the past
 * participle and the « vous » form (-er, -é, -ez); the imperfect and the
 * present of the third person (-ait, -aient, -ent); the gender and number of
 * adjectives and nouns. Conjugation: the present and the future or
 * conditional, then avoir or être and the agreement of the participle.
 * Pronouns: subject (il, elle, ils, elles) and object (le, la, les, lui,
 * leur). Derivation, which makes new words: prefixes and suffixes. Inflection:
 * the forms a word takes (chevaux, actrice, êtes, pris).
 *
 * A gap with an empty stem offers whole words (a pronoun, an irregular form).
 * A prefix gap is written `{^stem|prefix|why}`: the list comes before the stem.
 */

export const TOPICS = [
  'infinitive',
  'tenses',
  'agreement',
  'conjugation',
  'perfect',
  'pronouns',
  'derivation',
  'inflection',
]

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

const SPELLING_TEXTS = [
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


// --- Conjugation: present, then future and conditional -----------------------

const PRESENT = ['e', 'es', 'ons', 'ez', 'ent']
const FUTURE = ['ra', 'rait', 'ront', 'raient']

const CONJUGATION_TEXTS = [
  {
    topic: 'conjugation',
    options: PRESENT,
    text: 'Je {chant|e|Avec « je », le verbe du premier groupe se termine par -e.} dans la chorale. Tu {chant|es|Avec « tu », on écrit -es.} aussi. Nous {chant|ons|Avec « nous », on écrit -ons.} ensemble.',
  },
  {
    topic: 'conjugation',
    options: PRESENT,
    text: 'Elle {march|e|Avec « elle », on écrit -e.} vers l’école. Vous {march|ez|Avec « vous », on écrit -ez.} plus vite. Ils {march|ent|Avec « ils », on écrit -ent.} lentement.',
  },
  {
    topic: 'conjugation',
    options: PRESENT,
    text: 'Tu {dessin|es|Avec « tu », on écrit -es.} un bateau. Nous {dessin|ons|Avec « nous », on écrit -ons.} une maison. Les enfants {dessin|ent|Le sujet « les enfants » est au pluriel : on écrit -ent.} des fleurs.',
  },
  {
    topic: 'conjugation',
    options: PRESENT,
    text: 'Je {mang|e|Avec « je », on écrit -e.} une pomme. Nous {mange|ons|Avec « nous », on écrit -ons, et le verbe garde son e : mangeons.} du pain. Vous {mang|ez|Avec « vous », on écrit -ez.} trop vite.',
  },
  {
    topic: 'conjugation',
    options: FUTURE,
    text: 'Demain, Léo {joue|ra|« Demain » : le futur. Le sujet « Léo » est au singulier : on écrit -ra.} avec nous. S’il faisait beau, il {joue|rait|« S’il faisait beau » : le conditionnel. Le sujet est au singulier : on écrit -rait.} dehors. Ses amis {joue|ront|Le futur, avec un sujet au pluriel : on écrit -ront.} aussi.',
  },
  {
    topic: 'conjugation',
    options: FUTURE,
    text: 'Demain, ma sœur {parle|ra|« Demain » : le futur. Le sujet est au singulier : on écrit -ra.} français. Si elle avait le temps, elle {parle|rait|« Si elle avait le temps » : le conditionnel. Le sujet est au singulier : on écrit -rait.} avec nous. Plus tard, mes frères le {parle|ront|Le futur, avec un sujet au pluriel : on écrit -ront.} aussi.',
  },
  {
    topic: 'conjugation',
    options: FUTURE,
    text: 'Bientôt, les oiseaux {chante|ront|« Bientôt » : le futur. Le sujet est au pluriel : on écrit -ront.} au jardin. S’ils avaient moins froid, ils {chante|raient|« S’ils avaient moins froid » : le conditionnel. Le sujet est au pluriel : on écrit -raient.} déjà. Demain, le coq {chante|ra|« Demain » : le futur. Le sujet est au singulier : on écrit -ra.} très tôt.',
  },
  {
    topic: 'conjugation',
    options: FUTURE,
    text: 'Demain, la classe {visite|ra|« Demain » : le futur. Le sujet est au singulier : on écrit -ra.} le musée. Si les élèves étaient sages, ils le {visite|raient|« Si les élèves étaient sages » : le conditionnel. Le sujet est au pluriel : on écrit -raient.} deux fois. Plus tard, mes cousins le {visite|ront|Le futur, avec un sujet au pluriel : on écrit -ront.} aussi.',
  },
]

// --- Passé composé: avoir or être, then the agreement of the participle ------

const AUXILIARIES = ['a', 'ont', 'est', 'sont']

const PERFECT_TEXTS = [
  {
    topic: 'perfect',
    options: AUXILIARIES,
    text: 'Hier, Léo {|a|« Manger » se conjugue avec avoir, sujet au singulier : il a mangé.} mangé une pomme. Ses sœurs {|sont|« Partir » se conjugue avec être, sujet au pluriel : elles sont parties.} parties tôt. Le chat {|est|« Tomber » se conjugue avec être, sujet au singulier : il est tombé.} tombé du mur.',
  },
  {
    topic: 'perfect',
    options: AUXILIARIES,
    text: 'Les enfants {|ont|« Chanter » se conjugue avec avoir, sujet au pluriel : ils ont chanté.} chanté. Maman {|est|« Arriver » se conjugue avec être, sujet au singulier : elle est arrivée.} arrivée en retard. Mes cousins {|sont|« Venir » se conjugue avec être, sujet au pluriel : ils sont venus.} venus hier.',
  },
  {
    topic: 'perfect',
    options: AUXILIARIES,
    text: 'Paul {|a|« Finir » se conjugue avec avoir, sujet au singulier : il a fini.} fini ses devoirs. Ses amies {|sont|« Rentrer » se conjugue avec être, sujet au pluriel : elles sont rentrées.} rentrées. Elles {|ont|« Manger » se conjugue avec avoir, sujet au pluriel : elles ont mangé.} mangé ensemble.',
  },
  {
    topic: 'perfect',
    options: AUXILIARIES,
    text: 'Ma grand-mère {|est|« Sortir » (aller dehors) se conjugue avec être, sujet au singulier : elle est sortie.} sortie ce matin. Mes parents {|ont|« Acheter » se conjugue avec avoir, sujet au pluriel : ils ont acheté.} acheté du pain. Le bébé {|a|« Dormir » se conjugue avec avoir, sujet au singulier : il a dormi.} dormi longtemps.',
  },
  {
    topic: 'perfect',
    options: GENDER,
    text: 'Léo est {parti||« Léo » est masculin singulier : avec être, on n’ajoute rien.}. Sa sœur est {parti|e|« Sœur » est féminin singulier : avec être, on ajoute -e.}. Leurs parents sont {parti|s|« Parents » est masculin pluriel : avec être, on ajoute -s.} aussi.',
  },
  {
    topic: 'perfect',
    options: GENDER,
    text: 'Mon frère est {arrivé||« Frère » est masculin singulier : avec être, on n’ajoute rien.}. Ma cousine est {arrivé|e|« Cousine » est féminin singulier : avec être, on ajoute -e.}. Mes voisines sont {arrivé|es|« Voisines » est féminin pluriel : avec être, on ajoute -es.} aussi.',
  },
  {
    topic: 'perfect',
    options: GENDER,
    text: 'Les poules sont {sorti|es|« Poules » est féminin pluriel : avec être, on ajoute -es.} du poulailler. Le coq est {sorti||« Coq » est masculin singulier : avec être, on n’ajoute rien.}. La vache est {sorti|e|« Vache » est féminin singulier : avec être, on ajoute -e.} aussi.',
  },
  {
    topic: 'perfect',
    options: GENDER,
    text: 'Les garçons sont {rentré|s|« Garçons » est masculin pluriel : avec être, on ajoute -s.}. Lina est {rentré|e|« Lina » est féminin singulier : avec être, on ajoute -e.}. Son père est {rentré||« Père » est masculin singulier : avec être, on n’ajoute rien.} tard.',
  },
]

// --- Pronouns: subject, then object ------------------------------------------

const SUBJECT = ['il', 'elle', 'ils', 'elles']
const OBJECT = ['le', 'la', 'les', 'lui', 'leur']

const PRONOUN_TEXTS = [
  {
    topic: 'pronouns',
    options: SUBJECT,
    text: 'Marie et Léa sont fatiguées parce qu’{|elles|« Marie et Léa » : plusieurs filles, donc « elles ».} ont couru. Paul est content : {|il|« Paul » : un garçon, donc « il ».} a gagné. Les chiens aboient : {|ils|« Les chiens » : plusieurs animaux, donc « ils ».} ont faim.',
  },
  {
    topic: 'pronouns',
    options: SUBJECT,
    text: 'Ma sœur dort parce qu’{|elle|« Ma sœur » : une fille, donc « elle ».} est fatiguée. Mes frères jouent car {|ils|« Mes frères » : plusieurs garçons, donc « ils ».} s’amusent. Les voisines chantent et {|elles|« Les voisines » : plusieurs filles, donc « elles ».} rient.',
  },
  {
    topic: 'pronouns',
    options: SUBJECT,
    text: 'Léo et Paul mangent ; {|ils|« Léo et Paul » : deux garçons, donc « ils ».} ont faim. Léa et sa mère rient : {|elles|« Léa et sa mère » : deux femmes, donc « elles ».} sont heureuses. Le chat saute et {|il|« Le chat » : un seul animal, donc « il ».} attrape la souris.',
  },
  {
    topic: 'pronouns',
    options: SUBJECT,
    text: 'Paul et Léa jouent : {|ils|Un groupe de filles et de garçons : on utilise « ils ».} sont contents. La maîtresse sourit et {|elle|« La maîtresse » : une femme, donc « elle ».} parle. Mes parents arrivent : {|ils|« Mes parents » : un père et une mère, donc « ils ».} ont du pain.',
  },
  {
    topic: 'pronouns',
    options: OBJECT,
    text: 'Paul est là : je {|le|Complément direct, masculin singulier : « je vois Paul », donc « je le vois ».} vois. Je parle à Paul : je {|lui|On dit « parler à Paul » : complément indirect, donc « je lui parle ».} dis bonjour. Mes amis arrivent : je {|les|Complément direct pluriel : « j’appelle mes amis », donc « je les appelle ».} appelle.',
  },
  {
    topic: 'pronouns',
    options: OBJECT,
    text: 'Voici Léa : je {|la|Complément direct, féminin singulier : « je regarde Léa », donc « je la regarde ».} regarde. J’écris à Léa : je {|lui|On dit « écrire à Léa » : complément indirect, donc « je lui envoie ».} envoie une carte. Mes cousins arrivent : je {|leur|On dit « parler à mes cousins » : complément indirect pluriel, donc « je leur parle ».} parle.',
  },
  {
    topic: 'pronouns',
    options: OBJECT,
    text: 'Mes parents sont gentils : je {|les|Complément direct pluriel : « j’aime mes parents », donc « je les aime ».} aime. Je {|leur|On dit « dire merci à mes parents » : complément indirect pluriel, donc « je leur dis ».} dis merci. Ma tante est malade : je {|la|Complément direct, féminin singulier : « je soigne ma tante », donc « je la soigne ».} soigne.',
  },
  {
    topic: 'pronouns',
    options: OBJECT,
    text: 'Le livre est beau : je {|le|Complément direct, masculin singulier : « je lis le livre », donc « je le lis ».} lis. La page est déchirée : je {|la|Complément direct, féminin singulier : « je recolle la page », donc « je la recolle ».} recolle. Les images sont jolies : je {|les|Complément direct pluriel : « je regarde les images », donc « je les regarde ».} regarde.',
  },
]

// --- Derivation: prefixes, then suffixes. A prefix gap is written `{^stem|prefix|why}` ---

const PREFIXES = ['in', 'im', 'dé', 're']
const PREFIXES_MAL = ['in', 'im', 'dé', 're', 'mal']
const SUFFIXES = ['eur', 'euse', 'ier', 'able', 'tion']
const SUFFIXES_ISTE = ['eur', 'euse', 'iste', 'able', 'tion']

const DERIVATION_TEXTS = [
  {
    topic: 'derivation',
    options: PREFIXES,
    text: 'Ce n’est pas utile : c’est {^utile|in|Le préfixe in- exprime le contraire : inutile.}. Ce n’est pas possible : c’est {^possible|im|Devant p, le préfixe in- devient im- : impossible.}. Quand on ferme de nouveau la porte, on la {^ferme|re|Le préfixe re- exprime la répétition : referme.}.',
  },
  {
    topic: 'derivation',
    options: PREFIXES,
    text: 'Le contraire de coller, c’est {^coller|dé|Le préfixe dé- exprime le contraire de l’action : décoller.}. Ce qu’on ne voit pas est {^visible|in|Le préfixe in- exprime le contraire : invisible.}. Ce qu’on ne peut pas battre est {^battable|im|Devant b, le préfixe in- devient im- : imbattable.}.',
  },
  {
    topic: 'derivation',
    options: PREFIXES_MAL,
    text: 'Le contraire d’heureux est {^heureux|mal|Le préfixe mal- exprime le contraire : malheureux.}. On peut {^lire|re|Le préfixe re- exprime la répétition : relire.} un livre déjà lu. Ce qui n’est pas juste est {^juste|in|Le préfixe in- exprime le contraire : injuste.}.',
  },
  {
    topic: 'derivation',
    options: PREFIXES,
    text: 'Ce qui ne se mange pas est {^mangeable|im|Devant m, le préfixe in- devient im- : immangeable.}. Le contraire de plier, c’est {^plier|dé|Le préfixe dé- exprime le contraire de l’action : déplier.}. Faire une deuxième fois, c’est {^faire|re|Le préfixe re- exprime la répétition : refaire.}.',
  },
  {
    topic: 'derivation',
    options: SUFFIXES,
    text: 'Celui qui chante est un {chant|eur|Le suffixe -eur désigne celui qui fait l’action : chanteur.}. Celle qui danse est une {dans|euse|Au féminin, -eur devient -euse : danseuse.}. Celui qui vend du lait est un {lait|ier|Le suffixe -ier désigne souvent un métier : laitier.}.',
  },
  {
    topic: 'derivation',
    options: SUFFIXES,
    text: 'L’action de construire est une {construc|tion|Le suffixe -tion désigne une action ou son résultat : construction.}. Celui qui joue au football est un {jou|eur|Le suffixe -eur désigne celui qui fait l’action : joueur.}. Une table qu’on peut plier est {pli|able|Le suffixe -able signifie « qui peut être… » : pliable.}.',
  },
  {
    topic: 'derivation',
    options: SUFFIXES,
    text: 'Celui qui cuisine est un {cuisin|ier|Le suffixe -ier désigne souvent un métier : cuisinier.}. Celui qui nage est un {nag|eur|Le suffixe -eur désigne celui qui fait l’action : nageur.}. Une personne à qui on peut se fier est {fi|able|Le suffixe -able signifie « qui peut être… » : fiable.}.',
  },
  {
    topic: 'derivation',
    options: SUFFIXES_ISTE,
    text: 'Celle qui chante est une {chant|euse|Au féminin, -eur devient -euse : chanteuse.}. Celui qui vend des fleurs est un {fleur|iste|Le suffixe -iste désigne souvent un métier : fleuriste.}. L’action de décorer est la {décora|tion|Le suffixe -tion désigne une action ou son résultat : décoration.}.',
  },
]

// --- Inflection: the form a word takes. The list offers whole words ---------

const INFLECTION_TEXTS = [
  {
    topic: 'inflection',
    options: ['chevals', 'chevaux', 'animals', 'animaux', 'journals', 'journaux'],
    text: 'Dans le pré, il y a un cheval, puis deux {|chevaux|Le pluriel de « cheval » est « chevaux » : les noms en -al font -aux.}. Il y a un animal, puis trois {|animaux|Le pluriel d’« animal » est « animaux » : les noms en -al font -aux.}. Il y a un journal, puis des {|journaux|Le pluriel de « journal » est « journaux » : les noms en -al font -aux.}.',
  },
  {
    topic: 'inflection',
    options: ['acteure', 'actrice', 'vieille', 'vieule', 'gentille', 'gentile'],
    text: 'Un acteur, une {|actrice|Le féminin d’« acteur » est « actrice ».}. Un vieux monsieur, une {|vieille|Le féminin de « vieux » est « vieille ».} dame. Un gentil garçon, une {|gentille|Le féminin de « gentil » est « gentille » : on double le l.} fille.',
  },
  {
    topic: 'inflection',
    options: ['êtes', 'étes', 'sont', 'sons', 'faites', 'faisez'],
    text: 'Je suis, tu es, il est, nous sommes, vous {|êtes|Avec « vous », le verbe « être » fait « vous êtes ».}, ils {|sont|Avec « ils », le verbe « être » fait « ils sont ».}. Je fais, nous faisons, vous {|faites|Avec « vous », le verbe « faire » fait « vous faites ».}.',
  },
  {
    topic: 'inflection',
    options: ['avez', 'avons', 'ont', 'ons', 'vont', 'vons'],
    text: 'J’ai, tu as, il a, nous avons, vous {|avez|Avec « vous », le verbe « avoir » fait « vous avez ».}, ils {|ont|Avec « ils », le verbe « avoir » fait « ils ont ».}. Je vais, nous allons, ils {|vont|Avec « ils », le verbe « aller » fait « ils vont ».}.',
  },
  {
    topic: 'inflection',
    options: ['pris', 'prendu', 'vu', 'voyé', 'fait', 'faisé'],
    text: 'Aujourd’hui je prends, hier j’ai {|pris|Le participe passé de « prendre » est « pris ».}. Aujourd’hui je vois, hier j’ai {|vu|Le participe passé de « voir » est « vu ».}. Aujourd’hui je fais, hier j’ai {|fait|Le participe passé de « faire » est « fait ».}.',
  },
  {
    topic: 'inflection',
    options: ['meilleur', 'plus bon', 'mieux', 'plus bien', 'pire', 'plus pire'],
    text: 'Ce gâteau est bon, mais celui-là est {|meilleur|Le comparatif de « bon » est « meilleur », et non « plus bon ».}. Léo chante bien, Zoé chante {|mieux|Le comparatif de « bien » est « mieux », et non « plus bien ».}. Ce jeu est mauvais, l’autre est {|pire|Le comparatif de « mauvais » est « pire », et non « plus pire ».}.',
  },
]

export const TEXTS = [
  ...SPELLING_TEXTS,
  ...CONJUGATION_TEXTS,
  ...PERFECT_TEXTS,
  ...PRONOUN_TEXTS,
  ...DERIVATION_TEXTS,
  ...INFLECTION_TEXTS,
]

export const TOPIC_COUNTS = Object.fromEntries(
  TOPICS.map((topic) => [topic, TEXTS.filter((entry) => entry.topic === topic).length]),
)
