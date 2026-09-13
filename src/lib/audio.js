/**
 * Banque de bruitages.
 *
 * Deux sources, dans cet ordre de priorité :
 *
 * 1. Un fichier audio déposé dans `public/sons/<id>.mp3`. Rien d'autre à
 *    faire : le fichier est détecté au premier usage, mis en cache, et
 *    remplace le son de synthèse. Voir `public/sons/README.md`.
 * 2. À défaut, un bruitage fabriqué par l'application (Web Audio). Aucun
 *    fichier n'est embarqué dans le dépôt : l'application reste légère et
 *    fonctionne hors ligne, au prix de sons stylisés.
 *
 * Le reste de l'application ne connaît que `SONS`, `jouerSuite` et
 * `prechargerSons` : la provenance du son ne change rien aux jeux.
 */

// --- Contexte audio ---------------------------------------------------

let contexte
let reverb

function ctx() {
  if (!contexte) {
    const AudioContexte = window.AudioContext || window.webkitAudioContext
    if (!AudioContexte) return null
    contexte = new AudioContexte()
  }
  // Les navigateurs suspendent le contexte tant qu'aucun geste n'a eu lieu.
  if (contexte.state === 'suspended') contexte.resume()
  return contexte
}

export function isAudioAvailable() {
  return typeof window !== 'undefined' && Boolean(window.AudioContext || window.webkitAudioContext)
}

/**
 * Petite réverbération : une réponse impulsionnelle synthétique suffit à
 * sortir les sons du rendu « bip de synthétiseur » en leur donnant une pièce.
 */
function reverbération(audio) {
  if (reverb) return reverb
  const duree = 1.1
  const longueur = Math.floor(audio.sampleRate * duree)
  const impulsion = audio.createBuffer(2, longueur, audio.sampleRate)
  for (let canal = 0; canal < 2; canal += 1) {
    const donnees = impulsion.getChannelData(canal)
    for (let i = 0; i < longueur; i += 1) {
      // Bruit qui décroît : réflexions de plus en plus faibles.
      donnees[i] = (Math.random() * 2 - 1) * (1 - i / longueur) ** 2.6
    }
  }
  const convolution = audio.createConvolver()
  convolution.buffer = impulsion
  const niveau = audio.createGain()
  niveau.gain.value = 0.22
  convolution.connect(niveau).connect(audio.destination)
  reverb = convolution
  return reverb
}

/** Sortie commune : un peu de pièce sur chaque son, pour les homogénéiser. */
function sortie(audio, source, { espace = 0.5 } = {}) {
  const direct = audio.createGain()
  direct.gain.value = 1
  source.connect(direct).connect(audio.destination)
  if (espace > 0) {
    const envoi = audio.createGain()
    envoi.gain.value = espace
    source.connect(envoi).connect(reverbération(audio))
  }
}

// --- Briques de synthèse ----------------------------------------------

/**
 * Partiel sinusoïdal avec enveloppe percussive. Un instrument réel sonne par
 * l'empilement de plusieurs partiels non harmoniques, d'où le paramètre
 * `rapport` utilisé par les cloches et le verre.
 */
function partiel(audio, { debut, duree, frequence, volume, glissando, type = 'sine', espace }) {
  const oscillateur = audio.createOscillator()
  const gain = audio.createGain()
  oscillateur.type = type
  oscillateur.frequency.setValueAtTime(frequence, debut)
  if (glissando) {
    oscillateur.frequency.exponentialRampToValueAtTime(Math.max(20, glissando), debut + duree)
  }
  gain.gain.setValueAtTime(0.0001, debut)
  gain.gain.exponentialRampToValueAtTime(volume, debut + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, debut + duree)
  oscillateur.connect(gain)
  sortie(audio, gain, { espace })
  oscillateur.start(debut)
  oscillateur.stop(debut + duree + 0.05)
}

/** Bruit filtré : tout ce qui n'est pas tonal (eau, souffle, chocs, foule). */
function bruit(audio, {
  debut,
  duree,
  frequence = 1200,
  q = 1,
  volume = 0.2,
  type = 'bandpass',
  attaque = 0.004,
  balayage,
}) {
  const echantillons = Math.max(1, Math.floor(audio.sampleRate * duree))
  const tampon = audio.createBuffer(1, echantillons, audio.sampleRate)
  const donnees = tampon.getChannelData(0)
  for (let i = 0; i < echantillons; i += 1) donnees[i] = Math.random() * 2 - 1

  const source = audio.createBufferSource()
  source.buffer = tampon
  const filtre = audio.createBiquadFilter()
  filtre.type = type
  filtre.frequency.setValueAtTime(frequence, debut)
  if (balayage) filtre.frequency.exponentialRampToValueAtTime(balayage, debut + duree)
  filtre.Q.value = q

  const gain = audio.createGain()
  gain.gain.setValueAtTime(0.0001, debut)
  gain.gain.linearRampToValueAtTime(volume, debut + attaque)
  gain.gain.exponentialRampToValueAtTime(0.0001, debut + duree)

  source.connect(filtre).connect(gain)
  sortie(audio, gain)
  source.start(debut)
  source.stop(debut + duree)
}

/** Corps métallique : partiels non harmoniques, longue extinction. */
function metal(audio, { debut, frequence, duree, volume = 0.14, rapports }) {
  rapports.forEach((rapport, index) => {
    partiel(audio, {
      debut,
      duree: duree * (1 - index * 0.12),
      frequence: frequence * rapport,
      volume: volume / (index + 1),
      espace: 0.8,
    })
  })
}

// --- Banque de sons ----------------------------------------------------

/**
 * Chaque entrée déclare son identifiant (qui sert aussi de nom de fichier
 * audio facultatif), son intitulé, le pictogramme de sa carte, sa durée
 * approximative et sa recette de synthèse.
 */
export const SONS = [
  {
    id: 'sonnette',
    label: 'la sonnette',
    picto: 'cloche',
    duree: 1.6,
    jouer: (audio, t) => {
      metal(audio, { debut: t, frequence: 784, duree: 1.1, rapports: [1, 2.01, 2.99, 4.2] })
      metal(audio, { debut: t + 0.42, frequence: 587, duree: 1.3, rapports: [1, 2.01, 2.99, 4.2] })
    },
  },
  {
    id: 'telephone',
    label: 'le téléphone',
    picto: 'telephone',
    duree: 1.7,
    jouer: (audio, t) => {
      // Deux salves de trilles, comme une sonnerie de téléphone fixe.
      for (const depart of [t, t + 0.95]) {
        for (let i = 0; i < 8; i += 1) {
          const debut = depart + i * 0.055
          partiel(audio, { debut, duree: 0.05, frequence: 1180, volume: 0.11, espace: 0.3 })
          partiel(audio, { debut, duree: 0.05, frequence: 1540, volume: 0.08, espace: 0.3 })
        }
      }
    },
  },
  {
    id: 'horloge',
    label: 'l’horloge',
    picto: 'montre',
    duree: 1.8,
    jouer: (audio, t) => {
      for (let i = 0; i < 5; i += 1) {
        const debut = t + i * 0.4
        // Tic plus clair que le tac : c'est ce contraste qui fait l'horloge.
        bruit(audio, {
          debut,
          duree: 0.035,
          frequence: i % 2 === 0 ? 3200 : 2100,
          q: 14,
          volume: 0.35,
          attaque: 0.001,
        })
      }
    },
  },
  {
    id: 'klaxon',
    label: 'le klaxon',
    picto: 'voiture',
    duree: 1.1,
    jouer: (audio, t) => {
      // Un klaxon est un accord de deux notes proches, plein d'harmoniques.
      for (const frequence of [370, 440]) {
        partiel(audio, { debut: t, duree: 0.85, frequence, volume: 0.1, type: 'sawtooth' })
        partiel(audio, { debut: t, duree: 0.85, frequence: frequence * 2, volume: 0.05, type: 'sawtooth' })
      }
    },
  },
  {
    id: 'eau',
    label: 'l’eau qui coule',
    picto: 'nuage',
    duree: 1.8,
    jouer: (audio, t) => {
      bruit(audio, {
        debut: t,
        duree: 1.6,
        frequence: 900,
        balayage: 1400,
        q: 0.8,
        volume: 0.13,
        attaque: 0.25,
      })
      // Quelques gouttes par-dessus le filet d'eau.
      for (const retard of [0.15, 0.62, 1.05, 1.35]) {
        partiel(audio, {
          debut: t + retard,
          duree: 0.16,
          frequence: 1400 + Math.random() * 700,
          glissando: 420,
          volume: 0.16,
          espace: 0.9,
        })
      }
    },
  },
  {
    id: 'verre',
    label: 'le verre qui tinte',
    picto: 'tasse',
    duree: 1.6,
    jouer: (audio, t) => {
      metal(audio, { debut: t, frequence: 2093, duree: 1.4, volume: 0.1, rapports: [1, 2.76, 5.4] })
    },
  },
  {
    id: 'tambour',
    label: 'le tambour',
    picto: 'tambour',
    duree: 1.3,
    jouer: (audio, t) => {
      for (let i = 0; i < 3; i += 1) {
        const debut = t + i * 0.32
        partiel(audio, { debut, duree: 0.3, frequence: 180, glissando: 55, volume: 0.4 })
        bruit(audio, { debut, duree: 0.18, frequence: 400, q: 0.6, volume: 0.18, type: 'lowpass' })
      }
    },
  },
  {
    id: 'sifflet',
    label: 'le sifflet',
    picto: 'sifflet',
    duree: 1.1,
    jouer: (audio, t) => {
      // Le souffle très résonant fait le sifflet ; le vibrato le rend vivant.
      bruit(audio, { debut: t, duree: 0.85, frequence: 2350, q: 22, volume: 0.4 })
      bruit(audio, { debut: t, duree: 0.85, frequence: 3900, q: 18, volume: 0.16 })
    },
  },
  {
    id: 'porte',
    label: 'les coups à la porte',
    picto: 'maison',
    duree: 1.2,
    jouer: (audio, t) => {
      for (const retard of [0, 0.3, 0.58]) {
        bruit(audio, {
          debut: t + retard,
          duree: 0.16,
          frequence: 220,
          balayage: 90,
          q: 1.6,
          volume: 0.45,
          attaque: 0.002,
        })
        partiel(audio, { debut: t + retard, duree: 0.14, frequence: 120, glissando: 60, volume: 0.2 })
      }
    },
  },
  {
    id: 'applaudissements',
    label: 'les applaudissements',
    picto: 'cadeau',
    duree: 1.7,
    jouer: (audio, t) => {
      // Une foule, c'est beaucoup de claquements courts répartis au hasard.
      for (let i = 0; i < 44; i += 1) {
        bruit(audio, {
          debut: t + Math.random() * 1.5,
          duree: 0.05,
          frequence: 1400 + Math.random() * 1800,
          q: 1.1,
          volume: 0.07 + Math.random() * 0.06,
          attaque: 0.001,
        })
      }
    },
  },
  {
    id: 'cloche',
    label: 'la cloche de l’église',
    picto: 'cloche',
    duree: 2.4,
    jouer: (audio, t) => {
      metal(audio, { debut: t, frequence: 420, duree: 2.2, volume: 0.16, rapports: [0.5, 1, 1.19, 2.4, 3.1] })
      metal(audio, { debut: t + 1.1, frequence: 420, duree: 1.8, volume: 0.12, rapports: [0.5, 1, 1.19, 2.4] })
    },
  },
  {
    id: 'moteur',
    label: 'le moteur',
    picto: 'voiture',
    duree: 1.8,
    jouer: (audio, t) => {
      const oscillateur = audio.createOscillator()
      const gain = audio.createGain()
      const filtre = audio.createBiquadFilter()
      oscillateur.type = 'sawtooth'
      oscillateur.frequency.setValueAtTime(52, t)
      oscillateur.frequency.linearRampToValueAtTime(78, t + 0.7)
      oscillateur.frequency.linearRampToValueAtTime(64, t + 1.6)
      filtre.type = 'lowpass'
      filtre.frequency.setValueAtTime(420, t)
      filtre.Q.value = 6
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.linearRampToValueAtTime(0.3, t + 0.15)
      gain.gain.setValueAtTime(0.3, t + 1.3)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.7)
      oscillateur.connect(filtre).connect(gain)
      sortie(audio, gain, { espace: 0.2 })
      oscillateur.start(t)
      oscillateur.stop(t + 1.8)
      bruit(audio, { debut: t, duree: 1.7, frequence: 300, q: 0.5, volume: 0.05, type: 'lowpass', attaque: 0.2 })
    },
  },
]

/** Les animaux n'ont pas de recette de synthèse crédible : voix ou fichier. */
export const ANIMAUX = [
  { id: 'chat', label: 'le chat', picto: 'chat' },
  { id: 'chien', label: 'le chien', picto: 'chien' },
  { id: 'oiseau', label: 'l’oiseau', picto: 'oiseau' },
  { id: 'vache', label: 'la vache', picto: 'vache' },
  { id: 'cheval', label: 'le cheval', picto: 'cheval' },
]

// --- Fichiers audio facultatifs ---------------------------------------

/** id -> AudioBuffer, ou `null` si aucun fichier n'accompagne ce son. */
const echantillons = new Map()

const chemin = (id) => `${import.meta.env.BASE_URL}sons/${id}.mp3`

/**
 * Cherche `public/sons/<id>.mp3`. L'absence de fichier est le cas normal :
 * on retient le résultat pour ne pas retenter à chaque manche.
 */
async function chargerEchantillon(id) {
  if (echantillons.has(id)) return echantillons.get(id)
  const audio = ctx()
  if (!audio) return null
  try {
    const reponse = await fetch(chemin(id))
    if (!reponse.ok) throw new Error('absent')
    const donnees = await reponse.arrayBuffer()
    const tampon = await audio.decodeAudioData(donnees)
    echantillons.set(id, tampon)
    return tampon
  } catch {
    echantillons.set(id, null)
    return null
  }
}

/** Vrai si un fichier audio accompagne ce son (après préchargement). */
export function aUnEnregistrement(id) {
  return Boolean(echantillons.get(id))
}

/** Charge à l'avance les fichiers d'une liste de sons, si présents. */
export async function prechargerSons(sons) {
  await Promise.all(sons.map((son) => chargerEchantillon(son.id)))
}

function jouerEchantillon(audio, tampon, debut) {
  const source = audio.createBufferSource()
  source.buffer = tampon
  sortie(audio, source, { espace: 0.15 })
  source.start(debut)
  return tampon.duration
}

/**
 * Joue une suite de sons, espacés de `intervalle` secondes.
 * Renvoie la durée totale en secondes, ou 0 si l'audio est indisponible.
 */
export function jouerSuite(sons, { intervalle = 0.45 } = {}) {
  const audio = ctx()
  if (!audio) return 0
  let curseur = audio.currentTime + 0.15
  for (const son of sons) {
    const tampon = echantillons.get(son.id)
    if (tampon) {
      curseur += jouerEchantillon(audio, tampon, curseur) + intervalle
    } else if (son.jouer) {
      son.jouer(audio, curseur)
      curseur += son.duree + intervalle
    }
  }
  return curseur - audio.currentTime
}

/** Réveille le contexte audio sur un geste de l'utilisateur. */
export function preparerAudio() {
  ctx()
}
