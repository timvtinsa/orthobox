/**
 * Bruitages de synthèse (Web Audio API).
 *
 * Le dépôt n'embarque aucun fichier son : les bruits sont fabriqués par
 * oscillateurs et bruit filtré, ce qui garde l'application légère et
 * fonctionnelle hors ligne. Ils sont stylisés — reconnaissables à l'usage,
 * mais ce ne sont pas des enregistrements.
 *
 * Pour brancher de vrais enregistrements plus tard, il suffit d'ajouter à une
 * entrée de `SONS` un champ `fichier` et de le charger ici : le reste du jeu
 * (cartes, ordre, score) n'a pas à changer.
 */
let contexte

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

/** Note simple : une onde, avec attaque douce et extinction exponentielle. */
function note(audio, { debut, duree, frequence, type = 'sine', volume = 0.22, glissando }) {
  const oscillateur = audio.createOscillator()
  const gain = audio.createGain()
  oscillateur.type = type
  oscillateur.frequency.setValueAtTime(frequence, debut)
  if (glissando) oscillateur.frequency.exponentialRampToValueAtTime(glissando, debut + duree)
  gain.gain.setValueAtTime(0.0001, debut)
  gain.gain.exponentialRampToValueAtTime(volume, debut + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, debut + duree)
  oscillateur.connect(gain).connect(audio.destination)
  oscillateur.start(debut)
  oscillateur.stop(debut + duree + 0.05)
}

/** Bruit filtré : sert aux sons non tonals (eau, souffle, percussion). */
function bruit(audio, { debut, duree, frequence = 1200, q = 1, volume = 0.2, type = 'bandpass' }) {
  const echantillons = Math.max(1, Math.floor(audio.sampleRate * duree))
  const tampon = audio.createBuffer(1, echantillons, audio.sampleRate)
  const donnees = tampon.getChannelData(0)
  for (let i = 0; i < echantillons; i += 1) donnees[i] = Math.random() * 2 - 1
  const source = audio.createBufferSource()
  source.buffer = tampon
  const filtre = audio.createBiquadFilter()
  filtre.type = type
  filtre.frequency.setValueAtTime(frequence, debut)
  filtre.Q.value = q
  const gain = audio.createGain()
  gain.gain.setValueAtTime(volume, debut)
  gain.gain.exponentialRampToValueAtTime(0.0001, debut + duree)
  source.connect(filtre).connect(gain).connect(audio.destination)
  source.start(debut)
  source.stop(debut + duree)
}

/**
 * Banque de bruitages. Chaque entrée sait se jouer à un instant donné et
 * déclare le pictogramme qui la représente sur les cartes.
 */
export const SONS = [
  {
    id: 'sonnette',
    label: 'la sonnette',
    picto: 'cloche',
    duree: 1.1,
    jouer: (audio, t) => {
      note(audio, { debut: t, duree: 0.5, frequence: 784, type: 'triangle' })
      note(audio, { debut: t + 0.35, duree: 0.7, frequence: 587, type: 'triangle' })
    },
  },
  {
    id: 'telephone',
    label: 'le téléphone',
    picto: 'telephone',
    duree: 1.2,
    jouer: (audio, t) => {
      for (let i = 0; i < 4; i += 1) {
        const debut = t + i * 0.12
        note(audio, { debut, duree: 0.09, frequence: 1100, type: 'square', volume: 0.14 })
      }
      for (let i = 0; i < 4; i += 1) {
        const debut = t + 0.6 + i * 0.12
        note(audio, { debut, duree: 0.09, frequence: 1100, type: 'square', volume: 0.14 })
      }
    },
  },
  {
    id: 'horloge',
    label: 'l’horloge',
    picto: 'montre',
    duree: 1.4,
    jouer: (audio, t) => {
      for (let i = 0; i < 4; i += 1) {
        bruit(audio, {
          debut: t + i * 0.35,
          duree: 0.05,
          frequence: i % 2 === 0 ? 2600 : 1900,
          q: 12,
          volume: 0.3,
        })
      }
    },
  },
  {
    id: 'klaxon',
    label: 'le klaxon',
    picto: 'voiture',
    duree: 0.9,
    jouer: (audio, t) => {
      note(audio, { debut: t, duree: 0.75, frequence: 370, type: 'sawtooth', volume: 0.12 })
      note(audio, { debut: t, duree: 0.75, frequence: 440, type: 'sawtooth', volume: 0.12 })
    },
  },
  {
    id: 'goutte',
    label: 'la goutte d’eau',
    picto: 'nuage',
    duree: 0.8,
    jouer: (audio, t) => {
      note(audio, {
        debut: t,
        duree: 0.28,
        frequence: 1500,
        glissando: 500,
        type: 'sine',
        volume: 0.3,
      })
      note(audio, {
        debut: t + 0.4,
        duree: 0.22,
        frequence: 1200,
        glissando: 420,
        type: 'sine',
        volume: 0.2,
      })
    },
  },
  {
    id: 'verre',
    label: 'le verre qui tinte',
    picto: 'tasse',
    duree: 1.2,
    jouer: (audio, t) => {
      note(audio, { debut: t, duree: 1.1, frequence: 2093, type: 'sine', volume: 0.16 })
      note(audio, { debut: t, duree: 0.7, frequence: 3136, type: 'sine', volume: 0.08 })
    },
  },
  {
    id: 'tambour',
    label: 'le tambour',
    picto: 'tambour',
    duree: 1.1,
    jouer: (audio, t) => {
      for (let i = 0; i < 3; i += 1) {
        const debut = t + i * 0.3
        note(audio, {
          debut,
          duree: 0.22,
          frequence: 160,
          glissando: 60,
          type: 'sine',
          volume: 0.4,
        })
        bruit(audio, { debut, duree: 0.12, frequence: 300, q: 0.7, volume: 0.14, type: 'lowpass' })
      }
    },
  },
  {
    id: 'sifflet',
    label: 'le sifflet',
    picto: 'sifflet',
    duree: 0.9,
    jouer: (audio, t) => {
      note(audio, { debut: t, duree: 0.7, frequence: 2300, type: 'sine', volume: 0.1 })
      bruit(audio, { debut: t, duree: 0.7, frequence: 2400, q: 18, volume: 0.35 })
    },
  },
]

export const ANIMAUX = [
  { id: 'chat', label: 'le chat', picto: 'chat' },
  { id: 'chien', label: 'le chien', picto: 'chien' },
  { id: 'oiseau', label: 'l’oiseau', picto: 'oiseau' },
  { id: 'vache', label: 'la vache', picto: 'vache' },
  { id: 'cheval', label: 'le cheval', picto: 'cheval' },
]

/**
 * Joue une suite de bruitages, espacés de `intervalle` secondes.
 * Renvoie la durée totale, ou 0 si l'audio n'est pas disponible.
 */
export function jouerSuite(sons, { intervalle = 0.45 } = {}) {
  const audio = ctx()
  if (!audio) return 0
  let curseur = audio.currentTime + 0.15
  for (const son of sons) {
    son.jouer(audio, curseur)
    curseur += son.duree + intervalle
  }
  return curseur - audio.currentTime
}

/** Réveille le contexte audio sur un geste de l'utilisateur. */
export function preparerAudio() {
  ctx()
}
