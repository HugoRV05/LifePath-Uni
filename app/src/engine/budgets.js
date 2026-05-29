/**
 * Budget System
 * 4 lifestyle presets that unlock based on current money.
 * Each applies passive stat modifiers every week.
 */

/** Map removed budget IDs from older saves to current presets */
const LEGACY_BUDGET_IDS = {
  ramen: 'balanced',
  baller: 'premium',
};

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
    name: 'Bare Minimum',
    description: 'Water fountains, skipped meals, zero fun.',
    icon: 'alert-triangle',
    minMoney: 0,
    weeklyEffects: { health: -8, money: 5, grades: 2, social: -5 },
    tags: ['frugal', 'academic', 'crisis'],
  },
  {
    id: 'balanced',
    name: 'Balanced Living',
    description: 'Cook sometimes, eat out sometimes. A normal student life.',
    icon: 'scale',
    minMoney: 30,
    weeklyEffects: { health: 0, money: -2, grades: 0, social: 0 },
    tags: [],
  },
  {
    id: 'comfort',
    name: 'Comfort Zone',
    description: 'Meal plan, gym membership, occasional treats.',
    icon: 'armchair',
    minMoney: 55,
    weeklyEffects: { health: 3, money: -5, grades: 0, social: 2 },
    tags: ['social', 'health', 'leisure'],
  },
  {
    id: 'premium',
    name: 'Premium Living',
    description: 'Uber Eats, nice clothes, always buying rounds.',
    icon: 'crown',
    minMoney: 75,
    weeklyEffects: { health: 5, money: -12, grades: -3, social: 6 },
    tags: ['social', 'luxury', 'leisure', 'splurge'],
  },
];

/**
 * Normalize budget ID (handles legacy saves).
 */
export function normalizeBudgetId(budgetId) {
  if (!budgetId) return 'balanced';
  return LEGACY_BUDGET_IDS[budgetId] || budgetId;
}

/**
 * Get budget presets with their availability based on current money.
 */
export function getAvailableBudgets(currentMoney) {
  return BUDGET_PRESETS.map((preset) => ({
    ...preset,
    available: currentMoney >= preset.minMoney,
  }));
}

/**
 * Get a specific budget preset by ID.
 */
export function getBudgetById(budgetId) {
  const id = normalizeBudgetId(budgetId);
  return BUDGET_PRESETS.find((b) => b.id === id);
}

/**
 * Get the default budget for a given money level.
 * Returns the highest-tier budget the player can afford.
 */
export function getDefaultBudget(currentMoney) {
  const affordable = BUDGET_PRESETS.filter((b) => currentMoney >= b.minMoney);
  if (affordable.length === 0) return BUDGET_PRESETS[0];
  return affordable[affordable.length - 1];
}

/**
 * Validate that a budget selection is legal for the current money level.
 */
export function isBudgetAffordable(budgetId, currentMoney) {
  const budget = getBudgetById(budgetId);
  if (!budget) return false;
  return currentMoney >= budget.minMoney;
}
