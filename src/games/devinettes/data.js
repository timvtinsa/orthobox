/**
 * Devinettes à indices progressifs : du plus général (catégorie, fonction)
 * au plus spécifique. La réponse reste cachée tant que le praticien ne la
 * dévoile pas.
 */
export const DEVINETTES = [
  // --- Animaux ---
  {
    theme: 'animaux',
    reponse: 'le chat',
    indices: [
      'Je suis un animal domestique.',
      'Je miaule et je fais ma toilette avec ma langue.',
      'Je dors souvent sur le canapé.',
    ],
  },
  {
    theme: 'animaux',
    reponse: 'la vache',
    indices: [
      'Je suis un animal de la ferme.',
      'Je broute de l’herbe dans le pré.',
      'On fait du fromage avec le lait que je donne.',
    ],
  },
  {
    theme: 'animaux',
    reponse: 'l’abeille',
    indices: [
      'Je suis un tout petit animal qui vole.',
      'Je vis dans une ruche avec des milliers d’autres.',
      'Je fabrique du miel.',
    ],
  },
  {
    theme: 'animaux',
    reponse: 'le kangourou',
    indices: [
      'Je suis un animal qui vit en Australie.',
      'Je me déplace en faisant de grands bonds.',
      'Je transporte mon petit dans une poche sur mon ventre.',
    ],
  },
  {
    theme: 'animaux',
    reponse: 'l’escargot',
    indices: [
      'Je suis un petit animal très lent.',
      'Je sors surtout quand il pleut.',
      'Je porte ma maison sur mon dos.',
    ],
  },
  {
    theme: 'animaux',
    reponse: 'le hibou',
    indices: [
      'Je suis un oiseau.',
      'Je dors le jour et je chasse la nuit.',
      'Je peux tourner la tête presque complètement.',
    ],
  },
  {
    theme: 'animaux',
    reponse: 'le dauphin',
    indices: [
      'Je vis dans la mer.',
      'Je ne suis pas un poisson : je remonte respirer à la surface.',
      'Je saute hors de l’eau et on dit que je suis très intelligent.',
    ],
  },
  {
    theme: 'animaux',
    reponse: 'l’écureuil',
    indices: [
      'Je vis dans la forêt.',
      'Je grimpe aux arbres avec ma grande queue touffue.',
      'Je cache des noisettes pour l’hiver.',
    ],
  },

  // --- Objets du quotidien ---
  {
    theme: 'objets',
    reponse: 'le parapluie',
    indices: [
      'On me sort seulement quand il fait mauvais.',
      'Je m’ouvre et je me ferme.',
      'Je protège de la pluie.',
    ],
  },
  {
    theme: 'objets',
    reponse: 'la brosse à dents',
    indices: [
      'On m’utilise au moins deux fois par jour.',
      'Je suis rangée dans la salle de bain.',
      'On met du dentifrice sur moi.',
    ],
  },
  {
    theme: 'objets',
    reponse: 'les ciseaux',
    indices: [
      'Je suis un objet en métal.',
      'J’ai deux trous pour les doigts.',
      'Je sers à découper le papier.',
    ],
  },
  {
    theme: 'objets',
    reponse: 'le réfrigérateur',
    indices: [
      'Je suis dans la cuisine.',
      'Je suis grand et je ronronne doucement.',
      'Je garde les aliments au froid.',
    ],
  },
  {
    theme: 'objets',
    reponse: 'la clé',
    indices: [
      'Je suis toute petite et en métal.',
      'On me range dans une poche ou un sac.',
      'Je sers à ouvrir la porte.',
    ],
  },
  {
    theme: 'objets',
    reponse: 'l’aspirateur',
    indices: [
      'Je suis un appareil électrique.',
      'Je fais beaucoup de bruit.',
      'Je ramasse la poussière par terre.',
    ],
  },
  {
    theme: 'objets',
    reponse: 'le réveil',
    indices: [
      'Je suis souvent posé près du lit.',
      'J’affiche des chiffres.',
      'Je sonne le matin pour réveiller.',
    ],
  },
  {
    theme: 'objets',
    reponse: 'le crayon',
    indices: [
      'On me tient dans la main.',
      'Je suis en bois avec une mine au bout.',
      'On peut gommer ce que j’écris.',
    ],
  },

  // --- Aliments, lieux et métiers ---
  {
    theme: 'monde',
    reponse: 'la banane',
    indices: [
      'Je suis un fruit.',
      'Je suis jaune et allongée.',
      'On enlève ma peau avant de me manger.',
    ],
  },
  {
    theme: 'monde',
    reponse: 'la boulangerie',
    indices: [
      'C’est un magasin du quartier.',
      'Ça sent très bon le matin.',
      'On y achète le pain et les croissants.',
    ],
  },
  {
    theme: 'monde',
    reponse: 'le facteur',
    indices: [
      'C’est un métier.',
      'On travaille dehors, souvent le matin.',
      'On distribue le courrier dans les boîtes aux lettres.',
    ],
  },
  {
    theme: 'monde',
    reponse: 'la piscine',
    indices: [
      'C’est un endroit où on va parfois le week-end.',
      'On met un maillot de bain pour y aller.',
      'On y nage dans une grande eau bleue.',
    ],
  },
  {
    theme: 'monde',
    reponse: 'le dentiste',
    indices: [
      'C’est quelqu’un qu’on va voir quand on a mal.',
      'On s’allonge sur un fauteuil et on ouvre grand la bouche.',
      'Il soigne les dents.',
    ],
  },
  {
    theme: 'monde',
    reponse: 'la neige',
    indices: [
      'J’arrive surtout en hiver.',
      'Je suis blanche et froide.',
      'On fait des bonshommes avec moi.',
    ],
  },
  {
    theme: 'monde',
    reponse: 'la bibliothèque',
    indices: [
      'C’est un endroit calme.',
      'On y parle à voix basse.',
      'On y emprunte des livres.',
    ],
  },
  {
    theme: 'monde',
    reponse: 'le pompier',
    indices: [
      'C’est un métier.',
      'On porte un casque et on roule dans un camion rouge.',
      'On éteint les incendies.',
    ],
  },
]

export const THEMES = {
  animaux: 'Animaux',
  objets: 'Objets du quotidien',
  monde: 'Aliments, lieux et métiers',
}
