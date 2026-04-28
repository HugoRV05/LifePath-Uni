/**
 * Game Store (Zustand)
 * Central state management for the entire game.
 */

import { create } from 'zustand';
import { DEFAULT_STATS, applyEffects, checkGameOver, computeDelta, computeLifeScore } from '../engine/stats.js';
import { partitionDeck, buildWeekQueue } from '../engine/events.js';
import { getBudgetById, getDefaultBudget } from '../engine/budgets.js';
import { resolveEvent, endWeek, isSemesterComplete, TOTAL_WEEKS, GAME_PHASES, assignEventDays } from '../engine/weeks.js';
import { assembleEnding } from '../engine/endings.js';
import allEventsData from '../data/events.json';

/**
 * Load and partition the event deck.
 * Uses Vite's native JSON import (resolved at build time).
 */
let cachedDeck = null;

function loadDeck() {
  if (cachedDeck) return cachedDeck;
  cachedDeck = partitionDeck(allEventsData);
  return cachedDeck;
}

const useGameStore = create((set, get) => ({
  // ── Game Phase ──
  gamePhase: GAME_PHASES.ONBOARDING,

  // ── Player ──
  playerName: '',
  avatar: {
    skinTone: 0,   // index into character grid (0-3)
    hair: 0,       // index into hair grid (0-3)
    hairType: 'feminine', // 'feminine' | 'masculine'
    outfit: 0,     // index into clothes grid (0-3)
  },

  // ── Stats ──
  stats: { ...DEFAULT_STATS },
  weekStartStats: { ...DEFAULT_STATS }, // snapshot at start of each week

  // ── Week Management ──
  currentWeek: 1,
  currentEventIndex: 0,
  eventQueue: [],
  eventDays: [],
  resolvedEvents: [], // history of all resolved events

  // ── Budget ──
  currentBudget: 'balanced',

  // ── Events tracking ──
  usedEventIds: new Set(),
  deck: null, // { generic, injectors }

  // ── Ending ──
  ending: null,
  unlockedEndings: [], // combo IDs achieved (persisted to localStorage)

  // ── Game Over ──
  gameOverCause: null,

  // ═══════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════

  /**
   * Initialize the game: load deck, set up initial state.
   */
  initGame: () => {
    const deck = loadDeck();

    // Load unlocked endings from localStorage
    let unlockedEndings = [];
    try {
      const saved = localStorage.getItem('lifepath-unlocked-endings');
      if (saved) unlockedEndings = JSON.parse(saved);
    } catch (e) { /* ignore */ }

    set({
      deck,
      unlockedEndings,
      gamePhase: GAME_PHASES.ONBOARDING,
      stats: { ...DEFAULT_STATS },
      weekStartStats: { ...DEFAULT_STATS },
      currentWeek: 1,
      currentEventIndex: 0,
      eventQueue: [],
      eventDays: [],
      resolvedEvents: [],
      currentBudget: 'balanced',
      usedEventIds: new Set(),
      ending: null,
      gameOverCause: null,
    });
  },

  /**
   * Set player name.
   */
  setPlayerName: (name) => set({ playerName: name }),

  /**
   * Update avatar selection.
   */
  setAvatar: (avatarUpdates) =>
    set((state) => ({ avatar: { ...state.avatar, ...avatarUpdates } })),

  /**
   * Transition to avatar creation.
   */
  goToAvatarCreate: () => set({ gamePhase: GAME_PHASES.AVATAR_CREATE }),

  /**
   * Start the game after onboarding + avatar creation.
   */
  startGame: () => {
    const { deck, stats, usedEventIds, currentWeek } = get();
    if (!deck) return;

    const { eventQueue, eventDays } = startWeekInternal(deck, currentWeek, stats, usedEventIds);

    set({
      gamePhase: GAME_PHASES.PLAYING,
      eventQueue,
      eventDays,
      currentEventIndex: 0,
      weekStartStats: { ...stats },
    });
  },

  /**
   * Make a choice on the current event.
   */
  makeChoice: (choiceIndex) => {
    const { stats, eventQueue, currentEventIndex, usedEventIds, resolvedEvents } = get();

    if (currentEventIndex >= eventQueue.length) return;

    const event = eventQueue[currentEventIndex];
    const { newStats, choice, gameOverCheck } = resolveEvent(stats, event, choiceIndex);

    // Track this event as used
    const newUsedIds = new Set(usedEventIds);
    newUsedIds.add(event.id);

    // Record resolved event
    const resolvedEntry = {
      eventId: event.id,
      title: event.title,
      choiceText: choice.text,
      outcome: choice.outcome,
      effects: choice.effects,
      week: get().currentWeek,
    };

    if (gameOverCheck.isGameOver) {
      set({
        stats: newStats,
        usedEventIds: newUsedIds,
        resolvedEvents: [...resolvedEvents, resolvedEntry],
        gamePhase: GAME_PHASES.GAME_OVER,
        gameOverCause: gameOverCheck.cause,
      });
      return;
    }

    const nextIndex = currentEventIndex + 1;
    const weekDone = nextIndex >= eventQueue.length;

    set({
      stats: newStats,
      usedEventIds: newUsedIds,
      resolvedEvents: [...resolvedEvents, resolvedEntry],
      currentEventIndex: nextIndex,
      gamePhase: weekDone ? GAME_PHASES.WEEK_SUMMARY : GAME_PHASES.PLAYING,
    });
  },

  /**
   * Select a budget for the upcoming week.
   */
  selectBudget: (budgetId) => set({ currentBudget: budgetId }),

  /**
   * Advance to the next week after budget selection.
   */
  advanceWeek: () => {
    const { stats, currentBudget, currentWeek, deck, usedEventIds } = get();

    // Apply budget passive effects
    const { newStats, gameOverCheck } = endWeek(stats, currentBudget);

    if (gameOverCheck.isGameOver) {
      set({
        stats: newStats,
        gamePhase: GAME_PHASES.GAME_OVER,
        gameOverCause: gameOverCheck.cause,
      });
      return;
    }

    const nextWeek = currentWeek + 1;

    // Check if semester is complete
    if (isSemesterComplete(nextWeek)) {
      const ending = assembleEnding(newStats);

      // Save combo achievement if any
      const { unlockedEndings } = get();
      if (ending.combo && !unlockedEndings.includes(ending.combo.id)) {
        const newUnlocked = [...unlockedEndings, ending.combo.id];
        localStorage.setItem('lifepath-unlocked-endings', JSON.stringify(newUnlocked));
        set({ unlockedEndings: newUnlocked });
      }

      set({
        stats: newStats,
        currentWeek: nextWeek,
        ending,
        gamePhase: GAME_PHASES.ENDING,
      });
      return;
    }

    // Start next week
    const { eventQueue, eventDays } = startWeekInternal(deck, nextWeek, newStats, usedEventIds);

    set({
      stats: newStats,
      currentWeek: nextWeek,
      weekStartStats: { ...newStats },
      eventQueue,
      eventDays,
      currentEventIndex: 0,
      gamePhase: GAME_PHASES.PLAYING,
    });
  },

  /**
   * Restart the game (new playthrough).
   */
  restartGame: () => {
    cachedDeck = null;
    get().initGame();
  },

  /**
   * Get the current event being displayed.
   */
  getCurrentEvent: () => {
    const { eventQueue, currentEventIndex } = get();
    if (currentEventIndex >= eventQueue.length) return null;
    return eventQueue[currentEventIndex];
  },

  /**
   * Get the stat delta for the current week.
   */
  getWeekDelta: () => {
    const { weekStartStats, stats } = get();
    return computeDelta(weekStartStats, stats);
  },

  /**
   * Get current day label for display.
   */
  getCurrentDay: () => {
    const { eventDays, currentEventIndex } = get();
    return eventDays[currentEventIndex] || 'Monday';
  },
}));

// ── Internal helpers ──

function startWeekInternal(deck, week, stats, usedEventIds) {
  if (!deck) return { eventQueue: [], eventDays: [] };
  const eventQueue = buildWeekQueue(deck, week, stats, usedEventIds);
  const eventDays = assignEventDays(eventQueue.length);
  return { eventQueue, eventDays };
}

export default useGameStore;
