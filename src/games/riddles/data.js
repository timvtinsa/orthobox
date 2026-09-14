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
]

export const THEMES = {
  animaux: 'Animaux',
  items: 'Objets du quotidien',
  monde: 'Aliments, lieux et métiers',
}
