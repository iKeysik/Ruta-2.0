// Generates minimal PWA PNG icons using raw PNG byte writing (no canvas needed)
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dir, '../public')

// Simple PNG writer for a solid-color square with text
// We'll create 192x192 and 512x512 icons
function createSvgIcon(size) {
  const fontSize = Math.round(size * 0.45)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a855f7"/>
      <stop offset="100%" style="stop-color:#f97316"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#bg)"/>
  <text x="50%" y="54%" font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif">🗺️</text>
</svg>`
}

writeFileSync(join(publicDir, 'icon-192.svg'), createSvgIcon(192))
writeFileSync(join(publicDir, 'icon-512.svg'), createSvgIcon(512))
console.log('SVG icons created')
