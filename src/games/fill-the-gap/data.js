/**
 * Sentences to complete, split into three series.
 *
 * Each item accepts a single correct answer: the distractors are valid words
 * on their own but wrong in this precise context, so the correction never
 * becomes a matter of opinion during a session.
 */
export const PHRASES = {
  meaning: [
    { before: 'Le boulanger sort le pain du', after: '.', answer: 'four', distractors: ['frigo', 'tiroir', 'placard'] },
    { before: 'Comme il pleuvait, Léa a ouvert son', after: '.', answer: 'parapluie', distractors: ['éventail', 'cartable', 'arrosoir'] },
    { before: 'Pour écrire son nom, Nina prend un', after: '.', answer: 'crayon', distractors: ['marteau', 'verre', 'coussin'] },
    { before: 'Le facteur dépose le courrier dans la', after: '.', answer: 'boîte aux lettres', distractors: ['poubelle', 'casserole', 'valise'] },
    { before: 'En hiver, quand il fait très froid, il tombe de la', after: '.', answer: 'neige', distractors: ['poussière', 'farine', 'fumée'] },
    { before: 'Pour découper le papier, Tom utilise des', after: '.', answer: 'ciseaux', distractors: ['lunettes', 'chaussettes', 'cuillères'] },
    { before: 'Le médecin écoute le cœur avec son', after: '.', answer: 'stéthoscope', distractors: ['téléphone', 'marteau', 'pinceau'] },
    { before: 'Nous avons planté des fleurs dans le', after: '.', answer: 'jardin', distractors: ['grenier', 'four', 'congélateur'] },
    { before: 'Le train entre en gare et s’arrête le long du', after: '.', answer: 'quai', distractors: ['trottoir', 'balcon', 'plafond'] },
    { before: 'Avant de traverser, on regarde des deux côtés de la', after: '.', answer: 'rue', distractors: ['cuisine', 'armoire', 'rivière'] },
  ],
  connectors: [
    { before: 'Voici la fille', after: 'habite en face.', answer: 'qui', distractors: ['que', 'dont', 'où'] },
    { before: 'Le livre', after: 'je t’ai parlé est passionnant.', answer: 'dont', distractors: ['que', 'qui', 'où'] },
    { before: 'C’est la ville', after: 'je suis né.', answer: 'où', distractors: ['que', 'qui', 'dont'] },
    { before: 'Elle mange la pomme', after: 'elle a lavée.', answer: 'qu’', distractors: ['qui', 'dont', 'où'] },
    { before: 'Il a enfin réussi', after: 'ouvrir la porte.', answer: 'à', distractors: ['de', 'par', 'en'] },
    { before: 'J’ai vraiment besoin', after: 'ton aide.', answer: 'de', distractors: ['à', 'par', 'pour'] },
    { before: 'Nous partons', after: 'Espagne cet été.', answer: 'en', distractors: ['au', 'à', 'dans'] },
    { before: 'Le train part', after: 'dix minutes.', answer: 'dans', distractors: ['depuis', 'pendant', 'il y a'] },
    { before: 'Il révise', after: 'd’être reçu à son examen.', answer: 'afin', distractors: ['bien', 'parce', 'pour que'] },
    { before: 'Elle est absente', after: 'elle est malade.', answer: 'parce qu’', distractors: ['afin qu’', 'bien qu’', 'pour qu’'] },
  ],
  agreement: [
    { before: 'Les enfants', after: 'dans la cour.', answer: 'jouent', distractors: ['joue', 'jouez', 'jouons'] },
    { before: 'La petite fille', after: 'heureuse.', answer: 'est', distractors: ['sont', 'es', 'êtes'] },
    { before: 'Mes chaussures sont toutes', after: '.', answer: 'neuves', distractors: ['neuf', 'neuve', 'neufs'] },
    { before: 'Ils', after: 'partis très tôt ce matin.', answer: 'sont', distractors: ['ont', 'est', 'a'] },
    { before: 'Elle a', after: 'une lettre à sa tante.', answer: 'écrit', distractors: ['écrite', 'écrits', 'écrites'] },
    { before: 'Les fleurs que j’ai', after: 'sont déjà fanées.', answer: 'cueillies', distractors: ['cueilli', 'cueillie', 'cueillis'] },
    { before: 'Tu', after: 'ton manteau avant de sortir.', answer: 'mets', distractors: ['met', 'mettent', 'mettes'] },
    { before: 'Nous', after: 'au cinéma hier soir.', answer: 'sommes allés', distractors: ['est allé', 'sont allés', 'avons allé'] },
    { before: 'Ce sont des livres très', after: '.', answer: 'intéressants', distractors: ['intéressant', 'intéressante', 'intéressantes'] },
    { before: 'Chaque élève', after: 'son cahier.', answer: 'apporte', distractors: ['apportent', 'apportes', 'apporter'] },
  ],
}

export const SERIES = {
  meaning: 'Sens de la phrase',
  connectors: 'Mots de liaison',
  agreement: 'Accords',
}
