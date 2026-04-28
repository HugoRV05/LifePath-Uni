/**
 * Random Utilities
 * Seeded RNG, weighted random, and other randomness helpers.
 */

/**
 * Random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick a random element from an array.
 * @param {Array} arr
 * @returns {*}
 */
export function randomPick(arr) {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Weighted random pick from an array of { item, weight } objects.
 * @param {Array<{ item: *, weight: number }>} weighted
 * @returns {*}
 */
export function weightedPick(weighted) {
  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  let random = Math.random() * totalWeight;

  for (const { item, weight } of weighted) {
    random -= weight;
    if (random <= 0) return item;
  }

  return weighted[weighted.length - 1].item;
}

/**
 * Fisher-Yates shuffle (returns new array).
 * @param {Array} arr
 * @returns {Array}
 */
export function shuffle(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
