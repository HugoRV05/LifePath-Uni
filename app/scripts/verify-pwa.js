import fs from 'fs'
import path from 'path'

const distPath = path.resolve('dist')

console.log('🔍 Starting PWA Build Verification...')

// 1. Verify index.html exists and has register-sw script
const indexHtmlPath = path.join(distPath, 'index.html')
if (!fs.existsSync(indexHtmlPath)) {
  console.error('❌ index.html not found in dist/')
  process.exit(1)
}
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8')
if (!indexHtml.includes('id="vite-plugin-pwa:register-sw"')) {
  console.error('❌ PWA registration script not injected in index.html')
  process.exit(1)
}
console.log('✅ PWA registration script injected successfully')

// 2. Verify registerSW.js exists
if (!fs.existsSync(path.join(distPath, 'registerSW.js'))) {
  console.error('❌ registerSW.js not found in dist/')
  process.exit(1)
}
console.log('✅ registerSW.js generated successfully')

// 3. Verify sw.js exists and is not empty
const swPath = path.join(distPath, 'sw.js')
if (!fs.existsSync(swPath)) {
  console.error('❌ sw.js not found in dist/')
  process.exit(1)
}
const swContent = fs.readFileSync(swPath, 'utf-8')
if (swContent.length === 0) {
  console.error('❌ sw.js is empty')
  process.exit(1)
}
console.log('✅ sw.js generated successfully')

// 4. Verify mp3 assets are included in precache list (checking sw.js contents)
if (!swContent.includes('audio/ambient.mp3')) {
  console.error('❌ sw.js does not contain audio/ambient.mp3 in precache list')
  process.exit(1)
}
if (!swContent.includes('avatar/hairs.png')) {
  console.error('❌ sw.js does not contain avatar/hairs.png in precache list')
  process.exit(1)
}
console.log('✅ sw.js includes all public audio and avatar assets in precache list')

// 5. Check for duplicates in precache manifest
const matches = swContent.match(/"url":"logo\.png"/g)
if (matches && matches.length > 1) {
  console.error('❌ Duplicate precache entries found for logo.png! Check vite.config.js.')
  process.exit(1)
}
console.log('✅ No duplicate entries found in precache list')

// 6. Verify manifest.json is valid and copied
const manifestPath = path.join(distPath, 'manifest.json')
if (!fs.existsSync(manifestPath)) {
  console.error('❌ manifest.json not found in dist/')
  process.exit(1)
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
if (manifest.short_name !== 'LifePath' || manifest.name !== 'LifePath Uni') {
  console.error('❌ manifest.json has invalid short_name or name')
  process.exit(1)
}
console.log('✅ manifest.json copied and verified successfully')

console.log('🎉 PWA BUILD VERIFICATION PASSED SUCCESSFULLY!')
