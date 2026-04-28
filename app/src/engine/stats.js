/**
 * Stats Engine
 * Handles stat application, clamping, game-over detection, and passive budget modifiers.
 */

/** Stat keys used throughout the game */
export const STAT_KEYS = ['health', 'money', 'grades', 'social'];

/** Stats that trigger game-over when they hit 0 */
export const CRITICAL_STATS = ['health', 'money', 'grades'];

/** Default starting stats (all 50/100) */
export const DEFAULT_STATS = Object.freeze({
  health: 50,
  money: 50,
  grades: 50,
  social: 50,
});

/**
 * Clamp a value between 0 and 100.
 * @param {number} value
 * @returns {number}
 */
export function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Apply stat effects to current stats, returning new stats object.
 * All values are clamped to 0-100.
 *
 * @param {Object} currentStats - { health, money, grades, social }
 * @param {Object} effects - { health?: number, money?: number, grades?: number, social?: number }
 * @returns {Object} New stats object with effects applied
 */
export function applyEffects(currentStats, effects) {
  const newStats = { ...currentStats };

  for (const key of STAT_KEYS) {
    if (effects[key] !== undefined && effects[key] !== 0) {
      newStats[key] = clamp(newStats[key] + effects[key]);
    }
  }

  return newStats;
}

/**
 * Compute the delta between two stat snapshots.
 *
 * @param {Object} before - Stats before the week
 * @param {Object} after - Stats after the week
 * @returns {Object} Delta object { health: +/-n, money: +/-n, ... }
 */
export function computeDelta(before, after) {
  const delta = {};
  for (const key of STAT_KEYS) {
    delta[key] = after[key] - before[key];
  }
  return delta;
}

/**
 * Check if any critical stat has hit 0, triggering game over.
 *
 * @param {Object} stats - Current stats
 * @returns {{ isGameOver: boolean, cause: string|null }}
 */
export function checkGameOver(stats) {
  for (const key of CRITICAL_STATS) {
    if (stats[key] <= 0) {
      return { isGameOver: true, cause: key };
    }
  }
  return { isGameOver: false, cause: null };
}

/**
 * Game-over messages keyed by the stat that caused it.
 */
export const GAME_OVER_MESSAGES = Object.freeze({
  health: {
    title: 'Hospitalized',
    subtitle: 'Your body finally gave out.',
    description:
      'Weeks of neglecting your health caught up with you. You collapsed in the hallway and woke up in the campus medical center. The doctor says you need to take the rest of the semester off. Your parents are on their way.',
  },
  money: {
    title: 'Bankrupt',
    subtitle: 'You had to move back home.',
    description:
      'Your bank account hit zero and the overdraft fees started piling up. You couldn\'t afford rent, food, or textbooks. With no options left, you packed your bags and called home for a ride. Maybe next semester.',
  },
  grades: {
    title: 'Academic Suspension',
    subtitle: 'The university asked you to leave.',
    description:
      'Your GPA dropped below the minimum threshold. The dean\'s office sent you a formal notice of academic suspension. You have one semester to "reflect and regroup" before you can reapply. The walk to the parking lot felt very long.',
  },
});

/**
 * Compute an overall "life score" from final stats (0-100).
 * Weighted average: all stats equal weight.
 *
 * @param {Object} stats - Final stats
 * @returns {number} Score 0-100
 */
export function computeLifeScore(stats) {
  const total = STAT_KEYS.reduce((sum, key) => sum + stats[key], 0);
  return Math.round(total / STAT_KEYS.length);
}
