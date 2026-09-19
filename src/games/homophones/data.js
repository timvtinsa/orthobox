/**
 * Homophone confusions: six pairs that sound identical but are spelled
 * differently and hold a different grammatical role — the core material of
 * French spelling remediation.
 *
 * Each sentence has exactly one correct spelling; the only other option
 * offered is its homophone, never an unrelated word, because the exercise
 * is precisely about choosing between the two, not about vocabulary. The
 * gap never sits at the very start of a sentence, so a capital letter never
 * gives the answer away.
 */
export const HOMOPHONES = {
  'a-à': {
    label: 'a / à',
    words: ['a', 'à'],
    sentences: [
      { before: 'Léa', after: 'un petit chat noir.', answer: 'a' },
      { before: 'Nous allons', after: 'la piscine cet après-midi.', answer: 'à' },
      { before: 'Il', after: 'oublié son sac de sport.', answer: 'a' },
      { before: 'Le facteur arrive toujours', after: 'midi.', answer: 'à' },
      { before: 'Elle', after: 'trois crayons dans sa trousse.', answer: 'a' },
      { before: 'Ils habitent', after: 'Paris depuis un an.', answer: 'à' },
      { before: 'Mon frère', after: 'peur du noir.', answer: 'a' },
      { before: 'Donne ce livre', after: 'ta sœur, s’il te plaît.', answer: 'à' },
      { before: 'Théo', after: 'un vélo rouge tout neuf.', answer: 'a' },
      { before: 'Le chien court', after: 'toute vitesse dans le jardin.', answer: 'à' },
      { before: 'Elle', after: 'terminé son dessin avant midi.', answer: 'a' },
      { before: 'Nous allons', after: 'l’école à pied tous les matins.', answer: 'à' },
      { before: 'Ma cousine', after: 'gagné le premier prix.', answer: 'a' },
    ],
  },
  'et-est': {
    label: 'et / est',
    words: ['et', 'est'],
    sentences: [
      { before: 'Le chat', after: 'le chien jouent ensemble.', answer: 'et' },
      { before: 'Ce gâteau', after: 'vraiment délicieux.', answer: 'est' },
      { before: 'J’aime le pain', after: 'le fromage.', answer: 'et' },
      { before: 'La maison', after: 'trop petite pour toute la famille.', answer: 'est' },
      { before: 'Elle prend son cartable', after: 'son manteau.', answer: 'et' },
      { before: 'Il', after: 'arrivé en retard ce matin.', answer: 'est' },
      { before: 'Nous avons vu des chevaux', after: 'des vaches dans le pré.', answer: 'et' },
      { before: 'Ce problème', after: 'difficile à résoudre.', answer: 'est' },
      { before: 'Ce jeu', after: 'amusant pour toute la famille.', answer: 'est' },
      { before: 'Julie', after: 'Marc partagent le même goûter.', answer: 'et' },
      { before: 'L’eau de la piscine', after: 'très froide aujourd’hui.', answer: 'est' },
      { before: 'On voit des vaches', after: 'des moutons dans le pré.', answer: 'et' },
      { before: 'Ce chemin', after: 'trop boueux pour les vélos.', answer: 'est' },
    ],
  },
  'on-ont': {
    label: 'on / ont',
    words: ['on', 'ont'],
    sentences: [
      { before: 'Le week-end,', after: 'va souvent chez mamie.', answer: 'on' },
      { before: 'Les enfants', after: 'mangé toute la tarte.', answer: 'ont' },
      { before: 'Ici,', after: 'ne parle pas trop fort.', answer: 'on' },
      { before: 'Mes cousins', after: 'un grand jardin.', answer: 'ont' },
      { before: 'Dans la cour,', after: 'joue au ballon.', answer: 'on' },
      { before: 'Ils', after: 'vu un bel arc-en-ciel.', answer: 'ont' },
      { before: 'Ce soir,', after: 'regarde un film.', answer: 'on' },
      { before: 'Les voisins', after: 'adopté un chaton.', answer: 'ont' },
      { before: 'Dans cette salle,', after: 'chuchote pour ne pas déranger.', answer: 'on' },
      { before: 'Mes voisins', after: 'repeint toute leur façade.', answer: 'ont' },
      { before: 'Au marché,', after: 'trouve des légumes tout frais.', answer: 'on' },
      { before: 'Les élèves', after: 'fini leur exercice avant la sonnerie.', answer: 'ont' },
      { before: 'Le dimanche,', after: 'aime bien faire la grasse matinée.', answer: 'on' },
    ],
  },
  'son-sont': {
    label: 'son / sont',
    words: ['son', 'sont'],
    sentences: [
      { before: 'Léo range', after: 'vélo dans le garage.', answer: 'son' },
      { before: 'Les gâteaux', after: 'déjà refroidis.', answer: 'sont' },
      { before: 'Elle a perdu', after: 'écharpe rouge.', answer: 'son' },
      { before: 'Ses amis', after: 'venus la voir hier.', answer: 'sont' },
      { before: 'Le chien tient', after: 'os dans la gueule.', answer: 'son' },
      { before: 'Ces fleurs', after: 'magnifiques ce printemps.', answer: 'sont' },
      { before: 'Il a oublié', after: 'cahier à l’école.', answer: 'son' },
      { before: 'Vos manteaux', after: 'dans le placard.', answer: 'sont' },
      { before: 'Paul cherche', after: 'cartable sous le lit.', answer: 'son' },
      { before: 'Les rideaux du salon', after: 'trop longs pour la fenêtre.', answer: 'sont' },
      { before: 'Elle attache', after: 'chien avant de sortir.', answer: 'son' },
      { before: 'Ces histoires', after: 'connues de tous les enfants.', answer: 'sont' },
      { before: 'Il a rangé', after: 'bureau avant de partir.', answer: 'son' },
    ],
  },
  'ce-se': {
    label: 'ce / se',
    words: ['ce', 'se'],
    sentences: [
      { before: 'Range', after: 'jouet avant le dîner.', answer: 'ce' },
      { before: 'Le matin, il', after: 'lave les mains.', answer: 'se' },
      { before: 'Regarde', after: 'dessin, il est réussi.', answer: 'ce' },
      { before: 'Avant de dormir, elle', after: 'brosse les dents.', answer: 'se' },
      { before: 'Prends', after: 'crayon pour écrire.', answer: 'ce' },
      { before: 'Le chat', after: 'cache sous le lit.', answer: 'se' },
      { before: 'J’aime bien', after: 'livre d’aventures.', answer: 'ce' },
      { before: 'Les enfants', after: 'dépêchent pour l’école.', answer: 'se' },
      { before: 'Prends', after: 'parapluie, il va pleuvoir.', answer: 'ce' },
      { before: 'Le matin, elle', after: 'prépare un café.', answer: 'se' },
      { before: 'J’aime beaucoup', after: 'quartier animé.', answer: 'ce' },
      { before: 'Avant le match, les joueurs', after: 'échauffent.', answer: 'se' },
      { before: 'Regarde', after: 'nuage en forme de cœur.', answer: 'ce' },
    ],
  },
  'ces-ses': {
    label: 'ces / ses',
    words: ['ces', 'ses'],
    sentences: [
      { before: 'Regarde', after: 'nuages, ils bougent vite.', answer: 'ces' },
      { before: 'Elle a appelé', after: 'parents avant de partir.', answer: 'ses' },
      { before: 'J’aime beaucoup', after: 'chaussures neuves.', answer: 'ces' },
      { before: 'Il a perdu', after: 'clés ce matin.', answer: 'ses' },
      { before: 'Prends', after: 'crayons de couleur.', answer: 'ces' },
      { before: 'Le chien a mangé', after: 'croquettes.', answer: 'ses' },
      { before: 'Regarde', after: 'photos de vacances.', answer: 'ces' },
      { before: 'Elle a rangé', after: 'livres sur l’étagère.', answer: 'ses' },
      { before: 'Elle porte souvent', after: 'lunettes de soleil.', answer: 'ces' },
      { before: 'Il a prêté', after: 'outils à son voisin.', answer: 'ses' },
      { before: 'J’adore', after: 'chansons entraînantes.', answer: 'ces' },
      { before: 'Elle range toujours', after: 'affaires avant de dormir.', answer: 'ses' },
      { before: 'Regarde', after: 'dessins, ils sont magnifiques.', answer: 'ces' },
    ],
  },
}
