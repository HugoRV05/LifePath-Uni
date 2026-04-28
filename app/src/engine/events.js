/**
 * Event Engine
 * Handles deck loading, random weekly event drawing, and conditional injector logic.
 */

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
    // Don't re-trigger an injector already seen
    if (usedEventIds.has(injector.id)) return false;

    const { stat, below } = injector.condition;
    return stats[stat] < below;
  });
}

/**
 * Draw a random number of events for a week.
 *
 * Week event count distribution:
 * - Normal weeks: 2-4 events (weighted toward 3)
 * - Midterm week (7-8): 3-5 events
 * - Finals week (14-15): 4-5 events
 *
 * @param {Array} eligibleEvents - Events eligible for this week
 * @param {number} currentWeek - Current week number
 * @param {Set} usedEventIds - Set of event IDs already seen
 * @returns {Array} Selected events for this week
 */
export function drawWeeklyEvents(eligibleEvents, currentWeek, usedEventIds) {
  // Filter out already-used events
  const available = eligibleEvents.filter((e) => !usedEventIds.has(e.id));

  if (available.length === 0) return [];

  // Determine event count based on week
  const count = getWeekEventCount(currentWeek);

  // Shuffle and take
  const shuffled = shuffleArray([...available]);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Determine how many events a week should have.
 *
 * @param {number} week - Week number (1-15)
 * @returns {number} Number of events
 */
export function getWeekEventCount(week) {
  // Finals weeks: heavy load
  if (week >= 14) return randomInt(4, 5);
  // Midterm weeks: above average
  if (week >= 7 && week <= 8) return randomInt(3, 5);
  // First week: orientation, lighter
  if (week === 1) return randomInt(2, 3);
  // Normal weeks
  return randomInt(2, 4);
}

/**
 * Build the complete event queue for a week, including injectors.
 * Injectors are prepended (they interrupt the normal flow).
 *
 * @param {Object} deck - { generic, injectors } from partitionDeck
 * @param {number} currentWeek - Current week
 * @param {Object} stats - Current player stats
 * @param {Set} usedEventIds - Already-seen event IDs
 * @returns {Array} Ordered event queue for the week
 */
export function buildWeekQueue(deck, currentWeek, stats, usedEventIds) {
  // Check for crisis injectors first
  const triggeredInjectors = checkInjectors(deck.injectors, stats, usedEventIds);

  // Draw normal events
  const eligible = filterByWeek(deck.generic, currentWeek);
  const normalEvents = drawWeeklyEvents(eligible, currentWeek, usedEventIds);

  // Injectors go first (they're urgent crises)
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
