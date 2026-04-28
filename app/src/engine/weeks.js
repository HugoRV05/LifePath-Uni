/**
 * Week Lifecycle Manager
 * Orchestrates the flow: startWeek → events → endWeek → budget → advance.
 * Pure functions that operate on state objects (no Zustand dependency).
 */

import { applyEffects, checkGameOver } from './stats.js';
import { buildWeekQueue } from './events.js';
import { getBudgetById } from './budgets.js';

/** Total weeks in a semester */
export const TOTAL_WEEKS = 15;

/** Game phases */
export const GAME_PHASES = Object.freeze({
  ONBOARDING: 'onboarding',
  AVATAR_CREATE: 'avatar_create',
  PLAYING: 'playing',
  WEEK_SUMMARY: 'week_summary',
  GAME_OVER: 'game_over',
  ENDING: 'ending',
});

/**
 * Day labels for event display.
 * Events within a week are spread across these days.
 */
export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * Assign days to events within a week.
 * Events are spaced randomly across the 7-day week.
 *
 * @param {number} eventCount - Number of events this week
 * @returns {string[]} Array of day names for each event
 */
export function assignEventDays(eventCount) {
  if (eventCount === 0) return [];
  if (eventCount >= 7) return WEEK_DAYS.slice(0, eventCount);

  // Pick random non-repeating days, sorted chronologically
  const indices = [];
  const available = [...Array(7).keys()]; // [0,1,2,3,4,5,6]

  for (let i = 0; i < eventCount; i++) {
    const pick = Math.floor(Math.random() * available.length);
    indices.push(available[pick]);
    available.splice(pick, 1);
  }

  indices.sort((a, b) => a - b);
  return indices.map((i) => WEEK_DAYS[i]);
}

/**
 * Start a new week: build the event queue.
 *
 * @param {Object} deck - Partitioned deck { generic, injectors }
 * @param {number} currentWeek - Week number (1-15)
 * @param {Object} stats - Current stats
 * @param {Set} usedEventIds - Already-used event IDs
 * @returns {{ eventQueue: Array, eventDays: string[] }}
 */
export function startWeek(deck, currentWeek, stats, usedEventIds) {
  const eventQueue = buildWeekQueue(deck, currentWeek, stats, usedEventIds);
  const eventDays = assignEventDays(eventQueue.length);

  return { eventQueue, eventDays };
}

/**
 * Resolve a single event choice: apply its effects to stats.
 *
 * @param {Object} stats - Current stats
 * @param {Object} event - The event object
 * @param {number} choiceIndex - Index of the chosen option
 * @returns {{ newStats: Object, choice: Object, gameOverCheck: Object }}
 */
export function resolveEvent(stats, event, choiceIndex) {
  const choice = event.choices[choiceIndex];
  if (!choice) {
    throw new Error(`Invalid choice index ${choiceIndex} for event ${event.id}`);
  }

  const newStats = applyEffects(stats, choice.effects);
  const gameOverCheck = checkGameOver(newStats);

  return { newStats, choice, gameOverCheck };
}

/**
 * End a week: apply budget passive effects.
 *
 * @param {Object} stats - Stats after all events resolved
 * @param {string} budgetId - Currently active budget preset ID
 * @returns {{ newStats: Object, budgetEffects: Object, gameOverCheck: Object }}
 */
export function endWeek(stats, budgetId) {
  const budget = getBudgetById(budgetId);
  if (!budget) {
    return {
      newStats: { ...stats },
      budgetEffects: {},
      gameOverCheck: checkGameOver(stats),
    };
  }

  const newStats = applyEffects(stats, budget.weeklyEffects);
  const gameOverCheck = checkGameOver(newStats);

  return {
    newStats,
    budgetEffects: budget.weeklyEffects,
    gameOverCheck,
  };
}

/**
 * Check if the semester is complete.
 *
 * @param {number} currentWeek - Current week number
 * @returns {boolean}
 */
export function isSemesterComplete(currentWeek) {
  return currentWeek > TOTAL_WEEKS;
}
