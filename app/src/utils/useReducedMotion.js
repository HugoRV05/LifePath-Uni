import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Returns true when the user prefers reduced motion.
 */
export function useReducedMotion() {
  return useFramerReducedMotion();
}

/**
 * Pick animated props vs static props based on reduced-motion preference.
 */
export function useMotionConfig(animated, reduced) {
  const prefersReduced = useFramerReducedMotion();
  return prefersReduced ? reduced : animated;
}
