/**
 * Measures exact pixel boundaries of the fire card template.
 * Scans horizontal and vertical strips to find where color zones change.
 * Card display size: 500×695 (scale factor 500/474 = 1.0549)
 */
import { createReadStream } from 'fs'
import { PNG } from 'pngjs'

const SCALE = 500 / 474  // native → display

function scaled(native) {
  return Math.round(native * SCALE)
}

const png = await new Promise((resolve, reject) => {
  createReadStream('/Users/art/Desktop/claude-projects/hoe-kemon/public/card-templates/fire.png')
    .pipe(new PNG())
    .on('parsed', function() { resolve(this) })
    .on('error', reject)
})

const { width, height, data } = png
console.log(`Native size: ${width}×${height}`)
console.log(`Display size: ${scaled(width)}×${scaled(height)}`)
console.log(`Scale factor: ${SCALE.toFixed(4)}\n`)

function px(x, y) {
  const i = (y * width + x) * 4
  return { r: data[i], g: data[i+1], b: data[i+2], a: data[i+3] }
}

function isYellow(p) { return p.r > 180 && p.g > 160 && p.b < 80 }
function isWhiteish(p) { return p.r > 220 && p.g > 210 && p.b > 190 }
function isDark(p) { return p.r < 80 && p.g < 80 && p.b < 80 }

// Scan center column (x=237) top to bottom to find y-zone boundaries
const cx = 237
console.log('=== VERTICAL SCAN at x=237 (center) ===')
let lastZone = ''
for (let y = 0; y < height; y++) {
  const p = px(cx, y)
  let zone = `rgb(${p.r},${p.g},${p.b})`
  if (zone !== lastZone) {
    console.log(`  y=${y.toString().padStart(3)} [display ${scaled(y).toString().padStart(3)}]  rgb(${p.r},${p.g},${p.b})`)
    lastZone = zone
  }
}

// Scan center row (y=100 — inside illustration) left to right to find x boundaries
console.log('\n=== HORIZONTAL SCAN at y=100 (inside illustration area) ===')
const iy = 100
let lastZone2 = ''
for (let x = 0; x < width; x++) {
  const p = px(x, iy)
  let zone = `rgb(${p.r},${p.g},${p.b})`
  if (zone !== lastZone2) {
    console.log(`  x=${x.toString().padStart(3)} [display ${scaled(x).toString().padStart(3)}]  rgb(${p.r},${p.g},${p.b})`)
    lastZone2 = zone
  }
}

// Scan center row at y=340 (around the gold strip)
console.log('\n=== HORIZONTAL SCAN at y=340 (around gold info strip) ===')
const sy = 340
let lastZone3 = ''
for (let x = 0; x < width; x++) {
  const p = px(x, sy)
  let zone = `rgb(${p.r},${p.g},${p.b})`
  if (zone !== lastZone3) {
    console.log(`  x=${x.toString().padStart(3)} [display ${scaled(x).toString().padStart(3)}]  rgb(${p.r},${p.g},${p.b})`)
    lastZone3 = zone
  }
}
