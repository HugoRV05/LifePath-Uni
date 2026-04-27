# Stats & Mathematical Rules Spec

## 1. The 4 Core Variables
- **Health** (`heart`)
- **Money** (`banknote` / `coins`)
- **Grades** (`graduation-cap`)
- **Social** (`users`)

All stats operate natively on a `0-100` scale.

## 2. Failure & Endings
- **Early Game Over:** Hitting exactly `0` on critical survival stats (Health, Money, Grades) instantly halts the game, triggering a specific Early Game Over screen (e.g., "Bankrupt: Had to move back home").
- **Week 15 Completion:** Surviving the semester evaluates your final score. The ending is modularly created by appending texts based on extreme stats (e.g., combining a "Rich Student" ending fragment with a "No friends" ending fragment).

## 3. The End of Week Summary
- Once a week's random events logically conclude, the simulation pauses.
- **The Summary Screen:** Shows the delta (change) of stats over the past 7 days.
- **The Budget Mechanic:** The player must actively select a budget/lifestyle for the upcoming week.
  - *Example:* Select "Ramen Diet" (Saves Money, heavily drains Health passively next week) vs "Premium Living" (Drains Money constantly, boosts passive Health).
