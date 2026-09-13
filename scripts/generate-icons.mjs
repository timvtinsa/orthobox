/**
 * Genere les icones PNG de la PWA sans dependance externe.
 * Un mini encodeur PNG (zlib + CRC32) suffit : les icones sont des formes
 * simples dessinees par code, donc reproductibles et versionnables.
 */
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')

const CRC_TABLE = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  return table
})()

function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

/** @param {Uint8Array} rgba pixels RGBA, taille size*size*4 */
function encodePng(rgba, size) {
  const stride = size * 4
  const raw = Buffer.alloc((stride + 1) * size)
  for (let y = 0; y < size; y += 1) {
    raw[y * (stride + 1)] = 0 // filtre "None"
    Buffer.from(rgba.buffer, rgba.byteOffset + y * stride, stride).copy(raw, y * (stride + 1) + 1)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // profondeur
  ihdr[9] = 6 // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))
const clamp01 = (v) => Math.min(1, Math.max(0, v))
/** Anti-aliasing : 1 dedans, 0 dehors, transition sur ~1,5px. */
const cover = (distance) => clamp01(0.5 - distance / 1.5)

function roundedRectDistance(x, y, size, radius) {
  const cx = Math.abs(x - size / 2) - (size / 2 - radius)
  const cy = Math.abs(y - size / 2) - (size / 2 - radius)
  const dx = Math.max(cx, 0)
  const dy = Math.max(cy, 0)
  return Math.min(Math.max(cx, cy), 0) + Math.hypot(dx, dy) - radius
}

function drawIcon(size, { maskable = false } = {}) {
  const px = new Uint8Array(size * size * 4)
  const s = size / 512 // echelle : le dessin est pense sur une grille 512
  const radius = maskable ? size / 2 : size * 0.22
  // Zone sure d'une icone maskable : 80 % centraux -> on reduit le motif.
  const scale = maskable ? 0.78 : 1
  const top = [0x5b, 0x74, 0xe8]
  const bottom = [0x35, 0x3f, 0xa8]
  const bubble = [0xff, 0xff, 0xff]

  const cxBubble = 256 * s
  const cyBubble = 236 * s
  const rxBubble = 168 * s * scale
  const ryBubble = 132 * s * scale

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4
      const bg = maskable ? 1 : cover(roundedRectDistance(x + 0.5, y + 0.5, size, radius))
      if (bg <= 0) continue
      const color = mix(top, bottom, y / size)

      // Bulle de parole : ellipse + queue triangulaire.
      const ex = (x + 0.5 - cxBubble) / rxBubble
      const ey = (y + 0.5 - cyBubble) / ryBubble
      const ellipse = cover((Math.hypot(ex, ey) - 1) * Math.min(rxBubble, ryBubble))
      const ty = (y + 0.5 - cyBubble) / s
      const tx = (x + 0.5 - cxBubble) / s
      const tail =
        ty > 90 * scale && ty < 190 * scale && tx > -70 * scale && tx < (150 - ty) * scale ? 1 : 0
      const shape = Math.max(ellipse, tail)

      let out = color
      if (shape > 0) {
        out = mix(color, bubble, shape)
        // Trois points d'appel : le rythme de la parole.
        for (const dotX of [-70, 0, 70]) {
          const d = Math.hypot(x + 0.5 - (cxBubble + dotX * s * scale), y + 0.5 - cyBubble)
          const dot = cover(d - 22 * s * scale)
          if (dot > 0) out = mix(out, [0x35, 0x3f, 0xa8], dot * shape)
        }
      }

      px[i] = out[0]
      px[i + 1] = out[1]
      px[i + 2] = out[2]
      px[i + 3] = Math.round(255 * bg)
    }
  }
  return encodePng(px, size)
}

mkdirSync(OUT_DIR, { recursive: true })
const files = [
  ['icon-192.png', drawIcon(192)],
  ['icon-512.png', drawIcon(512)],
  ['icon-maskable-512.png', drawIcon(512, { maskable: true })],
  ['apple-touch-icon.png', drawIcon(180)],
]
for (const [name, buffer] of files) {
  writeFileSync(resolve(OUT_DIR, name), buffer)
  console.log(`icone generee : public/icons/${name} (${buffer.length} o)`)
}
