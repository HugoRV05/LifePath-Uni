# UI, Aesthetics & Architecture Spec

## 1. Platform Rules
- **Aspect Ratio:** Strictly Mobile-First (9:16 vertical). 
- **Desktop Strategy:** The main simulation operates securely inside a central phone-like frame. The outer unused space will be utilized for UI menus, logs, and stats so the browser window never feels empty.

## 2. Aesthetic Vibe
- **Style Name:** "Clean & Playful".
- **Visual Targets:** Solid, vibrant accent colors, off-white backgrounds, and highly modern typography. No translucent frosted glassmorphism.
- **Animations:** Extensive use of bouncy, fluid transitions (via `framer-motion`) when swiping cards, interacting with stats, or transitioning weeks.
- **Icons:** Strictly Lucide Icons. **No emojis are permitted anywhere in the UI.**

## 3. Tech Stack
- Frontend: React / Vite
- State Management: Zustand
- Animations: Framer-Motion
- Icons: Lucide-React
