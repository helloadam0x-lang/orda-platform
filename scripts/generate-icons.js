const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#050507"/>
  <text x="90" y="360" font-family="Georgia,serif" font-weight="900"
    font-size="280" fill="#EFEFEF">O</text>
  <circle cx="430" cy="96" r="52" fill="#D4A853"/>
</svg>`

const dir = path.join(process.cwd(), 'public', 'icons')
fs.mkdirSync(dir, { recursive: true })

const buf = Buffer.from(svg)

async function generate() {
  await sharp(buf).resize(192).png().toFile(path.join(dir, 'icon-192.png'))
  await sharp(buf).resize(512).png().toFile(path.join(dir, 'icon-512.png'))
  await sharp(buf).resize(72).png().toFile(path.join(dir, 'badge-72.png'))
  console.log('Icons generated at public/icons/')
}

generate().catch(console.error)
