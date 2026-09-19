/**
 * Generates the PWA PNG icons without any external dependency.
 * A tiny PNG encoder (zlib + CRC32) is enough: the icons are simple shapes
 * drawn by code, hence reproducible and easy to version.
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

/** @param {Uint8Array} rgba RGBA pixels, size*size*4 bytes */
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
/** Anti-aliasing: 1 inside, 0 outside, transition over ~1.5px. */
const cover = (distance) => clamp01(0.5 - distance / 1.5)

function roundedRectDistance(x, y, size, radius) {
  const cx = Math.abs(x - size / 2) - (size / 2 - radius)
  const cy = Math.abs(y - size / 2) - (size / 2 - radius)
  const dx = Math.max(cx, 0)
  const dy = Math.max(cy, 0)
  return Math.min(Math.max(cx, cy), 0) + Math.hypot(dx, dy) - radius
}

// Same drawing as BrandMark.jsx (the nav bar mark), a 40×40 grid scaled up to
// this 512 grid (×12.8): a tinted rounded square behind four dots. One
// drawing kept in sync by eye across the two files, since the PNG icons
// cannot import the SVG component directly.
const BACKGROUND = [0xa8, 0xc8, 0xec]
const DOT_RADIUS = 51.2
const DOTS = [
  { dx: 166.4 - 256, dy: 204.8 - 256, color: [0x35, 0x60, 0x8f] },
  { dx: 345.6 - 256, dy: 204.8 - 256, color: [0xf6, 0xbd, 0xab] },
  { dx: 166.4 - 256, dy: 358.4 - 256, color: [0xb9, 0xd8, 0xc2] },
  { dx: 345.6 - 256, dy: 358.4 - 256, color: [0xcd, 0xc3, 0xec] },
]

function drawIcon(size, { maskable = false } = {}) {
  const px = new Uint8Array(size * size * 4)
  const s = size / 512 // scale: the drawing is designed on a 512 grid
  const radius = maskable ? size / 2 : size * 0.22
  // Safe zone of a maskable icon: the central 80%, so the motif is scaled down
  // around the icon's centre rather than around the mark's own centre.
  const scale = maskable ? 0.78 : 1
  const center = 256 * s

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4
      const bg = maskable ? 1 : cover(roundedRectDistance(x + 0.5, y + 0.5, size, radius))
      if (bg <= 0) continue

      let out = BACKGROUND
      for (const dot of DOTS) {
        const cx = center + dot.dx * s * scale
        const cy = center + dot.dy * s * scale
        const coverage = cover(Math.hypot(x + 0.5 - cx, y + 0.5 - cy) - DOT_RADIUS * s * scale)
        if (coverage > 0) out = mix(out, dot.color, coverage)
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
  console.log(`icon generated: public/icons/${name} (${buffer.length} bytes)`)
}
