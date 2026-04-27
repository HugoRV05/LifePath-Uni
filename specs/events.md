# The Event Engine Spec

## 1. Fluid & Randomized Weekly Execution
- There is no continuous real-time clock. Time strictly advances through resolving Event Dilemma cards.
- A "Week" consists of a **randomized number of events**. While 3 is an average baseline, random quiet weeks might only have 1 or 2 events, while critical, stressful weeks (like Midterms) might barrage the player with 4 or 5 consecutive events.
- **Visuals:** The clock/calendar in the UI jumps seamlessly. If Event 1 was Tuesday morning, Event 2 might skip straight to Thursday night.

## 2. Event Types & Injectors
- **Generic Deck:** Events that can happen anytime (e.g., deciding between studying vs going out).
- **Conditional Injectors:** Extremely high or low stats inject immediate, urgent events into the queue. (e.g., If Money hits <10, a forced "Your card declined at grocery store" event jumps to the front of the queue).

## 3. Event Card Structure
Every dilemma features:
- A descriptive narrative text.
- Overlaid onto a relevant 3D background image.
- Exactly **4 clickable responses** standard across all events.
- **Hidden Consequences:** The UI will NOT display which stats will be affected before clicking. The player must read the context and intuitively weigh the real-world risk of their actions (e.g., deciding to skip class to party might intuitively hurt Grades and boost Social, but the buttons will only show narrative actions, not raw numbers).
