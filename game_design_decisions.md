# LifePath Uni — Deep Dive: Game Design & Technical Decisions

Beyond the narrative and story, the team needs to align on the technical implementation and the overall "feel" of the game. Here are some additional core decisions to discuss that will directly impact your development timeline and final grade.

## 1. Technical Architecture & State Management
Since you are building a React app, you'll be managing complex global variables (Health, Energy, Money, Grades, Social) that change frequently.
- **State Management:** Will you use React Context, Redux, or a lighter library like Zustand to manage global state? *(Recommendation: Zustand or pure Context are easiest for a 15-week project).*
- **Data Storage (The Event Logic):** Will the narrative storylines be stored as a structured local JSON file (`events.json`), or do you want to pull them from a backend database like Firebase? *(Recommendation: A strict local JSON file makes rapid prototyping much easier without worrying about backend latency).*

## 2. Animation and "Juice" (Game Feel)
"Game feel" is what separates a boring web app from an engaging game. How do you want interactions to feel?
- **Animation Framework:** Will you use `framer-motion` (very popular for React) to handle smooth UI transitions, card swiping, and stat-bar animations?
- **Visual Feedback:** When a player makes a choice that costs 20 Health, does the screen flash red? Does the stat bar shake? How explicitly do we communicate the impact of a bad choice?

## 3. Audio & Atmosphere
Sound design drastically increases emotional immersion in transformational games.
- **Background Audio:** Do we want a dynamic soundtrack? (e.g., A lo-fi study track that slowly distorts or gets stressful if your "Energy" drops too low).
- **SFX:** Should we include text-message notification chimes, page-turning sounds, or UI clicks to make the digital interface feel tangible? Who will source these sounds?

## 4. Telemetry and User Evaluation (Crucial for your Final Grade)
Your course syllabus requires "usability testing" and evaluating the game's impact on player behaviors. How will you track data for your final report?
- **Manual Observation:** Do you just physically watch people play the prototype and interview them afterward?
- **Automated Analytics:** Do you want to integrate a free tool like PostHog or Vercel Analytics to anonymously collect data on which choices players make most often, and what endings they hit? *(Note: Having real data graphs of player behavior will look incredible in your final 5000-word report).*

## 5. Accessibility Features (A+ Material)
Implementing accessibility considerations is highly praised by professors in HCI and Informatics domains.
- **Color Palettes:** How do we warn players about low stats without relying purely on Red/Green color coding (which is bad for colorblind accessibility)?
- **Text Readability:** Will we include a toggle for a dyslexia-friendly font, or ensure high-contrast reading modes for the text messages?

## 6. The "Tutorial" / Onboarding Step
How does the player learn the rules?
- Do you drop them immediately into the game and let them figure it out by failing?
- Do you have a "Week 0 / Orientation Week" that safely guides them through how the 5 stats work?
