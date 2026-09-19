/**
 * Short stories and comprehension questions.
 *
 * Every text carries explicit details (who, where, when, how many, colours):
 * the questions bear on those details, never on an ambiguous inference, so
 * the answer can always be checked by reading the text again.
 */
export const STORIES = [
  {
    id: 'marche',
    length: 'short',
    title: 'Le marché du samedi',
    text: [
      'Samedi matin, Tom est allé au marché avec sa grand-mère. Il pleuvait un peu, alors ils ont pris le parapluie jaune.',
      'À l’étal du fromager, ils ont acheté trois morceaux de comté. Ensuite, Tom a choisi des fraises pour le dessert. Sa grand-mère a payé avec un billet de vingt euros.',
      'En rentrant, ils ont croisé le voisin et son chien noir, qui s’appelle Filou.',
    ],
    questions: [
      {
        question: 'Avec qui Tom est-il allé au marché ?',
        options: ['Sa grand-mère', 'Son frère', 'Son voisin', 'Sa maîtresse'],
        answer: 0,
      },
      {
        question: 'De quelle couleur était le parapluie ?',
        options: ['Rouge', 'Bleu', 'Jaune', 'Vert'],
        answer: 2,
      },
      {
        question: 'Combien de morceaux de comté ont-ils achetés ?',
        options: ['Deux', 'Trois', 'Quatre', 'Six'],
        answer: 1,
      },
      {
        question: 'Quel fruit Tom a-t-il choisi ?',
        options: ['Des cerises', 'Des pommes', 'Des framboises', 'Des fraises'],
        answer: 3,
      },
      {
        question: 'Comment s’appelle le chien du voisin ?',
        options: ['Filou', 'Milou', 'Pilou', 'Loulou'],
        answer: 0,
      },
    ],
  },
  {
    id: 'velo',
    length: 'short',
    title: 'Le vélo de Lina',
    text: [
      'Pour ses neuf ans, Lina a reçu un vélo vert. Son oncle Marc le lui a offert un mercredi, jour où elle n’a pas école l’après-midi.',
      'Le lendemain, elle est partie faire un tour au parc avec deux copines, Inès et Jade. Elles ont fait quatre fois le tour du grand bassin.',
      'Au retour, la chaîne du vélo a déraillé. Marc l’a remise en place en cinq minutes.',
    ],
    questions: [
      {
        question: 'Quel âge Lina vient-elle d’avoir ?',
        options: ['Sept ans', 'Huit ans', 'Neuf ans', 'Dix ans'],
        answer: 2,
      },
      {
        question: 'Qui lui a offert le vélo ?',
        options: ['Son oncle Marc', 'Sa tante Inès', 'Son père', 'Sa sœur Jade'],
        answer: 0,
      },
      {
        question: 'Quel jour a-t-elle reçu son vélo ?',
        options: ['Lundi', 'Mercredi', 'Samedi', 'Dimanche'],
        answer: 1,
      },
      {
        question: 'Combien de tours du bassin ont-elles faits ?',
        options: ['Deux', 'Trois', 'Quatre', 'Cinq'],
        answer: 2,
      },
      {
        question: 'Qu’est-il arrivé au vélo au retour ?',
        options: [
          'Le pneu a crevé',
          'La chaîne a déraillé',
          'Le guidon s’est tordu',
          'La selle est tombée',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 'pique-nique',
    length: 'short',
    title: 'Le pique-nique au parc',
    text: [
      'Dimanche midi, Nora et son grand frère Hugo sont allés pique-niquer au parc du Lac. Ils ont emporté un panier avec du poulet froid, deux tomates et une grande bouteille d’eau.',
      'Ils se sont installés sous un grand chêne. Un écureuil roux s’est approché tout près d’eux pour chercher des miettes. Avant de repartir à quinze heures, Hugo a jeté les papiers dans une poubelle jaune.',
    ],
    questions: [
      {
        question: 'Quel jour Nora et Hugo sont-ils allés pique-niquer ?',
        options: ['Samedi', 'Dimanche', 'Lundi', 'Mercredi'],
        answer: 1,
      },
      {
        question: 'Où se sont-ils installés ?',
        options: ['Sous un chêne', 'Sous un sapin', 'Près de la rivière', 'Sur un banc'],
        answer: 0,
      },
      {
        question: 'Combien de tomates avaient-ils emportées ?',
        options: ['Une', 'Deux', 'Trois', 'Quatre'],
        answer: 1,
      },
      {
        question: 'Quel animal s’est approché d’eux ?',
        options: ['Un chat', 'Un oiseau', 'Un écureuil roux', 'Un lapin'],
        answer: 2,
      },
      {
        question: 'À quelle heure sont-ils repartis ?',
        options: ['Treize heures', 'Quatorze heures', 'Quinze heures', 'Seize heures'],
        answer: 2,
      },
    ],
  },
  {
    id: 'panne',
    length: 'medium',
    title: 'La panne de courant',
    text: [
      'Un soir de novembre, vers vingt heures, l’électricité s’est coupée dans tout l’immeuble de la famille Rivière. Camille était en train de terminer ses devoirs de géographie.',
      'Son père est allé chercher la lampe de poche rangée dans le tiroir de la cuisine, mais les piles étaient usées. Heureusement, sa mère avait acheté six bougies la semaine précédente.',
      'Ils les ont allumées et ont posé la plus grande sur la table du salon. Comme la télévision ne fonctionnait pas, ils ont joué aux cartes pendant près de deux heures. Camille a gagné trois parties sur cinq.',
      'Le courant est revenu à vingt-deux heures quinze, juste au moment où son petit frère Noé s’endormait sur le canapé.',
    ],
    questions: [
      {
        question: 'À quel moment la panne a-t-elle commencé ?',
        options: ['Vers 18 h', 'Vers 20 h', 'Vers 22 h', 'En pleine nuit'],
        answer: 1,
      },
      {
        question: 'Que faisait Camille au moment de la panne ?',
        options: [
          'Elle regardait la télévision',
          'Elle dînait',
          'Elle terminait ses devoirs de géographie',
          'Elle jouait aux cartes',
        ],
        answer: 2,
      },
      {
        question: 'Pourquoi la lampe de poche n’a-t-elle pas servi ?',
        options: [
          'Les piles étaient usées',
          'Elle était cassée',
          'Personne ne la trouvait',
          'Elle était restée dans la voiture',
        ],
        answer: 0,
      },
      {
        question: 'Combien de bougies la mère avait-elle achetées ?',
        options: ['Trois', 'Quatre', 'Six', 'Dix'],
        answer: 2,
      },
      {
        question: 'Combien de parties de cartes Camille a-t-elle gagnées ?',
        options: ['Deux sur cinq', 'Trois sur cinq', 'Quatre sur cinq', 'Cinq sur cinq'],
        answer: 1,
      },
      {
        question: 'Que faisait Noé quand le courant est revenu ?',
        options: [
          'Il jouait aux cartes',
          'Il cherchait les bougies',
          'Il s’endormait sur le canapé',
          'Il était déjà dans son lit',
        ],
        answer: 2,
      },
    ],
  },
  {
    id: 'chat',
    length: 'medium',
    title: 'Le chat du voisin',
    text: [
      'Monsieur Berger part en vacances en Bretagne pendant dix jours. Il demande à Yanis, son voisin du deuxième étage, de s’occuper de son chat Pistache.',
      'Chaque matin avant l’école, Yanis monte au quatrième étage avec la clé. Il donne au chat une demi-boîte de pâtée et remplit sa gamelle d’eau fraîche.',
      'Le quatrième jour, Pistache refuse de manger et se cache sous le lit. Yanis s’inquiète et appelle sa mère, qui est infirmière. Elle lui conseille de vérifier si le chat a de l’eau propre et de patienter jusqu’au soir.',
      'Le soir même, Pistache mange enfin, puis vient se frotter contre les jambes de Yanis. À son retour, monsieur Berger lui offre une boîte de caramels pour le remercier.',
    ],
    questions: [
      {
        question: 'Combien de temps monsieur Berger part-il ?',
        options: ['Une semaine', 'Dix jours', 'Deux semaines', 'Un mois'],
        answer: 1,
      },
      {
        question: 'À quel étage habite Yanis ?',
        options: ['Au premier', 'Au deuxième', 'Au troisième', 'Au quatrième'],
        answer: 1,
      },
      {
        question: 'Que donne-t-il au chat chaque matin ?',
        options: [
          'Une demi-boîte de pâtée',
          'Deux boîtes de pâtée',
          'Des croquettes',
          'Du lait',
        ],
        answer: 0,
      },
      {
        question: 'Quel jour Pistache refuse-t-il de manger ?',
        options: ['Le deuxième jour', 'Le troisième jour', 'Le quatrième jour', 'Le dernier jour'],
        answer: 2,
      },
      {
        question: 'Quel est le métier de la mère de Yanis ?',
        options: ['Vétérinaire', 'Infirmière', 'Médecin', 'Pharmacienne'],
        answer: 1,
      },
      {
        question: 'Comment monsieur Berger remercie-t-il Yanis ?',
        options: [
          'Il lui donne de l’argent',
          'Il lui offre une boîte de caramels',
          'Il lui prête son vélo',
          'Il l’invite au restaurant',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 'natation',
    length: 'medium',
    title: 'Le cours de natation',
    text: [
      'Le mardi après l’école, Malo va à la piscine municipale avec huit autres enfants de sa classe. Son moniteur, monsieur Diallo, leur apprend à nager le dos crawlé depuis trois semaines.',
      'Ce mardi-là, en arrivant, Malo remarque que l’eau est un peu plus froide que d’habitude : le grand bassin est en réparation, alors le groupe utilise le petit bassin. Monsieur Diallo demande à chacun de faire quatre longueurs avant de commencer les exercices.',
      'À la fin du cours, Malo est le premier à sortir de l’eau. Il félicite sa camarade Zoé, qui a réussi sa première longueur en dos crawlé toute seule. En rentrant, Malo raconte fièrement sa séance à sa grande sœur Inès.',
    ],
    questions: [
      {
        question: 'Quel jour Malo va-t-il à la piscine ?',
        options: ['Lundi', 'Mardi', 'Jeudi', 'Samedi'],
        answer: 1,
      },
      {
        question: 'Comment s’appelle son moniteur ?',
        options: ['Monsieur Diallo', 'Monsieur Berger', 'Monsieur Lafont', 'Monsieur Kervella'],
        answer: 0,
      },
      {
        question: 'Pourquoi le groupe utilise-t-il le petit bassin ?',
        options: [
          'Il y a trop d’enfants',
          'Le grand bassin est en réparation',
          'L’eau du grand bassin est sale',
          'C’est l’heure d’un autre cours',
        ],
        answer: 1,
      },
      {
        question: 'Combien de longueurs monsieur Diallo demande-t-il de faire avant les exercices ?',
        options: ['Deux', 'Trois', 'Quatre', 'Six'],
        answer: 2,
      },
      {
        question: 'Qui sort le premier de l’eau ?',
        options: ['Zoé', 'Malo', 'Monsieur Diallo', 'Inès'],
        answer: 1,
      },
      {
        question: 'À qui Malo raconte-t-il sa séance en rentrant ?',
        options: ['À sa mère', 'À sa grande sœur Inès', 'À son moniteur', 'À Zoé'],
        answer: 1,
      },
    ],
  },
  {
    id: 'phare',
    length: 'long',
    title: 'La sortie au phare',
    text: [
      'La classe de CM2 de madame Lafont est partie visiter le phare de la pointe des Sables, un mardi de mai. Le car est parti de l’école à huit heures et quart, avec vingt-six élèves et trois accompagnateurs.',
      'Le trajet a duré une heure et demie. Pendant le voyage, Adam a lu le guide à voix haute : le phare mesure quarante-deux mètres, il a été construit en 1892, et son escalier compte deux cent dix marches.',
      'Sur place, le gardien, monsieur Kervella, les a accueillis avec un ciré jaune. Il a expliqué que la lampe tourne jour et nuit et qu’on aperçoit sa lumière à trente kilomètres. Les élèves ont monté l’escalier par groupes de six. En haut, le vent soufflait si fort que la casquette de Léo s’est envolée.',
      'Après la visite, ils ont pique-niqué sur la plage. Sara a trouvé un oursin dans une flaque et madame Lafont a pris une photo de toute la classe devant le phare. Le car est reparti à seize heures, avec une demi-heure de retard, parce qu’il manquait le sac de Mehdi.',
    ],
    questions: [
      {
        question: 'Quel jour la classe est-elle partie ?',
        options: ['Un lundi', 'Un mardi', 'Un jeudi', 'Un vendredi'],
        answer: 1,
      },
      {
        question: 'Combien d’élèves sont partis en sortie ?',
        options: ['Vingt-deux', 'Vingt-quatre', 'Vingt-six', 'Trente'],
        answer: 2,
      },
      {
        question: 'Quelle est la hauteur du phare ?',
        options: ['Trente mètres', 'Quarante-deux mètres', 'Cinquante mètres', 'Soixante mètres'],
        answer: 1,
      },
      {
        question: 'Combien de marches compte l’escalier ?',
        options: ['Cent dix', 'Cent quatre-vingts', 'Deux cent dix', 'Trois cents'],
        answer: 2,
      },
      {
        question: 'Comment s’appelle le gardien du phare ?',
        options: [
          'Monsieur Kervella',
          'Monsieur Lafont',
          'Monsieur Berger',
          'Monsieur Sables',
        ],
        answer: 0,
      },
      {
        question: 'Qu’est-il arrivé à Léo en haut du phare ?',
        options: [
          'Il a eu le vertige',
          'Sa casquette s’est envolée',
          'Il a perdu son guide',
          'Il est tombé dans l’escalier',
        ],
        answer: 1,
      },
      {
        question: 'Pourquoi le car est-il reparti en retard ?',
        options: [
          'Un élève s’était perdu',
          'Le chauffeur était en retard',
          'Il manquait le sac de Mehdi',
          'La visite a duré plus longtemps',
        ],
        answer: 2,
      },
    ],
  },
  {
    id: 'demenagement',
    length: 'long',
    title: 'Le déménagement de Sofia',
    text: [
      'La famille de Sofia a quitté son appartement de Lyon pour une maison à Chambéry, le premier samedi des vacances de printemps. Le camion de déménagement, bleu et blanc, est arrivé à sept heures du matin.',
      'Sofia avait préparé onze cartons : sept pour ses livres, trois pour ses vêtements et un pour sa collection de cailloux, ramassés depuis l’âge de six ans. Son frère Élias, lui, n’en avait rempli que quatre, et il a oublié de fermer celui des jouets.',
      'Le trajet a pris une heure quarante. À l’arrivée, il pleuvait. Les déménageurs ont d’abord porté le canapé, puis le piano de la mère de Sofia, qui pèse à lui seul deux cents kilos.',
      'La nouvelle chambre de Sofia est au premier étage, avec une fenêtre qui donne sur un cerisier. Le soir, comme la cuisine n’était pas installée, ils ont mangé des pizzas assis par terre. Sofia a mis une semaine à retrouver son carton de cailloux : il était rangé dans le garage, sous les affaires de ski.',
    ],
    questions: [
      {
        question: 'Dans quelle ville la famille s’installe-t-elle ?',
        options: ['Lyon', 'Grenoble', 'Chambéry', 'Annecy'],
        answer: 2,
      },
      {
        question: 'À quelle heure le camion est-il arrivé ?',
        options: ['À six heures', 'À sept heures', 'À huit heures', 'À neuf heures'],
        answer: 1,
      },
      {
        question: 'Combien de cartons Sofia avait-elle préparés ?',
        options: ['Quatre', 'Sept', 'Onze', 'Quinze'],
        answer: 2,
      },
      {
        question: 'Que contenait le carton oublié ouvert par Élias ?',
        options: ['Ses livres', 'Ses jouets', 'Ses vêtements', 'Ses cailloux'],
        answer: 1,
      },
      {
        question: 'Combien pèse le piano ?',
        options: ['Cent kilos', 'Cent cinquante kilos', 'Deux cents kilos', 'Trois cents kilos'],
        answer: 2,
      },
      {
        question: 'Que voit-on depuis la fenêtre de la nouvelle chambre ?',
        options: ['Un cerisier', 'La montagne', 'Le garage', 'La rue principale'],
        answer: 0,
      },
      {
        question: 'Où le carton de cailloux avait-il été rangé ?',
        options: [
          'Dans le grenier',
          'Dans le garage, sous les affaires de ski',
          'Dans la cuisine',
          'Il était resté à Lyon',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 'exposition',
    length: 'long',
    title: 'L’exposition de peinture',
    text: [
      'Pour les vacances de la Toussaint, l’école organise une petite exposition des dessins de tous les élèves, du CP au CM2. Elle a lieu le jeudi, dans la grande salle polyvalente, de quatorze heures à dix-sept heures.',
      'Léna, en CE2, a peint un paysage de montagne avec un lac bleu turquoise. Elle y a travaillé pendant deux semaines, un peu chaque soir après ses devoirs. Son tableau est accroché juste à côté de celui de son ami Noah, qui a dessiné un dragon vert à trois têtes.',
      'Les parents sont invités à voter pour leur œuvre préférée en déposant une gommette rouge devant le dessin choisi. À la fin de l’après-midi, la maîtresse, madame Petit, compte les gommettes : c’est le dragon de Noah qui obtient le plus de voix, avec vingt-trois gommettes.',
      'Pour le féliciter, toute la classe reçoit un livre offert par la mairie. Léna, un peu déçue au début, est finalement très fière d’avoir participé, et elle décide déjà ce qu’elle peindra l’année prochaine.',
    ],
    questions: [
      {
        question: 'À quelle occasion l’exposition a-t-elle lieu ?',
        options: ['Noël', 'La Toussaint', 'La fête de l’école', 'Pâques'],
        answer: 1,
      },
      {
        question: 'De quelle heure à quelle heure a lieu l’exposition ?',
        options: ['De 13 h à 16 h', 'De 14 h à 17 h', 'De 15 h à 18 h', 'De 14 h à 16 h'],
        answer: 1,
      },
      {
        question: 'Dans quelle classe est Léna ?',
        options: ['CP', 'CE1', 'CE2', 'CM1'],
        answer: 2,
      },
      {
        question: 'Qu’a peint Noah ?',
        options: [
          'Un paysage de montagne',
          'Un dragon vert à trois têtes',
          'Un bateau',
          'Un portrait',
        ],
        answer: 1,
      },
      {
        question: 'Comment les parents votent-ils pour leur œuvre préférée ?',
        options: [
          'Ils lèvent la main',
          'Ils écrivent un nom sur un papier',
          'Ils déposent une gommette rouge',
          'Ils applaudissent',
        ],
        answer: 2,
      },
      {
        question: 'Combien de gommettes le dessin gagnant a-t-il obtenues ?',
        options: ['Treize', 'Dix-huit', 'Vingt-trois', 'Trente'],
        answer: 2,
      },
      {
        question: 'Qui offre le livre à toute la classe ?',
        options: ['La maîtresse', 'La mairie', 'Les parents', 'Le directeur'],
        answer: 1,
      },
    ],
  },
]

export const LONGUEURS = {
  court: 'Texte court',
  moyen: 'Texte moyen',
  long: 'Texte long',
}
