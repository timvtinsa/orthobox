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
  {
    id: 'boulangerie',
    length: 'short',
    title: 'La boulangerie de Nora',
    text: [
      'Dimanche, Nora est allée à la boulangerie avec son père. Ils ont fait la queue pendant dix minutes devant le magasin.',
      'Nora a demandé une baguette et deux croissants. Le boulanger, monsieur Garnier, lui a offert un petit biscuit au chocolat.',
      'Sur le chemin du retour, elle a mangé son croissant assis sur un banc vert.',
    ],
    questions: [
      {
        question: 'Quel jour Nora est-elle allée à la boulangerie ?',
        options: ['Samedi', 'Dimanche', 'Lundi', 'Mercredi'],
        answer: 1,
      },
      {
        question: 'Combien de temps ont-ils attendu ?',
        options: ['Cinq minutes', 'Dix minutes', 'Quinze minutes', 'Vingt minutes'],
        answer: 1,
      },
      {
        question: 'Que Nora a-t-elle demandé en plus de la baguette ?',
        options: ['Deux croissants', 'Trois éclairs', 'Un pain au chocolat', 'Une tarte'],
        answer: 0,
      },
      {
        question: 'Comment s’appelle le boulanger ?',
        options: ['Monsieur Garnier', 'Monsieur Granier', 'Monsieur Gauthier', 'Monsieur Garcia'],
        answer: 0,
      },
      {
        question: 'De quelle couleur était le banc ?',
        options: ['Bleu', 'Rouge', 'Vert', 'Marron'],
        answer: 2,
      },
    ],
  },
  {
    id: 'plage',
    length: 'short',
    title: 'Une journée à la plage',
    text: [
      'En juillet, la famille Dubois est partie à la plage. Il faisait très chaud, alors Julie a mis son chapeau de paille.',
      'Son petit frère Hugo a construit un grand château de sable avec un seau rouge. Il a ajouté quatre tours et un drapeau.',
      'À midi, ils ont mangé des sandwichs au jambon sous le parasol. Puis Julie s’est baignée pendant que Papa lisait son journal.',
    ],
    questions: [
      {
        question: 'Quand la famille est-elle partie à la plage ?',
        options: ['En juin', 'En juillet', 'En août', 'En mai'],
        answer: 1,
      },
      {
        question: 'Que Julie a-t-elle mis sur sa tête ?',
        options: ['Une casquette', 'Un bonnet', 'Un chapeau de paille', 'Un foulard'],
        answer: 2,
      },
      {
        question: 'De quelle couleur était le seau d’Hugo ?',
        options: ['Bleu', 'Jaune', 'Vert', 'Rouge'],
        answer: 3,
      },
      {
        question: 'Combien de tours le château avait-il ?',
        options: ['Deux', 'Trois', 'Quatre', 'Cinq'],
        answer: 2,
      },
      {
        question: 'Que contenaient les sandwichs ?',
        options: ['Du jambon', 'Du fromage', 'Du poulet', 'Du thon'],
        answer: 0,
      },
    ],
  },
  {
    id: 'anniversaire',
    length: 'short',
    title: 'Le gâteau d’Adam',
    text: [
      'Pour les huit ans d’Adam, sa maman a préparé un gâteau au citron. Elle l’a décoré avec huit bougies bleues.',
      'Cinq copains sont venus à la maison, dont Samia et Léon. Ils ont joué à cache-cache dans le jardin pendant une heure.',
      'Au moment des cadeaux, Adam a reçu un puzzle de cent pièces et un livre sur les dinosaures.',
    ],
    questions: [
      {
        question: 'Quel âge Adam a-t-il fêté ?',
        options: ['Six ans', 'Sept ans', 'Huit ans', 'Neuf ans'],
        answer: 2,
      },
      {
        question: 'Quel parfum avait le gâteau ?',
        options: ['Chocolat', 'Citron', 'Fraise', 'Vanille'],
        answer: 1,
      },
      {
        question: 'De quelle couleur étaient les bougies ?',
        options: ['Bleues', 'Rouges', 'Jaunes', 'Vertes'],
        answer: 0,
      },
      {
        question: 'Combien de copains sont venus ?',
        options: ['Trois', 'Quatre', 'Cinq', 'Six'],
        answer: 2,
      },
      {
        question: 'À quel jeu ont-ils joué ?',
        options: ['À chat', 'À cache-cache', 'Au ballon', 'Aux cartes'],
        answer: 1,
      },
    ],
  },
  {
    id: 'foret',
    length: 'medium',
    title: 'La balade en forêt',
    text: [
      'Un dimanche d’octobre, Clara et son grand frère Yanis sont partis se promener en forêt avec leur oncle Paul. Le ciel était gris, mais il ne pleuvait pas.',
      'Ils ont suivi un sentier marqué de petits ronds rouges. Au bout d’une demi-heure, ils ont croisé un écureuil qui descendait d’un chêne. Clara l’a pris en photo avec le téléphone de son oncle.',
      'Yanis a ramassé neuf châtaignes et Clara des feuilles de toutes les couleurs, qu’elle a rangées dans son sac à dos. Puis ils ont mangé des tartines de confiture près d’un étang.',
      'Sur le chemin du retour, Paul s’est aperçu qu’il avait oublié sa casquette sur un rocher. Ils sont revenus la chercher et sont rentrés à la maison à cinq heures.',
    ],
    questions: [
      {
        question: 'En quel mois a lieu la balade ?',
        options: ['Septembre', 'Octobre', 'Novembre', 'Décembre'],
        answer: 1,
      },
      {
        question: 'Quelles marques suivent-ils sur le sentier ?',
        options: ['Des ronds rouges', 'Des flèches jaunes', 'Des croix bleues', 'Des carrés verts'],
        answer: 0,
      },
      {
        question: 'Quel animal croisent-ils ?',
        options: ['Un lapin', 'Un renard', 'Un écureuil', 'Un hérisson'],
        answer: 2,
      },
      {
        question: 'Combien de châtaignes Yanis a-t-il ramassées ?',
        options: ['Cinq', 'Sept', 'Neuf', 'Douze'],
        answer: 2,
      },
      {
        question: 'Où mangent-ils leurs tartines ?',
        options: ['Près d’un étang', 'Sous un chêne', 'Sur un rocher', 'Dans une cabane'],
        answer: 0,
      },
      {
        question: 'Qu’est-ce que Paul a oublié ?',
        options: ['Son sac', 'Sa casquette', 'Son téléphone', 'Sa veste'],
        answer: 1,
      },
    ],
  },
  {
    id: 'cinema',
    length: 'medium',
    title: 'Une sortie au cinéma',
    text: [
      'Mercredi après-midi, Louise est allée au cinéma avec sa tante Élodie et sa cousine Manon. Elles ont pris le bus numéro 12 pour aller au centre-ville.',
      'La séance commençait à quatorze heures trente. Devant la caisse, la tante a acheté trois billets à sept euros chacun. Manon a voulu du pop-corn salé, alors que Louise a préféré un jus de pomme.',
      'Le film racontait l’histoire d’un petit renard qui cherche sa famille dans la neige. À la fin, tout le monde a applaudi, et Louise a trouvé la musique magnifique.',
      'En sortant, elles ont acheté une glace à la vanille et sont rentrées à pied, car le bus était en panne.',
    ],
    questions: [
      {
        question: 'Quel jour a lieu la sortie ?',
        options: ['Lundi', 'Mercredi', 'Vendredi', 'Samedi'],
        answer: 1,
      },
      {
        question: 'Quel bus ont-elles pris pour aller au centre-ville ?',
        options: ['Le numéro 8', 'Le numéro 10', 'Le numéro 12', 'Le numéro 21'],
        answer: 2,
      },
      {
        question: 'Combien coûte chaque billet ?',
        options: ['Cinq euros', 'Six euros', 'Sept euros', 'Huit euros'],
        answer: 2,
      },
      {
        question: 'Que Louise a-t-elle choisi de boire ?',
        options: ['Du jus de pomme', 'De l’eau', 'Du soda', 'Du lait'],
        answer: 0,
      },
      {
        question: 'Quel animal est le héros du film ?',
        options: ['Un ours', 'Un renard', 'Un loup', 'Un lapin'],
        answer: 1,
      },
      {
        question: 'Pourquoi rentrent-elles à pied ?',
        options: ['Il pleuvait', 'Elles voulaient marcher', 'Le bus était en panne', 'Il n’y avait plus de place'],
        answer: 2,
      },
    ],
  },
  {
    id: 'ferme',
    length: 'medium',
    title: 'La visite de la ferme',
    text: [
      'Au mois de mai, la classe de CE2 de monsieur Bernard a visité une ferme près du village de Valmont. Il y avait vingt-trois élèves et deux parents accompagnateurs.',
      'La fermière, madame Rolland, leur a d’abord montré les vaches. Elle en possède quarante, et chacune donne environ vingt litres de lait par jour. Ensuite, les enfants ont donné du grain aux poules et ont ramassé sept œufs.',
      'Dans l’étable, Inès a caressé un veau né deux jours plus tôt. Il s’appelait Noisette et avait une tache blanche sur le front.',
      'Pour terminer, la fermière a servi du fromage blanc avec du miel. Tout le monde est reparti avec un petit pot de confiture de fraises.',
    ],
    questions: [
      {
        question: 'Dans quelle classe sont les élèves ?',
        options: ['CP', 'CE1', 'CE2', 'CM1'],
        answer: 2,
      },
      {
        question: 'Combien d’élèves participent à la visite ?',
        options: ['Dix-huit', 'Vingt-trois', 'Vingt-huit', 'Trente'],
        answer: 1,
      },
      {
        question: 'Combien la fermière possède-t-elle de vaches ?',
        options: ['Vingt', 'Trente', 'Quarante', 'Cinquante'],
        answer: 2,
      },
      {
        question: 'Combien d’œufs les enfants ont-ils ramassés ?',
        options: ['Trois', 'Cinq', 'Sept', 'Neuf'],
        answer: 2,
      },
      {
        question: 'Comment s’appelle le veau ?',
        options: ['Noisette', 'Pâquerette', 'Caramel', 'Biscotte'],
        answer: 0,
      },
      {
        question: 'Que reçoivent les enfants en partant ?',
        options: ['Un pot de miel', 'Un pot de confiture de fraises', 'Une bouteille de lait', 'Un fromage'],
        answer: 1,
      },
    ],
  },
  {
    id: 'tempete',
    length: 'long',
    title: 'La tempête sur le village',
    text: [
      'Un vendredi de novembre, le vent s’est mis à souffler très fort sur le petit village de Pierrefitte. Vers dix-huit heures, la pluie s’est ajoutée au vent, et le ciel est devenu presque noir.',
      'Chez les Marchand, le père, Antoine, a rentré les chaises du jardin et fermé tous les volets. Sa fille Camille, qui a dix ans, a allumé trois bougies sur la table au cas où le courant serait coupé. Son petit frère Noé, six ans, s’est caché sous la couverture à rayures du canapé avec son lapin en peluche.',
      'À vingt heures, l’électricité s’est éteinte dans tout le quartier. La famille a dîné à la lumière des bougies : une soupe de potiron et du pain grillé. Camille a lu à voix haute un conte de pirates, et Noé s’est endormi avant la fin.',
      'Pendant la nuit, un grand peuplier est tombé au bout de la rue, sans toucher aucune maison. Le lendemain matin, les pompiers sont arrivés avec une tronçonneuse pour dégager la route, et le maire, madame Bouvier, a remercié tous les voisins qui sont venus aider.',
      'À midi, le courant est revenu. Pour fêter ça, les habitants ont partagé un goûter sur la place, avec des crêpes que Camille avait aidé à préparer.',
    ],
    questions: [
      {
        question: 'En quel mois la tempête a-t-elle lieu ?',
        options: ['Octobre', 'Novembre', 'Décembre', 'Janvier'],
        answer: 1,
      },
      {
        question: 'À quelle heure la pluie s’ajoute-t-elle au vent ?',
        options: ['Seize heures', 'Dix-sept heures', 'Dix-huit heures', 'Vingt heures'],
        answer: 2,
      },
      {
        question: 'Quel âge a Camille ?',
        options: ['Six ans', 'Huit ans', 'Dix ans', 'Douze ans'],
        answer: 2,
      },
      {
        question: 'Combien de bougies Camille allume-t-elle ?',
        options: ['Deux', 'Trois', 'Quatre', 'Cinq'],
        answer: 1,
      },
      {
        question: 'Que dîne la famille ?',
        options: ['Une soupe de potiron', 'Des pâtes', 'Une omelette', 'Une pizza'],
        answer: 0,
      },
      {
        question: 'Quel arbre est tombé dans la rue ?',
        options: ['Un chêne', 'Un sapin', 'Un peuplier', 'Un saule'],
        answer: 2,
      },
      {
        question: 'Comment s’appelle le maire du village ?',
        options: ['Madame Marchand', 'Madame Bouvier', 'Madame Camille', 'Madame Pierrefitte'],
        answer: 1,
      },
    ],
  },
  {
    id: 'musee',
    length: 'long',
    title: 'Au musée des sciences',
    text: [
      'Le jeudi 14 mars, les élèves de CM1 de madame Perrin ont visité le musée des sciences de la ville de Montbrun. Le bus est parti à neuf heures pile, avec vingt et un enfants, deux enseignantes et un papa, monsieur Salhi.',
      'Le guide, un jeune homme prénommé Victor, les attendait à l’entrée, portant une blouse blanche. Il leur a expliqué qu’ils verraient trois salles : celle des planètes, celle des dinosaures et celle des volcans. Chaque enfant a reçu un petit carnet vert et un crayon pour noter ses découvertes.',
      'Dans la salle des planètes, Zoé a appris que Jupiter est la plus grosse planète, et qu’il lui faut près de douze ans pour tourner autour du soleil. Dans la salle des dinosaures, Malik a mesuré le squelette d’un diplodocus : il fait vingt-sept mètres de long, soit plus que trois bus alignés.',
      'Dans la salle des volcans, une machine a simulé une éruption avec de la fumée et des lumières rouges. Léna a eu un peu peur et a pris la main de sa maîtresse.',
      'À midi, la classe a mangé dans le jardin du musée, sous un grand tilleul. L’après-midi, un atelier leur a permis de fabriquer chacun une petite fusée en carton. Le bus est reparti à seize heures, et tout le monde a chanté pendant le trajet.',
    ],
    questions: [
      {
        question: 'Comment s’appelle l’enseignante de la classe ?',
        options: ['Madame Perrin', 'Madame Salhi', 'Madame Victor', 'Madame Montbrun'],
        answer: 0,
      },
      {
        question: 'Combien d’enfants sont partis en sortie ?',
        options: ['Dix-neuf', 'Vingt et un', 'Vingt-quatre', 'Vingt-sept'],
        answer: 1,
      },
      {
        question: 'De quelle couleur était le carnet des enfants ?',
        options: ['Rouge', 'Bleu', 'Jaune', 'Vert'],
        answer: 3,
      },
      {
        question: 'Quelle est la plus grosse planète ?',
        options: ['Mars', 'Saturne', 'Jupiter', 'Vénus'],
        answer: 2,
      },
      {
        question: 'Quelle est la longueur du diplodocus ?',
        options: ['Dix-sept mètres', 'Vingt-sept mètres', 'Trente-sept mètres', 'Quarante mètres'],
        answer: 1,
      },
      {
        question: 'Qui a eu un peu peur pendant l’éruption ?',
        options: ['Zoé', 'Malik', 'Victor', 'Léna'],
        answer: 3,
      },
      {
        question: 'Que les enfants fabriquent-ils pendant l’atelier ?',
        options: ['Une fusée en carton', 'Un volcan en pâte à modeler', 'Un squelette en papier', 'Un télescope'],
        answer: 0,
      },
    ],
  },
]

export const LONGUEURS = {
  court: 'Texte court',
  moyen: 'Texte moyen',
  long: 'Texte long',
}
