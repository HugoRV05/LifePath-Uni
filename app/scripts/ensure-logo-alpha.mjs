/**
 * Ensures logo.png has real transparency by removing light/checkerboard backgrounds.
 */
import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const logoPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'logo.png');

const { data, info } = await sharp(logoPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

function isBackground(r, g, b) {
  // Near-white
  if (r > 248 && g > 248 && b > 248) return true;
  // Checkerboard grays (common in baked-in transparency previews)
  const avg = (r + g + b) / 3;
  if (avg > 200 && avg < 245 && Math.abs(r - g) < 8 && Math.abs(g - b) < 8) return true;
  // Cream app background tones if baked in
  if (r > 245 && g > 243 && b > 235 && b < 252) return true;
  return false;
}

for (let i = 0; i < width * height; i++) {
  const o = i * channels;
  const r = data[o];
  const g = data[o + 1];
  const b = data[o + 2];
  if (isBackground(r, g, b)) {
    data[o + 3] = 0;
  }
}

await sharp(data, { raw: { width, height, channels: 4 } })
  .png()
  .toFile(logoPath);

console.log('logo.png updated with transparent background');
