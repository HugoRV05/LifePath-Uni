# LifePath Uni — Events Brainstorming

Here are a few initial ideas for the types of events we can encounter in the game. 

## 1. Routine / Generic Events
These can happen at any time during the semester and form the core gameplay loop.

**Event: "The Late Night Study Session"**
- *Description:* Your friends are going to the student union bar, but you have a lab report due tomorrow.
- *Choice A (Go out):* +20 Social, -15 Grades, -10 Energy. (Result: You had a blast, but your report is definitely going to suffer.)
- *Choice B (Stay in):* +20 Grades, -15 Social, -10 Energy. (Result: It was miserable, but you got it done and your GPA is safe.)

**Event: "The Text from Mom"**
- *Description:* Your mom texts you checking in, but she sounds stressed about the cost of your tuition.
- *Choice A (Lie and say everything is fine, send 50 euros back):* -50 Money, +10 Energy (peace of mind).
- *Choice B (Tell her you are broke too):* -15 Energy (stress), -10 Health.

## 2. Threshold / Triggered Events
These ONLY appear when a stat gets too high or too low.

**Event: "The Overdraft" (Triggers if Money <= 0)**
- *Description:* Your card declines buying coffee. You are officially broke.
- *Choice A (Take a high-interest student loan):* +200 Money, -20 Health (long-term stress).
- *Choice B (Beg parents for money):* +100 Money, -20 Social (pride taken a hit).
- *Choice C (Skip meals to save cash):* -30 Health, -20 Energy.

**Event: "The Burnout Crash" (Triggers if Energy < 10)**
- *Description:* Your alarm goes off for a 9 AM class, but your body physically refuses to move.
- *Choice A (Force yourself up with 3 energy drinks):* +10 Energy, -20 Health, +10 Grades.
- *Choice B (Sleep in and skip):* +30 Energy, -20 Grades.

## 📝 Team Decisions (Events)
- **Do we want "chain" events?** (e.g., If you skip class in Week 2, do you get a unique punishing event in Week 4?)
- **How many choices per event?** Should we standardize on 2 options (easier to write & design UI for) or 3-4 options (more freedom)?
- **Random vs Sequential?** Do you get 3 random events per week, or is the sequence scripted (Week 1 is always Orientation, Week 8 is always Midterms)?
