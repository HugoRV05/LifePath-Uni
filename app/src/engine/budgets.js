/**
 * Budget System
 * 6 lifestyle presets that unlock/lock based on current money.
 * Each applies passive stat modifiers every week.
 */

/**
 * All budget presets.
 * - `id`: unique key
 * - `name`: display name
 * - `description`: short flavor text
 * - `icon`: Lucide icon name for the UI
 * - `minMoney`: minimum money stat required to select this budget
 * - `weeklyEffects`: passive stat changes applied each week while active
 */
export const BUDGET_PRESETS = [
  {
    id: 'survival',
    name: 'Survival Mode',
    description: 'Instant ramen, library water fountain, zero fun.',
    icon: 'alert-triangle',
    minMoney: 0,
    weeklyEffects: { health: -8, money: 5, grades: 2, social: -5 },
  },
  {
    id: 'ramen',
    name: 'Ramen Budget',
    description: 'Cheap eats, free campus events, lots of walking.',
    icon: 'soup',
    minMoney: 10,
    weeklyEffects: { health: -4, money: 3, grades: 0, social: -2 },
  },
  {
    id: 'balanced',
    name: 'Balanced Living',
    description: 'Cook sometimes, eat out sometimes. A normal student life.',
    icon: 'scale',
    minMoney: 25,
    weeklyEffects: { health: 0, money: -2, grades: 0, social: 0 },
  },
  {
    id: 'comfort',
    name: 'Comfort Zone',
    description: 'Meal plan, gym membership, occasional treats.',
    icon: 'armchair',
    minMoney: 40,
    weeklyEffects: { health: 3, money: -5, grades: 0, social: 2 },
  },
  {
    id: 'premium',
    name: 'Premium Living',
    description: 'Uber Eats, nice clothes, always buying rounds.',
    icon: 'crown',
    minMoney: 60,
    weeklyEffects: { health: 5, money: -10, grades: -2, social: 5 },
  },
  {
    id: 'baller',
    name: 'Campus Baller',
    description: 'VIP everything. Your wallet is crying but you look incredible.',
    icon: 'gem',
    minMoney: 80,
    weeklyEffects: { health: 3, money: -15, grades: -5, social: 8 },
  },
];

/**
 * Get budget presets with their availability based on current money.
 *
 * @param {number} currentMoney - Player's current money stat (0-100)
 * @returns {Array} Budget presets with `available` boolean added
 */
export function getAvailableBudgets(currentMoney) {
  return BUDGET_PRESETS.map((preset) => ({
    ...preset,
    available: currentMoney >= preset.minMoney,
  }));
}

/**
 * Get a specific budget preset by ID.
 *
 * @param {string} budgetId
 * @returns {Object|undefined} The budget preset or undefined
 */
export function getBudgetById(budgetId) {
  return BUDGET_PRESETS.find((b) => b.id === budgetId);
}

/**
 * Get the default budget for a given money level.
 * Returns the highest-tier budget the player can afford.
 *
 * @param {number} currentMoney
 * @returns {Object} Budget preset
 */
export function getDefaultBudget(currentMoney) {
  const affordable = BUDGET_PRESETS.filter((b) => currentMoney >= b.minMoney);
  // Return the middle affordable option, or the first if only one
  if (affordable.length <= 2) return affordable[0];
  return affordable[Math.floor(affordable.length / 2)];
}

/**
 * Validate that a budget selection is legal for the current money level.
 *
 * @param {string} budgetId - Selected budget ID
 * @param {number} currentMoney - Current money stat
 * @returns {boolean}
 */
export function isBudgetAffordable(budgetId, currentMoney) {
  const budget = getBudgetById(budgetId);
  if (!budget) return false;
  return currentMoney >= budget.minMoney;
}
