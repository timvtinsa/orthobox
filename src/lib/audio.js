/**
 * Sound bank.
 *
 * Two sources, in order of priority:
 *
 * 1. An audio file dropped into `public/sounds/<id>.mp3`. Nothing else to do:
 *    the file is detected on first use, cached, and replaces the synthesised
 *    sound. See `public/sounds/README.md`.
 * 2. Otherwise, a sound effect built by the application (Web Audio). No audio
 *    file ships with the repository: the application stays small and works
 *    offline, at the cost of stylised sounds.
 *
 * The rest of the application only knows about `SOUNDS`, `playSequence` and
 * `preloadSounds`: where a sound comes from makes no difference to the games.
 */

// --- Audio context ----------------------------------------------------

let context
let reverb

function ctx() {
  if (!context) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext
    if (!AudioCtor) return null
    context = new AudioCtor()
  }
  // Browsers keep the context suspended until a user gesture happens.
  if (context.state === 'suspended') context.resume()
  return context
}

export function isAudioAvailable() {
  return typeof window !== 'undefined' && Boolean(window.AudioContext || window.webkitAudioContext)
}

/**
 * A small reverb: a synthetic impulse response is enough to pull the sounds
 * out of the "synthesiser beep" register by placing them in a room.
 */
function reverbNode(audio) {
  if (reverb) return reverb
  const duration = 1.1
  const length = Math.floor(audio.sampleRate * duration)
  const impulse = audio.createBuffer(2, length, audio.sampleRate)
  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel)
    for (let i = 0; i < length; i += 1) {
      // Decaying noise: reflections fade out over time.
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.6
    }
  }
  const convolver = audio.createConvolver()
  convolver.buffer = impulse
  const level = audio.createGain()
  level.gain.value = 0.22
  convolver.connect(level).connect(audio.destination)
  reverb = convolver
  return reverb
}

/** Shared output: a touch of room on every sound, to even them out. */
function output(audio, source, { room = 0.5 } = {}) {
  const dry = audio.createGain()
  dry.gain.value = 1
  source.connect(dry).connect(audio.destination)
  if (room > 0) {
    const send = audio.createGain()
    send.gain.value = room
    source.connect(send).connect(reverbNode(audio))
  }
}

// --- Synthesis building blocks ----------------------------------------

/**
 * A sine partial with a percussive envelope. Real instruments sound through a
 * stack of inharmonic partials, hence the `ratios` parameter used by the
 * bells and the glass.
 */
function partial(audio, { start, duration, frequency, volume, glide, type = 'sine', room }) {
  const oscillator = audio.createOscillator()
  const gain = audio.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  if (glide) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, glide), start + duration)
  }
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain)
  output(audio, gain, { room })
  oscillator.start(start)
  oscillator.stop(start + duration + 0.05)
}

/** Filtered noise: everything that is not tonal (water, air, knocks, crowd). */
function noise(audio, {
  start,
  duration,
  frequency = 1200,
  q = 1,
  volume = 0.2,
  type = 'bandpass',
  attack = 0.004,
  sweep,
}) {
  const samples = Math.max(1, Math.floor(audio.sampleRate * duration))
  const buffer = audio.createBuffer(1, samples, audio.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < samples; i += 1) data[i] = Math.random() * 2 - 1

  const source = audio.createBufferSource()
  source.buffer = buffer
  const filter = audio.createBiquadFilter()
  filter.type = type
  filter.frequency.setValueAtTime(frequency, start)
  if (sweep) filter.frequency.exponentialRampToValueAtTime(sweep, start + duration)
  filter.Q.value = q

  const gain = audio.createGain()
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.linearRampToValueAtTime(volume, start + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  source.connect(filter).connect(gain)
  output(audio, gain)
  source.start(start)
  source.stop(start + duration)
}

/** Metallic body: inharmonic partials with a long decay. */
function metal(audio, { start, frequency, duration, volume = 0.14, ratios }) {
  ratios.forEach((ratio, index) => {
    partial(audio, {
      start,
      duration: duration * (1 - index * 0.12),
      frequency: frequency * ratio,
      volume: volume / (index + 1),
      room: 0.8,
    })
  })
}

// --- Sound bank -------------------------------------------------------

/**
 * Each entry declares its identifier (which doubles as the optional audio
 * file name), the label shown to the patient, the pictogram of its card, an
 * approximate duration and its synthesis recipe.
 */
export const SOUNDS = [
  {
    id: 'doorbell',
    label: 'la sonnette',
    pictogram: 'bell',
    duration: 1.6,
    play: (audio, t) => {
      metal(audio, { start: t, frequency: 784, duration: 1.1, ratios: [1, 2.01, 2.99, 4.2] })
      metal(audio, { start: t + 0.42, frequency: 587, duration: 1.3, ratios: [1, 2.01, 2.99, 4.2] })
    },
  },
  {
    id: 'phone',
    label: 'le téléphone',
    pictogram: 'phone',
    duration: 1.7,
    play: (audio, t) => {
      // Two bursts of trills, like a landline ringing.
      for (const burst of [t, t + 0.95]) {
        for (let i = 0; i < 8; i += 1) {
          const start = burst + i * 0.055
          partial(audio, { start, duration: 0.05, frequency: 1180, volume: 0.11, room: 0.3 })
          partial(audio, { start, duration: 0.05, frequency: 1540, volume: 0.08, room: 0.3 })
        }
      }
    },
  },
  {
    id: 'clock',
    label: 'l’horloge',
    pictogram: 'watch',
    duration: 1.8,
    play: (audio, t) => {
      for (let i = 0; i < 5; i += 1) {
        // The tick is brighter than the tock: that contrast makes the clock.
        noise(audio, {
          start: t + i * 0.4,
          duration: 0.035,
          frequency: i % 2 === 0 ? 3200 : 2100,
          q: 14,
          volume: 0.35,
          attack: 0.001,
        })
      }
    },
  },
  {
    id: 'horn',
    label: 'le klaxon',
    pictogram: 'car',
    duration: 1.1,
    play: (audio, t) => {
      // A car horn is a chord of two close notes, rich in harmonics.
      for (const frequency of [370, 440]) {
        partial(audio, { start: t, duration: 0.85, frequency, volume: 0.1, type: 'sawtooth' })
        partial(audio, { start: t, duration: 0.85, frequency: frequency * 2, volume: 0.05, type: 'sawtooth' })
      }
    },
  },
  {
    id: 'water',
    label: 'l’eau qui coule',
    pictogram: 'cloud',
    duration: 1.8,
    play: (audio, t) => {
      noise(audio, {
        start: t,
        duration: 1.6,
        frequency: 900,
        sweep: 1400,
        q: 0.8,
        volume: 0.13,
        attack: 0.25,
      })
      // A few drops on top of the running water.
      for (const delay of [0.15, 0.62, 1.05, 1.35]) {
        partial(audio, {
          start: t + delay,
          duration: 0.16,
          frequency: 1400 + Math.random() * 700,
          glide: 420,
          volume: 0.16,
          room: 0.9,
        })
      }
    },
  },
  {
    id: 'glass',
    label: 'le verre qui tinte',
    pictogram: 'cup',
    duration: 1.6,
    play: (audio, t) => {
      metal(audio, { start: t, frequency: 2093, duration: 1.4, volume: 0.1, ratios: [1, 2.76, 5.4] })
    },
  },
  {
    id: 'drum',
    label: 'le tambour',
    pictogram: 'drum',
    duration: 1.3,
    play: (audio, t) => {
      for (let i = 0; i < 3; i += 1) {
        const start = t + i * 0.32
        partial(audio, { start, duration: 0.3, frequency: 180, glide: 55, volume: 0.4 })
        noise(audio, { start, duration: 0.18, frequency: 400, q: 0.6, volume: 0.18, type: 'lowpass' })
      }
    },
  },
  {
    id: 'whistle',
    label: 'le sifflet',
    pictogram: 'whistle',
    duration: 1.1,
    play: (audio, t) => {
      // Highly resonant breath is what makes a whistle sound like one.
      noise(audio, { start: t, duration: 0.85, frequency: 2350, q: 22, volume: 0.4 })
      noise(audio, { start: t, duration: 0.85, frequency: 3900, q: 18, volume: 0.16 })
    },
  },
  {
    id: 'knock',
    label: 'les coups à la porte',
    pictogram: 'house',
    duration: 1.2,
    play: (audio, t) => {
      for (const delay of [0, 0.3, 0.58]) {
        noise(audio, {
          start: t + delay,
          duration: 0.16,
          frequency: 220,
          sweep: 90,
          q: 1.6,
          volume: 0.45,
          attack: 0.002,
        })
        partial(audio, { start: t + delay, duration: 0.14, frequency: 120, glide: 60, volume: 0.2 })
      }
    },
  },
  {
    id: 'applause',
    label: 'les applaudissements',
    pictogram: 'gift',
    duration: 1.7,
    play: (audio, t) => {
      // A crowd is many short claps scattered at random.
      for (let i = 0; i < 44; i += 1) {
        noise(audio, {
          start: t + Math.random() * 1.5,
          duration: 0.05,
          frequency: 1400 + Math.random() * 1800,
          q: 1.1,
          volume: 0.07 + Math.random() * 0.06,
          attack: 0.001,
        })
      }
    },
  },
  {
    id: 'bell',
    label: 'la cloche de l’église',
    pictogram: 'bell',
    duration: 2.4,
    play: (audio, t) => {
      metal(audio, { start: t, frequency: 420, duration: 2.2, volume: 0.16, ratios: [0.5, 1, 1.19, 2.4, 3.1] })
      metal(audio, { start: t + 1.1, frequency: 420, duration: 1.8, volume: 0.12, ratios: [0.5, 1, 1.19, 2.4] })
    },
  },
  {
    id: 'engine',
    label: 'le moteur',
    pictogram: 'car',
    duration: 1.8,
    play: (audio, t) => {
      const oscillator = audio.createOscillator()
      const gain = audio.createGain()
      const filter = audio.createBiquadFilter()
      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(52, t)
      oscillator.frequency.linearRampToValueAtTime(78, t + 0.7)
      oscillator.frequency.linearRampToValueAtTime(64, t + 1.6)
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(420, t)
      filter.Q.value = 6
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.linearRampToValueAtTime(0.3, t + 0.15)
      gain.gain.setValueAtTime(0.3, t + 1.3)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.7)
      oscillator.connect(filter).connect(gain)
      output(audio, gain, { room: 0.2 })
      oscillator.start(t)
      oscillator.stop(t + 1.8)
      noise(audio, { start: t, duration: 1.7, frequency: 300, q: 0.5, volume: 0.05, type: 'lowpass', attack: 0.2 })
    },
  },
]

/** Animals have no convincing synthesis: audio file, or spoken name. */
export const ANIMALS = [
  { id: 'cat', label: 'le chat', pictogram: 'cat' },
  { id: 'dog', label: 'le chien', pictogram: 'dog' },
  { id: 'bird', label: 'l’oiseau', pictogram: 'bird' },
  { id: 'cow', label: 'la vache', pictogram: 'cow' },
  { id: 'horse', label: 'le cheval', pictogram: 'horse' },
]

// --- Optional audio files ---------------------------------------------

/** id -> AudioBuffer, or `null` when no file accompanies that sound. */
const samples = new Map()

const filePath = (id) => `${import.meta.env.BASE_URL}sounds/${id}.mp3`

/**
 * Looks for `public/sounds/<id>.mp3`. A missing file is the normal case, so
 * the outcome is remembered to avoid retrying on every round.
 */
async function loadSample(id) {
  if (samples.has(id)) return samples.get(id)
  const audio = ctx()
  if (!audio) return null
  try {
    const response = await fetch(filePath(id))
    if (!response.ok) throw new Error('missing')
    const data = await response.arrayBuffer()
    const buffer = await audio.decodeAudioData(data)
    samples.set(id, buffer)
    return buffer
  } catch {
    samples.set(id, null)
    return null
  }
}

/** True when an audio file backs this sound (after preloading). */
export function hasRecording(id) {
  return Boolean(samples.get(id))
}

/** Preloads the files backing a list of sounds, when they exist. */
export async function preloadSounds(sounds) {
  await Promise.all(sounds.map((sound) => loadSample(sound.id)))
}

function playSample(audio, buffer, start) {
  const source = audio.createBufferSource()
  source.buffer = buffer
  output(audio, source, { room: 0.15 })
  source.start(start)
  return buffer.duration
}

/**
 * Plays a sequence of sounds, `gap` seconds apart.
 * Returns the total duration in seconds, or 0 when audio is unavailable.
 */
export function playSequence(sounds, { gap = 0.45 } = {}) {
  const audio = ctx()
  if (!audio) return 0
  let cursor = audio.currentTime + 0.15
  for (const sound of sounds) {
    const buffer = samples.get(sound.id)
    if (buffer) {
      cursor += playSample(audio, buffer, cursor) + gap
    } else if (sound.play) {
      sound.play(audio, cursor)
      cursor += sound.duration + gap
    }
  }
  return cursor - audio.currentTime
}

/** Wakes the audio context up on a user gesture. */
export function primeAudio() {
  ctx()
}
