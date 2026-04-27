# LifePath Uni - Main Project Index

**Mandatory Reading:** Any developer or LLM agent joining this project MUST read this file and follow the linked specs. 
**Strict Rule:** Whenever state changes or mechanical decisions are modified during development, all participating agents MUST update the relevant atomic specification files and this index document instantly. No outdated docs or inconsistencies are permitted.

## Project Overview
LifePath Uni is a choice-driven, web-based simulation that tracks four critical variables of university student life over 15 weeks. It blends "Clean & Playful" modern UI with stylized 3D generated art, relying on dynamic randomized dilemma events and weekly budgeting rather than heavy real-time calendar management.

## The Atomic Specifications
All systems and rules are broken down purely into the following atomic documents. Read them before implementing features:

1. [Design, UI & Aesthetics](design.md) - Layout, UI colors, navigation constraints, animation.
2. [Story, Universe & Archetypes](universe.md) - Onboarding hooks, lore, character backgrounds (Archetypes).
3. [The Event Engine](events.md) - Random weekly event mechanics, conditional event injection, and time flow.
4. [Stats & Budgets](stats.md) - How Health, Money, Grades, and Social function. Game-over conditions and End-of-Week logic.
5. [Scenarios & Art Assets](scenarios_and_art.md) - Exact lists of assets to generate externally, and the strict 2x2 grid generation prompts for avatars.
