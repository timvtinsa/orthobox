/**
 * Phrases à compléter, réparties en trois séries.
 *
 * Chaque item n'admet qu'une seule réponse correcte : les distracteurs sont
 * possibles dans la langue mais faux dans ce contexte précis, pour que la
 * correction ne prête pas à discussion en séance.
 */
export const PHRASES = {
  sens: [
    { avant: 'Le boulanger sort le pain du', apres: '.', reponse: 'four', leurres: ['frigo', 'tiroir', 'placard'] },
    { avant: 'Comme il pleuvait, Léa a ouvert son', apres: '.', reponse: 'parapluie', leurres: ['éventail', 'cartable', 'arrosoir'] },
    { avant: 'Pour écrire son nom, Nina prend un', apres: '.', reponse: 'crayon', leurres: ['marteau', 'verre', 'coussin'] },
    { avant: 'Le facteur dépose le courrier dans la', apres: '.', reponse: 'boîte aux lettres', leurres: ['poubelle', 'casserole', 'valise'] },
    { avant: 'En hiver, quand il fait très froid, il tombe de la', apres: '.', reponse: 'neige', leurres: ['poussière', 'farine', 'fumée'] },
    { avant: 'Pour découper le papier, Tom utilise des', apres: '.', reponse: 'ciseaux', leurres: ['lunettes', 'chaussettes', 'cuillères'] },
    { avant: 'Le médecin écoute le cœur avec son', apres: '.', reponse: 'stéthoscope', leurres: ['téléphone', 'marteau', 'pinceau'] },
    { avant: 'Nous avons planté des fleurs dans le', apres: '.', reponse: 'jardin', leurres: ['grenier', 'four', 'congélateur'] },
    { avant: 'Le train entre en gare et s’arrête le long du', apres: '.', reponse: 'quai', leurres: ['trottoir', 'balcon', 'plafond'] },
    { avant: 'Avant de traverser, on regarde des deux côtés de la', apres: '.', reponse: 'rue', leurres: ['cuisine', 'armoire', 'rivière'] },
  ],
  grammaire: [
    { avant: 'Voici la fille', apres: 'habite en face.', reponse: 'qui', leurres: ['que', 'dont', 'où'] },
    { avant: 'Le livre', apres: 'je t’ai parlé est passionnant.', reponse: 'dont', leurres: ['que', 'qui', 'où'] },
    { avant: 'C’est la ville', apres: 'je suis né.', reponse: 'où', leurres: ['que', 'qui', 'dont'] },
    { avant: 'Elle mange la pomme', apres: 'elle a lavée.', reponse: 'qu’', leurres: ['qui', 'dont', 'où'] },
    { avant: 'Il a enfin réussi', apres: 'ouvrir la porte.', reponse: 'à', leurres: ['de', 'par', 'en'] },
    { avant: 'J’ai vraiment besoin', apres: 'ton aide.', reponse: 'de', leurres: ['à', 'par', 'pour'] },
    { avant: 'Nous partons', apres: 'Espagne cet été.', reponse: 'en', leurres: ['au', 'à', 'dans'] },
    { avant: 'Le train part', apres: 'dix minutes.', reponse: 'dans', leurres: ['depuis', 'pendant', 'il y a'] },
    { avant: 'Il révise', apres: 'd’être reçu à son examen.', reponse: 'afin', leurres: ['bien', 'parce', 'pour que'] },
    { avant: 'Elle est absente', apres: 'elle est malade.', reponse: 'parce qu’', leurres: ['afin qu’', 'bien qu’', 'pour qu’'] },
  ],
  accord: [
    { avant: 'Les enfants', apres: 'dans la cour.', reponse: 'jouent', leurres: ['joue', 'jouez', 'jouons'] },
    { avant: 'La petite fille', apres: 'heureuse.', reponse: 'est', leurres: ['sont', 'es', 'êtes'] },
    { avant: 'Mes chaussures sont toutes', apres: '.', reponse: 'neuves', leurres: ['neuf', 'neuve', 'neufs'] },
    { avant: 'Ils', apres: 'partis très tôt ce matin.', reponse: 'sont', leurres: ['ont', 'est', 'a'] },
    { avant: 'Elle a', apres: 'une lettre à sa tante.', reponse: 'écrit', leurres: ['écrite', 'écrits', 'écrites'] },
    { avant: 'Les fleurs que j’ai', apres: 'sont déjà fanées.', reponse: 'cueillies', leurres: ['cueilli', 'cueillie', 'cueillis'] },
    { avant: 'Tu', apres: 'ton manteau avant de sortir.', reponse: 'mets', leurres: ['met', 'mettent', 'mettes'] },
    { avant: 'Nous', apres: 'au cinéma hier soir.', reponse: 'sommes allés', leurres: ['est allé', 'sont allés', 'avons allé'] },
    { avant: 'Ce sont des livres très', apres: '.', reponse: 'intéressants', leurres: ['intéressant', 'intéressante', 'intéressantes'] },
    { avant: 'Chaque élève', apres: 'son cahier.', reponse: 'apporte', leurres: ['apportent', 'apportes', 'apporter'] },
  ],
}

export const SERIES = {
  sens: 'Sens de la phrase',
  grammaire: 'Mots de liaison',
  accord: 'Accords',
}
