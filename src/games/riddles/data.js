/**
 * Riddles with progressive clues: from the most general (category, purpose)
 * to the most specific. The answer stays hidden until the practitioner
 * reveals it.
 */
export const RIDDLES = [
  // --- Animals ---
  {
    theme: 'animals',
    answer: 'le chat',
    clues: [
      'Je suis un animal domestique.',
      'Je miaule et je fais ma toilette avec ma langue.',
      'Je dors souvent sur le canapé.',
    ],
  },
  {
    theme: 'animals',
    answer: 'la vache',
    clues: [
      'Je suis un animal de la ferme.',
      'Je broute de l’herbe dans le pré.',
      'On fait du fromage avec le lait que je donne.',
    ],
  },
  {
    theme: 'animals',
    answer: 'l’abeille',
    clues: [
      'Je suis un tout petit animal qui vole.',
      'Je vis dans une ruche avec des milliers d’autres.',
      'Je fabrique du miel.',
    ],
  },
  {
    theme: 'animals',
    answer: 'le kangourou',
    clues: [
      'Je suis un animal qui vit en Australie.',
      'Je me déplace en faisant de grands bonds.',
      'Je transporte mon petit dans une poche sur mon ventre.',
    ],
  },
  {
    theme: 'animals',
    answer: 'l’escargot',
    clues: [
      'Je suis un petit animal très lent.',
      'Je sors surtout quand il pleut.',
      'Je porte ma maison sur mon dos.',
    ],
  },
  {
    theme: 'animals',
    answer: 'le hibou',
    clues: [
      'Je suis un oiseau.',
      'Je dors le jour et je chasse la nuit.',
      'Je peux tourner la tête presque complètement.',
    ],
  },
  {
    theme: 'animals',
    answer: 'le dauphin',
    clues: [
      'Je vis dans la mer.',
      'Je ne suis pas un poisson : je remonte respirer à la surface.',
      'Je saute hors de l’eau et on dit que je suis très intelligent.',
    ],
  },
  {
    theme: 'animals',
    answer: 'l’écureuil',
    clues: [
      'Je vis dans la forêt.',
      'Je grimpe aux arbres avec ma grande queue touffue.',
      'Je cache des noisettes pour l’hiver.',
    ],
  },
  {
    theme: 'animals',
    answer: 'le poisson rouge',
    clues: [
      'Je vis dans un bocal ou un aquarium.',
      'Je suis orange et je n’ai pas de paupières.',
      'Je tourne en rond dans mon bocal.',
    ],
  },
  {
    theme: 'animals',
    answer: 'la tortue',
    clues: [
      'Je suis un reptile très lent.',
      'J’ai une carapace dure sur le dos.',
      'Je peux vivre plus de cent ans.',
    ],
  },
  {
    theme: 'animals',
    answer: 'le perroquet',
    clues: [
      'Je suis un oiseau très coloré.',
      'Je peux répéter les mots que j’entends.',
      'Dans les histoires de pirates, je me pose souvent sur leur épaule.',
    ],
  },
  {
    theme: 'animals',
    answer: 'l’ours',
    clues: [
      'Je suis un grand animal au poil épais.',
      'Je dors tout l’hiver dans une grotte.',
      'J’aime beaucoup le miel.',
    ],
  },

  // --- Everyday objects ---
  {
    theme: 'objects',
    answer: 'le parapluie',
    clues: [
      'On me sort seulement quand il fait mauvais.',
      'Je m’ouvre et je me ferme.',
      'Je protège de la pluie.',
    ],
  },
  {
    theme: 'objects',
    answer: 'la brosse à dents',
    clues: [
      'On m’utilise au moins deux fois par jour.',
      'Je suis rangée dans la salle de bain.',
      'On met du dentifrice sur moi.',
    ],
  },
  {
    theme: 'objects',
    answer: 'les ciseaux',
    clues: [
      'Je suis un objet en métal.',
      'J’ai deux trous pour les doigts.',
      'Je sers à découper le papier.',
    ],
  },
  {
    theme: 'objects',
    answer: 'le réfrigérateur',
    clues: [
      'Je suis dans la cuisine.',
      'Je suis grand et je ronronne doucement.',
      'Je garde les aliments au froid.',
    ],
  },
  {
    theme: 'objects',
    answer: 'la clé',
    clues: [
      'Je suis toute petite et en métal.',
      'On me range dans une poche ou un sac.',
      'Je sers à ouvrir la porte.',
    ],
  },
  {
    theme: 'objects',
    answer: 'l’aspirateur',
    clues: [
      'Je suis un appareil électrique.',
      'Je fais beaucoup de bruit.',
      'Je ramasse la poussière par terre.',
    ],
  },
  {
    theme: 'objects',
    answer: 'le réveil',
    clues: [
      'Je suis souvent posé près du lit.',
      'J’affiche des chiffres.',
      'Je sonne le matin pour réveiller.',
    ],
  },
  {
    theme: 'objects',
    answer: 'le crayon',
    clues: [
      'On me tient dans la main.',
      'Je suis en bois avec une mine au bout.',
      'On peut gommer ce que j’écris.',
    ],
  },
  {
    theme: 'objects',
    answer: 'la lampe de poche',
    clues: [
      'Je suis un petit objet qu’on tient dans la main.',
      'J’ai une pile à l’intérieur.',
      'Je fais de la lumière quand il fait noir.',
    ],
  },
  {
    theme: 'objects',
    answer: 'le peigne',
    clues: [
      'Je suis un petit objet fin avec plein de dents.',
      'On me passe dans les cheveux.',
      'Je sers à se coiffer.',
    ],
  },
  {
    theme: 'objects',
    answer: 'la casserole',
    clues: [
      'Je suis un objet de cuisine.',
      'J’ai un long manche pour ne pas se brûler.',
      'On me pose sur le feu pour cuire les aliments.',
    ],
  },
  {
    theme: 'objects',
    answer: 'le thermomètre',
    clues: [
      'Je suis un petit objet fin et rigide.',
      'Je mesure la température.',
      'On me met parfois sous le bras quand on est malade.',
    ],
  },

  // --- Food, places and jobs ---
  {
    theme: 'places',
    answer: 'la banane',
    clues: [
      'Je suis un fruit.',
      'Je suis jaune et allongée.',
      'On enlève ma peau avant de me manger.',
    ],
  },
  {
    theme: 'places',
    answer: 'la boulangerie',
    clues: [
      'C’est un magasin du quartier.',
      'Ça sent très bon le matin.',
      'On y achète le pain et les croissants.',
    ],
  },
  {
    theme: 'places',
    answer: 'le facteur',
    clues: [
      'C’est un métier.',
      'On travaille dehors, souvent le matin.',
      'On distribue le courrier dans les boîtes aux lettres.',
    ],
  },
  {
    theme: 'places',
    answer: 'la piscine',
    clues: [
      'C’est un endroit où on va parfois le week-end.',
      'On met un maillot de bain pour y aller.',
      'On y nage dans une grande eau bleue.',
    ],
  },
  {
    theme: 'places',
    answer: 'le dentiste',
    clues: [
      'C’est quelqu’un qu’on va voir quand on a mal.',
      'On s’allonge sur un fauteuil et on ouvre grand la bouche.',
      'Il soigne les dents.',
    ],
  },
  {
    theme: 'places',
    answer: 'la neige',
    clues: [
      'J’arrive surtout en hiver.',
      'Je suis blanche et froide.',
      'On fait des bonshommes avec moi.',
    ],
  },
  {
    theme: 'places',
    answer: 'la bibliothèque',
    clues: [
      'C’est un endroit calme.',
      'On y parle à voix basse.',
      'On y emprunte des livres.',
    ],
  },
  {
    theme: 'places',
    answer: 'le pompier',
    clues: [
      'C’est un métier.',
      'On porte un casque et on roule dans un camion rouge.',
      'On éteint les incendies.',
    ],
  },
  {
    theme: 'places',
    answer: 'le pharmacien',
    clues: [
      'C’est un métier.',
      'Il travaille dans un magasin avec une croix verte.',
      'Il donne les médicaments prescrits par le médecin.',
    ],
  },
  {
    theme: 'places',
    answer: 'la fraise',
    clues: [
      'Je suis un fruit rouge.',
      'J’ai plein de petites graines sur ma peau.',
      'On me mange souvent avec de la chantilly.',
    ],
  },
  {
    theme: 'places',
    answer: 'la plage',
    clues: [
      'C’est un endroit qu’on aime en été.',
      'Il y a du sable et des vagues.',
      'On y construit des châteaux de sable.',
    ],
  },
  {
    theme: 'places',
    answer: 'le vétérinaire',
    clues: [
      'C’est un métier.',
      'Il soigne les animaux malades ou blessés.',
      'On l’emmène chez lui quand notre chat ne va pas bien.',
    ],
  },
  {
    theme: 'animals',
    answer: 'le lion',
    clues: [
      'Je suis un animal sauvage qui vit en Afrique.',
      'Les mâles ont une grande crinière autour de la tête.',
      'Je rugis et on m’appelle le roi des animaux.',
    ],
  },
  {
    theme: 'animals',
    answer: 'le canard',
    clues: [
      'Je suis un oiseau.',
      'J’ai un bec plat et des pattes palmées.',
      'Je nage sur la mare et je fais coin-coin.',
    ],
  },
  {
    theme: 'animals',
    answer: 'le cheval',
    clues: [
      'Je suis un animal que l’on trouve dans les fermes et les centres équestres.',
      'On peut monter sur mon dos avec une selle.',
      'J’ai une crinière, quatre sabots et je hennis.',
    ],
  },
  {
    theme: 'animals',
    answer: 'la girafe',
    clues: [
      'Je suis un animal sauvage qui vit en Afrique.',
      'J’ai des taches sur tout le corps.',
      'J’ai un cou très long pour manger les feuilles tout en haut des arbres.',
    ],
  },
  {
    theme: 'animals',
    answer: 'le papillon',
    clues: [
      'Je suis un insecte.',
      'Avant d’être ce que je suis, j’étais une chenille.',
      'J’ai de grandes ailes colorées et je butine les fleurs.',
    ],
  },
  {
    theme: 'objects',
    answer: 'le balai',
    clues: [
      'Je sers à faire le ménage.',
      'J’ai un long manche et des poils au bout.',
      'Avec moi, on ramasse la poussière sur le sol.',
    ],
  },
  {
    theme: 'objects',
    answer: 'le miroir',
    clues: [
      'On me trouve souvent dans la salle de bain.',
      'Je suis fait de verre et je suis très lisse.',
      'Quand on se regarde dans moi, on voit son visage.',
    ],
  },
  {
    theme: 'objects',
    answer: 'le téléphone',
    clues: [
      'Je suis un objet que l’on tient dans la main.',
      'Je sonne et je vibre.',
      'Grâce à moi, on peut parler avec quelqu’un qui est loin.',
    ],
  },
  {
    theme: 'objects',
    answer: 'le lit',
    clues: [
      'Je suis un meuble que l’on trouve dans une chambre.',
      'J’ai des draps, une couverture et un oreiller.',
      'On s’allonge sur moi pour dormir la nuit.',
    ],
  },
  {
    theme: 'objects',
    answer: 'le savon',
    clues: [
      'On me trouve près du lavabo.',
      'Je glisse facilement des mains.',
      'Je fais de la mousse pour se laver.',
    ],
  },
  {
    theme: 'places',
    answer: 'l’école',
    clues: [
      'C’est un lieu où l’on va presque tous les jours de la semaine.',
      'Il y a une cour de récréation et des classes.',
      'Les élèves y apprennent à lire et à compter avec leur maîtresse.',
    ],
  },
  {
    theme: 'places',
    answer: 'le zoo',
    clues: [
      'C’est un lieu que l’on visite en famille.',
      'Il faut acheter un billet pour y entrer.',
      'On y voit des lions, des girafes et des singes dans des enclos.',
    ],
  },
  {
    theme: 'places',
    answer: 'l’hôpital',
    clues: [
      'C’est un grand bâtiment.',
      'Les ambulances viennent y déposer des personnes.',
      'Des médecins et des infirmières y soignent les malades.',
    ],
  },
  {
    theme: 'places',
    answer: 'le cinéma',
    clues: [
      'C’est un lieu où l’on va pour se divertir.',
      'La salle est sombre et les fauteuils sont alignés.',
      'On y regarde un film sur un grand écran en mangeant du pop-corn.',
    ],
  },
  {
    theme: 'places',
    answer: 'la ferme',
    clues: [
      'C’est un lieu à la campagne.',
      'On y trouve des vaches, des poules et un tracteur.',
      'L’agriculteur y travaille avec ses animaux et ses champs.',
    ],
  },
]

export const THEMES = {
  animaux: 'Animaux',
  items: 'Objets du quotidien',
  monde: 'Aliments, lieux et métiers',
}
