# Design Document: PWA Integration for LifePath Uni

**Date:** 2026-06-01  
**Status:** Approved  
**Author:** Antigravity AI  

---

## 1. Overview
The goal is to enable Progressive Web App (PWA) capabilities for the **LifePath Uni** web game. This will allow the game to be installable like a native app on iOS and Android devices, load instantly, and run completely offline, including all audio, graphics, fonts, and gameplay data.

The project is built with **Vite, React, and Zustand**, and will be deployed to **Vercel**. We are using `vite-plugin-pwa` to automate the build and caching pipelines.

---

## 2. PWA Manifest Configuration
The app uses an existing manifest file at `app/public/manifest.json`. We will verify and maintain it with the following core configurations:

* **App Identity:**
  * `name`: `LifePath Uni`
  * `short_name`: `LifePath`
  * `description`: `Your choices. Your semester. Your future.`
  * `start_url`: `/`
  * `display`: `standalone` (for an immersive, app-like environment)
  * `orientation`: `portrait` (forces a vertical orientation, optimized for phone-based card layouts)
  * `theme_color`: `#3B82F6` (accent blue matching the game's design system)
  * `background_color`: `#FAFAF7` (warm body background color of the app)
* **App Icons:**
  * Standard icons: `192x192` and `512x512` PNG assets already placed in `/public/icons/`.

---

## 3. Service Worker & Workbox Caching
To achieve a robust offline experience, the service worker will cache all local static resources as well as runtime external fonts.

### 3.1. Precaching (Static Assets)
The service worker will precache:
* All compiled JS and CSS chunks.
* The main `index.html` entry.
* Game configuration and story scenario JSON databases.
* Static media assets:
  * `/logo.png`
  * `/icons/**/*` (PWA launch and shortcut icons)
  * `/backgrounds/**/*` (Illustrations and SVG textures)
  * `/audio/**/*` (Background music tracks, button clicks, and event SFX)
  * `/avatar/**/*` (Student profile avatars)

### 3.2. Runtime Caching (External Assets)
For Google Fonts imported in `index.css` (`Nunito` and `Outfit` fonts):
* **Stylesheet Requests:** `https://fonts.googleapis.com/...` will be cached using a **CacheFirst** strategy with a max entry limit of 10.
* **Font File Requests:** `https://fonts.gstatic.com/...` will be cached using a **CacheFirst** strategy, expiring after 365 days.

---

## 4. SW Registration & Auto-Updates
* **VitePWA Mode:** We will use `generateSW` mode.
* **Lifecycle Behavior:** Configured with `registerType: 'autoUpdate'`. When a new deployment is pushed to Vercel:
  1. The browser checks for a new service worker version in the background.
  2. The new service worker installs and precaches updated assets.
  3. Once installed, it immediately activates (`skipWaiting`) and claims existing tabs, prompting a clean reload to instantly serve the new version without stale cache issues.
* **Build Integration:** The registration script is automatically injected as a `<script>` tag in `index.html` during the build process, requiring zero manual script tags in the source code.

---

## 5. Verification Plan
* **Local Testing:**
  1. Execute `npm run build` inside the `app/` directory to generate the production build and compile the service worker.
  2. Execute `npm run preview` to launch the local Vite preview server.
  3. Inspect Chrome DevTools under the **Application** tab:
     * Check **Service Workers** to verify the service worker is active and controlled.
     * Check **Manifest** to verify that all properties and icons are parsed correctly.
     * Toggle **Offline** mode in Chrome DevTools to confirm the game loads and plays perfectly.
* **Vercel Deployment Verification:**
  * Deploy to Vercel and check deployment headers using a browser. Ensure `sw.js` is served with no cache (`Cache-Control: max-age=0, no-cache, no-store, must-revalidate`).
