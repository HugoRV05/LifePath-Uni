/**
 * Placeholder audio (until you add MP3s) and PWA icons from logo.
 * Expected audio files: ambient.mp3, click.mp3, week_done.mp3, game_over.mp3
 */

import { writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const audioDir = join(publicDir, 'audio');
const iconsDir = join(publicDir, 'icons');

function createSilentWav(durationSec = 2, sampleRate = 22050) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  return buffer;
}

mkdirSync(audioDir, { recursive: true });
mkdirSync(iconsDir, { recursive: true });

const keep = new Set(['ambient.wav', 'click.wav', 'week_done.wav', 'game_over.wav', '.gitkeep']);
for (const file of readdirSync(audioDir)) {
  if (!keep.has(file)) {
    unlinkSync(join(audioDir, file));
    console.log(`Removed old audio/${file}`);
  }
}

const silentShort = createSilentWav(0.15);
const silentLoop = createSilentWav(3);

for (const [name, buf] of [
  ['ambient', silentLoop],
  ['click', silentShort],
  ['week_done', silentShort],
  ['game_over', createSilentWav(0.5)],
]) {
  writeFileSync(join(audioDir, `${name}.wav`), buf);
  console.log(`Created audio/${name}.wav (replace with ${name}.mp3 when ready)`);
}

const iconSource = join(iconsDir, 'icon-source.png');
const logoPath = join(publicDir, 'logo.png');
const sourceForIcons = existsSync(iconSource) ? iconSource : logoPath;

if (existsSync(sourceForIcons)) {
  try {
    execSync(
      `npx --yes sharp-cli resize 192 192 --input "${sourceForIcons}" --output "${join(iconsDir, 'icon-192.png')}"`,
      { stdio: 'inherit', cwd: join(__dirname, '..') }
    );
    execSync(
      `npx --yes sharp-cli resize 512 512 --input "${sourceForIcons}" --output "${join(iconsDir, 'icon-512.png')}"`,
      { stdio: 'inherit', cwd: join(__dirname, '..') }
    );
    console.log(`Regenerated PWA icons from ${existsSync(iconSource) ? 'icons/icon-source.png' : 'logo.png'}`);
  } catch (e) {
    console.warn('Icon resize failed:', e.message);
  }
}

console.log('Done.');
