/**
 * Avatar Cropper Utility
 * CSS coordinates for cropping individual quadrants from 2x2 grid images.
 *
 * All avatar assets are stored as 2x2 grids:
 *   [0] Top-left     [1] Top-right
 *   [2] Bottom-left   [3] Bottom-right
 *
 * We use CSS `object-position` + `object-fit` to display individual quadrants.
 */

/**
 * Get CSS styles to display a specific quadrant from a 2x2 grid image.
 *
 * @param {number} index - Quadrant index (0-3): TL=0, TR=1, BL=2, BR=3
 * @param {number} displaySize - Desired display size in pixels (square)
 * @returns {Object} CSS style object for use in React
 */
export function getQuadrantStyle(index, displaySize = 200) {
  // Position offsets for each quadrant
  const positions = [
    { objectPosition: '0% 0%' },      // Top-left
    { objectPosition: '100% 0%' },     // Top-right
    { objectPosition: '0% 100%' },     // Bottom-left
    { objectPosition: '100% 100%' },   // Bottom-right
  ];

  const pos = positions[index] || positions[0];

  return {
    width: `${displaySize}px`,
    height: `${displaySize}px`,
    objectFit: 'cover',
    objectPosition: pos.objectPosition,
    // Scale the image to show only one quadrant
    // The image is 2x the display size, so we use 200% 
  };
}

/**
 * Get clip-path CSS to crop a quadrant from a 2x2 grid.
 * This approach uses clip-path + transform for pixel-perfect cropping.
 *
 * @param {number} index - Quadrant index (0-3)
 * @returns {Object} CSS style object
 */
export function getQuadrantClipStyle(index) {
  const clips = [
    { clipPath: 'inset(0% 50% 50% 0%)',   transform: 'scale(2)', transformOrigin: 'top left' },
    { clipPath: 'inset(0% 0% 50% 50%)',   transform: 'scale(2)', transformOrigin: 'top right' },
    { clipPath: 'inset(50% 50% 0% 0%)',   transform: 'scale(2)', transformOrigin: 'bottom left' },
    { clipPath: 'inset(50% 0% 0% 50%)',   transform: 'scale(2)', transformOrigin: 'bottom right' },
  ];

  return clips[index] || clips[0];
}

/**
 * Avatar asset paths.
 */
export const AVATAR_ASSETS = {
  bodies: '/avatar/character.png',
  clothesFeminine: '/avatar/clothes.png',
  hairFeminine: '/avatar/hairs.png',
  hairMasculine: '/avatar/hairs_male.png',
};

/**
 * Labels for each avatar option.
 */
export const AVATAR_LABELS = {
  skinTones: ['Light', 'Olive', 'Brown', 'Dark'],
  hairFeminine: ['Short Straight', 'Long Flowing', 'Curly Afro', 'Messy Bun'],
  hairMasculine: ['Textured Crop', 'Curtain Hair', 'Dreads/Fade', 'Messy Fringe'],
  outfits: ['Hoodie', 'Varsity Jacket', 'Tank Top', 'Button-Down'],
};
