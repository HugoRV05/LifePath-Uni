/**
 * Endings Engine
 * Modular ending assembly: stat-based fragments, combo endings, and scoring.
 */

/**
 * Stat tier thresholds.
 * Each stat maps to a tier based on its final value.
 */
const TIER_THRESHOLDS = [
  { tier: 'terrible', min: 0, max: 25 },
  { tier: 'poor', min: 26, max: 50 },
  { tier: 'good', min: 51, max: 75 },
  { tier: 'excellent', min: 76, max: 100 },
];

/**
 * Get the tier for a stat value.
 * @param {number} value - Stat value (0-100)
 * @returns {string} 'terrible' | 'poor' | 'good' | 'excellent'
 */
export function getStatTier(value) {
  for (const { tier, min, max } of TIER_THRESHOLDS) {
    if (value >= min && value <= max) return tier;
  }
  return 'poor'; // fallback
}

/**
 * Ending fragments for each stat at each tier.
 * These are assembled into the final ending narrative.
 */
export const ENDING_FRAGMENTS = {
  health: {
    terrible: {
      label: 'Burnt Out',
      text: "Your body is a wreck. Months of skipping meals, pulling all-nighters, and ignoring every warning sign have left you running on fumes. The semester broke you physically, and it's going to take a long summer to recover.",
    },
    poor: {
      label: 'Running on Empty',
      text: "You survived, but barely. Between the stress headaches and the caffeine dependency, your body has been sending you signals you've mostly ignored. You're going to need a serious reset over the break.",
    },
    good: {
      label: 'Healthy Enough',
      text: "You managed to take care of yourself reasonably well. Sure, there were some late nights and questionable meal choices, but overall you're finishing the semester feeling functional. Not bad.",
    },
    excellent: {
      label: 'Peak Condition',
      text: "You somehow managed to thrive physically through an entire university semester. Regular sleep, decent food, and actual exercise — you're basically a unicorn among students. People genuinely don't understand how you did it.",
    },
  },
  money: {
    terrible: {
      label: 'Flat Broke',
      text: "Your bank balance is a horror story. You owe money to friends, your overdraft is maxed, and you've been living off free samples for the last two weeks. Summer job hunting starts... immediately.",
    },
    poor: {
      label: 'Scraping By',
      text: "Money was a constant stress. You made it through, but not without some desperate moments — selling textbooks you still needed, skipping meals to save a few pounds, and checking your bank app with one eye closed.",
    },
    good: {
      label: 'Financially Stable',
      text: "You handled your finances pretty well. There were some splurges you probably didn't need, but you're ending the semester with money in your pocket and no panicked calls to your parents.",
    },
    excellent: {
      label: 'Loaded',
      text: "You're finishing the semester richer than you started. Smart budgeting, that part-time job, and an almost suspicious ability to avoid impulse purchases have left your bank account looking very healthy.",
    },
  },
  grades: {
    terrible: {
      label: 'Academic Disaster',
      text: "Let's not sugarcoat it — your grades are terrible. Multiple failed modules, missed assignments, and at least one exam you're pretty sure you wrote your name wrong on. The academic review board would like a word.",
    },
    poor: {
      label: 'Below Average',
      text: "Your transcript is... not great. You scraped by in most modules, but there's definitely a resit or two in your future. You know you could've done better. Your parents definitely know you could've done better.",
    },
    good: {
      label: 'Solid Student',
      text: "You put in the work and it shows. Your grades are respectable — not valedictorian material, but solidly above average. You can hand this transcript to anyone without cringing.",
    },
    excellent: {
      label: 'Top of the Class',
      text: "Dean's list. First-class honours territory. You absolutely crushed it academically. Professors know your name (for the right reasons), and your transcript is a thing of beauty.",
    },
  },
  social: {
    terrible: {
      label: 'Invisible',
      text: "You're finishing the semester as a ghost. No close friends, no group chats, no one to grab a coffee with. The loneliness was the hardest part — harder than any exam or budget crisis.",
    },
    poor: {
      label: 'Acquaintances Only',
      text: "You know people. People know you. But genuine friendships? Not really. You have a few contacts you could text, but no one who'd drop everything for you. University felt... lonely.",
    },
    good: {
      label: 'Solid Circle',
      text: "You built a genuine friend group. People you study with, eat with, and actually enjoy being around. Not a massive social butterfly, but you've got real connections that'll last beyond this semester.",
    },
    excellent: {
      label: 'Campus Legend',
      text: "Everyone knows you. You're in every group chat, invited to every event, and people genuinely light up when you walk in. You've built something rare — a real community. These friendships are going to last years.",
    },
  },
};

/**
 * Combo endings for specific stat combinations.
 * Checked in order — first match wins.
 */
export const COMBO_ENDINGS = [
  {
    id: 'perfect_student',
    title: 'The Perfect Semester',
    condition: (stats) =>
      stats.health >= 80 && stats.money >= 80 && stats.grades >= 80 && stats.social >= 80,
    text: "Against all odds, you did it all. Perfect health, full wallet, stellar grades, and a thriving social life. People will talk about your semester in hushed, reverent tones. Are you even real?",
    rarity: 'legendary',
  },
  {
    id: 'rock_bottom',
    title: 'Rock Bottom',
    condition: (stats) =>
      stats.health <= 25 && stats.money <= 25 && stats.grades <= 25 && stats.social <= 25,
    text: "Everything fell apart. Health, finances, grades, friendships — all of it. This semester was a trainwreck from start to finish. But hey, you survived. That counts for something. Time to start rebuilding.",
    rarity: 'legendary',
  },
  {
    id: 'popular_dropout',
    title: 'The Popular Dropout',
    condition: (stats) => stats.social >= 75 && stats.grades <= 25,
    text: "You're the life of the party and the death of your GPA. Everyone loves you, but your transcript tells a very different story. Was it worth it? Your friends say yes. Your parents say no.",
    rarity: 'rare',
  },
  {
    id: 'lonely_genius',
    title: 'The Lonely Genius',
    condition: (stats) => stats.grades >= 80 && stats.social <= 25,
    text: "Straight A's. Zero friends. You aced every exam from the solitude of your dorm room. Brilliance has a price, and yours was human connection.",
    rarity: 'rare',
  },
  {
    id: 'rich_dropout',
    title: 'The Rich Dropout',
    condition: (stats) => stats.money >= 80 && stats.grades <= 25,
    text: "Your bank account is thriving but your education is not. You worked so many shifts you forgot to actually go to university. Financially responsible, academically catastrophic.",
    rarity: 'rare',
  },
  {
    id: 'broke_genius',
    title: 'The Broke Scholar',
    condition: (stats) => stats.grades >= 80 && stats.money <= 25,
    text: "You chose knowledge over wealth. Your grades are incredible but your wallet is a barren wasteland. At least your degree will be worth something... eventually.",
    rarity: 'rare',
  },
  {
    id: 'party_animal',
    title: 'The Party Animal',
    condition: (stats) => stats.social >= 75 && stats.health <= 30,
    text: "You partied like every night was your last — and your body is starting to agree. Your social calendar was legendary, but your liver and sleep schedule are filing for divorce.",
    rarity: 'uncommon',
  },
  {
    id: 'hermit',
    title: 'The Hermit',
    condition: (stats) => stats.health >= 75 && stats.grades >= 75 && stats.social <= 30,
    text: "Healthy body, sharp mind, empty contacts list. You optimized your semester for maximum productivity and zero human interaction. Efficient? Yes. Fulfilling? That's... debatable.",
    rarity: 'uncommon',
  },
  {
    id: 'survivalist',
    title: 'The Survivalist',
    condition: (stats) => {
      const vals = [stats.health, stats.money, stats.grades, stats.social];
      return vals.every((v) => v >= 30 && v <= 60);
    },
    text: "Nothing spectacular, nothing disastrous. You walked the tightrope of mediocrity with impressive consistency. Average at everything, failing at nothing. There's a strange nobility in that.",
    rarity: 'uncommon',
  },
];

/**
 * Headline titles based on overall life score.
 */
const SCORE_HEADLINES = [
  { min: 0, max: 20, title: 'A Semester to Forget', emoji: '💀' },
  { min: 21, max: 40, title: 'Rough Around the Edges', emoji: '😬' },
  { min: 41, max: 55, title: 'Survived the Semester', emoji: '😅' },
  { min: 56, max: 70, title: 'A Solid Semester', emoji: '😊' },
  { min: 71, max: 85, title: 'Impressive Performance', emoji: '🎉' },
  { min: 86, max: 100, title: 'Absolutely Legendary', emoji: '👑' },
];

/**
 * Assemble the full ending from final stats.
 *
 * @param {Object} stats - Final stats { health, money, grades, social }
 * @returns {Object} Complete ending object
 */
export function assembleEnding(stats) {
  const lifeScore = Math.round(
    (stats.health + stats.money + stats.grades + stats.social) / 4
  );

  // Get individual stat fragments
  const fragments = {};
  const tiers = {};
  for (const stat of ['health', 'money', 'grades', 'social']) {
    const tier = getStatTier(stats[stat]);
    tiers[stat] = tier;
    fragments[stat] = ENDING_FRAGMENTS[stat][tier];
  }

  // Check for combo endings (first match wins)
  let combo = null;
  for (const comboEnding of COMBO_ENDINGS) {
    if (comboEnding.condition(stats)) {
      combo = {
        id: comboEnding.id,
        title: comboEnding.title,
        text: comboEnding.text,
        rarity: comboEnding.rarity,
      };
      break;
    }
  }

  // Get headline from score
  const headline =
    SCORE_HEADLINES.find((h) => lifeScore >= h.min && lifeScore <= h.max) ||
    SCORE_HEADLINES[2]; // fallback

  return {
    lifeScore,
    headline: combo ? combo.title : headline.title,
    isCombo: !!combo,
    combo,
    tiers,
    fragments,
    stats: { ...stats },
  };
}

/**
 * Get a list of all combo ending IDs (for achievement tracking).
 * @returns {string[]}
 */
export function getAllComboIds() {
  return COMBO_ENDINGS.map((c) => c.id);
}
