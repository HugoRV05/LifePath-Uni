# LifePath Uni — Story & Narrative Design

## 1. Core Narrative Concept
A choice-driven web simulation focusing on the everyday decisions of university students.
- **Tone:** A blend of both—humorous, exaggerated student stereotypes and situations, mixed with highly realistic (and slightly stressful) real-world pressures. This contrast highlights the genuine struggles of uni life while keeping the game entertaining.

## 2. The Narrative Engine (Technical & Story Integration)
To make this achievable within the semester while still delivering a complex "Narrative Logic Graph," we will use a **Stat-Driven Event Engine**.
- **The Loop:** The game spans a 15-week semester (or a set number of days).
- **The Stats:** Choices impact 5 core variables: *Health, Energy, Money, Grades, Social.*
- **The Events:** Instead of a single massive branching script, the game pulls "Events" or "Dilemmas" from a data pool depending on the player's current stats.

### Presentation Idea: The "Smart Phone" or "Dashboard" UI
To save time on 3D environments or drawing character art, the entire interface can mimic a student's digital life.
- Events happen via **Text Messages** from friends ("Party tonight?").
- **Emails** from professors ("Warning: Low Attendance").
- **Calendar or Banking Notifications** ("Rent is due").
- *Why it works:* It feels premium, modern, relatable to the target audience (18-23), and is highly achievable in React.

## 3. Story Arcs & Triggered Events
To give the story depth, certain arcs only unlock when stats reach critical thresholds.
- **The "Burnout" Arc:** If *Energy/Health* drop below 20%, you trigger a forced chain of events (e.g., overslept and missed a midterm, forced sick-days). 
- **The "Broke" Arc:** If *Money* hits $0, survival events trigger (e.g., card declines at the grocery store, forced to call parents to beg for cash, picking up a grueling night shift).
- **The "Distracted" Arc:** If *Social* is maxed but *Grades* are failing, you get dragged into drama or weekend trips that actively sabotage your academic standing.

## 4. The Endings (The Transformational Hook)
The goal is behavioral change and reflection. Endings shouldn't just be "Win/Lose" but an evaluation of the player's balance.
- **The Golden Child:** Straight A’s, but mental health/social life is 0. ("You got the diploma, but you're completely isolated and burnt out. Was it worth it?")
- **The Socialite:** Very popular, but failed the classes. ("You are the center of attention, but your tuition money went down the drain. See you next year.")
- **True Balance:** Average grades, decent social life, healthy. ("You didn't ace everything, and you missed a few epic parties, but you survived with your mental health intact. You achieved true balance.")

---

## 5. Decisions to Make (For the Team)

Here are the immediate decisions we need to discuss to move forward:

### Decision A: The Protagonist
- **Option 1: Blank Slate.** The player enters their name and starts with "average" 50/100 stats across the board.
- **Option 2: Archetypes (Recommended).** The player picks a background, which gives them unique starting stats and unique text events. 
  - *Example: "The Commuter" (Starts with less time/energy, but more money).*
  - *Example: "The International Student" (Starts with high pressure/grades, lower social or money).*

### Decision B: UI / Visual Direction & Art Style
- **Option 1: The "Visual Novel / Scenario" Style.** We use 2D or 3D images for the background of every event. *We could use AI-generated images* (like Midjourney/DALL-E) to create beautiful, realistic, or stylized photos of classrooms, dorms, and parties. This gives players a huge sense of freedom and immersion.
- **Option 2: The "Smartphone" Interface.** Text-heavy, but visually sleek. Looks like WhatsApp, Banking Apps, and emails on a phone screen. No need for heavy background art, feels very modern.
- **Option 3: The "Reigns-style" Card Swiping.** Very minimalist art (maybe just an icon or simple graphic on a card), swipe left/right to decide.
- **Option 4: The "Notion / Daily Planner" Dashboard.** Events pop up as sticky notes or calendar alerts.

### Decision C: The Core Interaction / Time Blocks
How many choices does a player make per "Week"? 
- Do they assign "Time Blocks" (Morning, Afternoon, Evening) to specific tasks and then random events interrupt them?
- Or is the game *just* a continuous sequence of dilemma events? (e.g., event pops up -> make choice -> next event pops up).

### Decision D: Event Structure & Drafting
- I have started a draft of events in `events_brainstorm.md`. We need to decide who will take charge of writing the remaining 30-50 events and whether we will organize them in a shared Google Sheet or JSON file.

### Decision E: Endings & Game Length
- I have started drafting ending structures and logic in `endings_brainstorm.md`. We need to decide if we want unified/broad endings, highly specific endings, and whether the game can end "early" (e.g., dropping out mid-semester).
