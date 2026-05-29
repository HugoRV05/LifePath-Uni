/**
 * Event Engine
 * Handles deck loading, random weekly event drawing, conditional injectors,
 * and budget-influenced weighted selection.
 */

import { getBudgetById } from './budgets.js';

/**
 * Separate the raw event deck into generic events and conditional injectors.
 *
 * @param {Array} allEvents - Full event deck from JSON
 * @returns {{ generic: Array, injectors: Array }}
 */
export function partitionDeck(allEvents) {
  const generic = [];
  const injectors = [];

  for (const event of allEvents) {
    if (event.type === 'injector') {
      injectors.push(event);
    } else {
      generic.push(event);
    }
  }

  return { generic, injectors };
}

/**
 * Filter generic events by the current week number.
 *
 * @param {Array} genericEvents - All generic events
 * @param {number} currentWeek - Current week (1-15)
 * @returns {Array} Events eligible for this week
 */
export function filterByWeek(genericEvents, currentWeek) {
  return genericEvents.filter((event) => {
    const [minWeek, maxWeek] = event.weekRange || [1, 15];
    return currentWeek >= minWeek && currentWeek <= maxWeek;
  });
}

/**
 * Check which injector events should fire based on current stats.
 *
 * @param {Array} injectors - All injector events
 * @param {Object} stats - Current stats { health, money, grades, social }
 * @param {Set} usedEventIds - Set of event IDs already resolved this game
 * @returns {Array} Injector events that should trigger
 */
export function checkInjectors(injectors, stats, usedEventIds) {
  return injectors.filter((injector) => {
    if (usedEventIds.has(injector.id)) return false;
    const { stat, below } = injector.condition;
    return stats[stat] < below;
  });
}

/**
 * Perform a weighted random selection from an array of { item, weight } entries.
 * Returns `count` unique items without replacement.
 *
 * @param {Array<{item: Object, weight: number}>} weighted - Weighted items
 * @param {number} count - Number of items to draw
 * @returns {Array} Selected items
 */
export function weightedDraw(weighted, count) {
  const results = [];
  const pool = [...weighted];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * totalWeight;

    for (let j = 0; j < pool.length; j++) {
      roll -= pool[j].weight;
      if (roll <= 0) {
        results.push(pool[j].item);
        pool.splice(j, 1);
        break;
      }
    }
  }

  return results;
}

/**
 * Draw events for a week using budget-weighted selection.
 * Events that share tags with the active budget get 2x draw weight.
 * Events without tags or with a "balanced" budget (no tags) draw at normal weight.
 *
 * @param {Array} eligibleEvents - Events eligible for this week
 * @param {number} currentWeek - Current week number
 * @param {Set} usedEventIds - Set of event IDs already seen
 * @param {string} [budgetId] - Active budget preset ID for weighted drawing
 * @returns {Array} Selected events for this week
 */
export function drawWeeklyEvents(eligibleEvents, currentWeek, usedEventIds, budgetId) {
  const available = eligibleEvents.filter((e) => !usedEventIds.has(e.id));
  if (available.length === 0) return [];

  const count = getWeekEventCount(currentWeek);
  const budget = budgetId ? getBudgetById(budgetId) : null;
  const budgetTags = budget?.tags || [];

  // If no budget tags, do a simple shuffle draw
  if (budgetTags.length === 0) {
    const shuffled = shuffleArray([...available]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  // Build weighted pool: matching events get 2x weight
  const weighted = available.map((event) => {
    const eventTags = event.tags || [];
    const hasOverlap = eventTags.some((tag) => budgetTags.includes(tag));
    return { item: event, weight: hasOverlap ? 2 : 1 };
  });

  return weightedDraw(weighted, Math.min(count, available.length));
}

/**
 * Determine how many events a week should have.
 *
 * @param {number} week - Week number (1-15)
 * @returns {number} Number of events
 */
export function getWeekEventCount(week) {
  if (week >= 14) return randomInt(4, 5);
  if (week >= 7 && week <= 8) return randomInt(3, 5);
  if (week === 1) return randomInt(2, 3);
  return randomInt(2, 4);
}

/**
 * Build the complete event queue for a week, including injectors.
 * Injectors are prepended (they interrupt the normal flow).
 *
 * @param {Object} deck - { generic, injectors } from partitionDeck
 * @param {number} currentWeek - Current week
 * @param {Object} stats - Current player stats
 * @param {Set} usedEventIds - Already seen event IDs
 * @param {string} [budgetId] - Active budget for weighted event selection
 * @returns {Array} Ordered event queue for the week
 */
export function buildWeekQueue(deck, currentWeek, stats, usedEventIds, budgetId) {
  const triggeredInjectors = checkInjectors(deck.injectors, stats, usedEventIds);
  const eligible = filterByWeek(deck.generic, currentWeek);
  const normalEvents = drawWeeklyEvents(eligible, currentWeek, usedEventIds, budgetId);

  return [...triggeredInjectors, ...normalEvents];
}

// ---- Utility functions ----

/**
 * Fisher-Yates shuffle (returns new array).
 * @param {Array} arr
 * @returns {Array}
 */
export function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
