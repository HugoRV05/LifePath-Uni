# LifePath Uni — Endings Brainstorming

This document outlines how the game can conclude. The endings are critical because they deliver the "Transformational" core message of the game.

## 1. Game Length: Can the game end *early*?
We need to decide if we force everyone to play the full 15 weeks, or if you can "Lose/Win" early.

- **Option A: Fixed Length (15 Weeks).** Everyone plays to the end. Even if you have 0 Money, you just suffer through the bad events until the semester ends, and then get a terrible final score. 
  - *Pros:* Easier to code. 
  - *Cons:* Less realistic.
- **Option B: Early Exits (Game Overs).** If Health hits 0 or Money hits 0, the game instantly ends mid-semester.
  - *Example Early Ending:* **"The Drop Out"** — "You ran out of funds in Week 7 and couldn't pay rent. You had to move back with your parents. Game Over."
  - *Example Early Ending:* **"The Hospital Visit"** — "You drank too much caffeine and slept 2 hours a night. You collapsed during a mid-term. Game Over."

## 2. Final Semester Endings (If you survive 15 weeks)
If the player makes it to the end, how specific do we want the final summaries to be?

### Approach A: Unified / Modular Endings (Easier to write)
We check which stat is the *highest* and which is the *lowest*, and stitch together 2 sentences.
- *High Grades, Low Health:* "You passed with flying colors, but you spent the entire summer recovering in bed."
- *High Social, Low Grades:* "You are the legend of the campus, but you're going to have to repeat the year."

### Approach B: Highly Specific Scenario Endings (More fun, harder to code)
We create 4 or 5 very specific, hand-written conclusions based on exact stat combinations.
- **The Golden Mean:** (All stats > 50). "You found the holy grail of student life. You passed, you partied, and your bank account isn't empty. You are ready for actual adulthood."
- **The Grindset Hustler:** (Money > 80, Social < 20). "You worked 40 hours a week and aced your classes. You have 5,000 in your bank account, but you literally don't know the names of your roommates."
- **The Neppo Baby Run:** (Requires specific privileged background + High Money). "You survived without putting in any effort because your parents funded everything. Did you actually learn anything?"

## 📝 Team Decisions (Endings)
- **Do we want "Early Game Overs"?** (If yes, we need to code a 'check' after every turn to see if stats hit 0).
- **Unified vs Specific?** Should we write modular sentences that combine together, or 5-6 big unique text blocks for endings?
- **Are there "Hidden" Endings?** (e.g., A secret event chain that ends the game in a crazy way, like becoming a TikTok millionaire and dropping out).
