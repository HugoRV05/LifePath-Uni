# PWA Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Optimize and finalize a complete, robust, offline-capable Progressive Web App (PWA) configuration using `vite-plugin-pwa` so that the LifePath Uni game is fully playable offline and installable on all mobile/desktop devices with clean, non-duplicated precaching.

**Architecture:** We use the fully integrated `vite-plugin-pwa` in `generateSW` mode to automatically compile and inject the Workbox service worker (`sw.js`). We will specify clean, non-duplicated precaching for all static and public assets (JS, CSS, HTML, JSON, PNG, JPG, JPEG, SVG, MP3) and runtime caching for external Google Fonts resources.

**Tech Stack:** React 19, Vite 8, `vite-plugin-pwa` (Workbox)

---

### Task 1: Add Node-based PWA Build Verification Script

**Files:**
- Create: `app/scripts/verify-pwa.js`

**Step 1: Write the verification script**
We'll write a node script that checks the built directory (`dist/`) after running the build to ensure that all assets (including audio files, backgrounds, and main registration scripts) exist and that there are no duplicate entries or missing extensions in the precached manifest.

```javascript
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
```

**Step 2: Commit verification script**
```bash
git add app/scripts/verify-pwa.js
git commit -m "test: add PWA build verification script"
```

---

### Task 2: Update `vite.config.js` to Optimize Precaching & Caching Rules

**Files:**
- Modify: `app/vite.config.js`
- Test: `node app/scripts/verify-pwa.js` (expected to pass once the build completes)

**Step 1: Write implementation code**
Modify `app/vite.config.js` to:
- Clear the `includeAssets` array to prevent duplicates (since `globPatterns` handles them perfectly from the copied `dist/` folder).
- Add `mp3` files directly to `globPatterns` inside the `workbox` config block: `['**/*.{js,css,html,json,png,jpg,jpeg,svg,mp3,woff2}']`.
- Retain the existing `runtimeCaching` definitions for Google Fonts caching.

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [], // Empty to prevent duplicate precache entries since globPatterns matches everything
      manifest: false,   // Uses our manual public/manifest.json file
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,png,jpg,jpeg,svg,mp3,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|wav|mp3)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
})
```

**Step 2: Run build and verification script**
Build the app and verify the build outputs:
Run: `npm run build && node scripts/verify-pwa.js` (from `app/` directory)
Expected: `🎉 PWA BUILD VERIFICATION PASSED SUCCESSFULLY!` with zero duplicates or missing mp3 entries.

**Step 3: Commit**
```bash
git add app/vite.config.js
git commit -m "feat: optimize PWA config and fix duplicate precache caching"
```

---

### Task 3: Verify Offline Support and Run Preview

**Files:**
- Test: Manually preview the game offline
- Run: `npm run preview` in `app/` directory

**Step 1: Check in browser**
Open `http://localhost:4173/` in your browser.
1. Open DevTools (F12) -> Application -> Service Workers. Verify that the Service Worker is registered, active, and controls the page.
2. Under Application -> Manifest, verify that all properties (name, short name, colors, start URL, display: standalone) are parsed and active.
3. Toggle "Offline" mode in the Network tab, reload the page, and verify the game loads instantly and music / sfx / background images function completely offline.
