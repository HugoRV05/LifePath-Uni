/**
 * Audio Manager
 * Single ambient loop plus click, week done, and game over SFX.
 * Drop files into public/audio/: ambient.mp3, click.mp3, week_done.mp3, game_over.mp3
 */

import useAudioStore from '../store/audioStore.js';

const AMBIENT_KEY = 'ambient';
const EXTENSIONS = ['mp3', 'wav', 'ogg'];

export const SFX_KEYS = {
  click: 'click',
  weekComplete: 'week_done',
  gameOver: 'game_over',
};

const SFX_FILES = Object.values(SFX_KEYS);

class AudioManager {
  constructor() {
    this.context = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.currentMusic = null;
    this.audioBuffers = new Map();
    this.isInitialized = false;
    this.ambientStarted = false;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.musicGain = this.context.createGain();
      this.musicGain.connect(this.context.destination);
      this.sfxGain = this.context.createGain();
      this.sfxGain.connect(this.context.destination);
      this.isInitialized = true;
      this.syncVolumes();

      await this.loadSoundWithFallback(AMBIENT_KEY);
      await Promise.all(SFX_FILES.map((key) => this.loadSoundWithFallback(key)));
    } catch (e) {
      console.warn('Audio not supported:', e.message);
    }
  }

  async loadSoundWithFallback(key) {
    for (const ext of EXTENSIONS) {
      const loaded = await this.loadSound(key, `/audio/${key}.${ext}`);
      if (loaded) return;
    }
  }

  syncVolumes() {
    const { getEffectiveMusicVolume, getEffectiveSfxVolume } = useAudioStore.getState();
    this.setMusicVolume(getEffectiveMusicVolume());
    this.setSfxVolume(getEffectiveSfxVolume());
  }

  setMusicVolume(volume) {
    if (this.musicGain && this.context) {
      this.musicGain.gain.setValueAtTime(volume, this.context.currentTime);
    }
  }

  setSfxVolume(volume) {
    if (this.sfxGain && this.context) {
      this.sfxGain.gain.setValueAtTime(volume, this.context.currentTime);
    }
  }

  async loadSound(key, url) {
    if (this.audioBuffers.has(key)) return true;
    if (!this.context) return false;

    try {
      const response = await fetch(url);
      if (!response.ok) return false;
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(key, audioBuffer);
      return true;
    } catch {
      return false;
    }
  }

  playSfx(sfxName) {
    const key = SFX_KEYS[sfxName] || sfxName;
    if (!this.context || !this.audioBuffers.has(key)) {
      this.playSyntheticSfx(sfxName);
      return;
    }

    const source = this.context.createBufferSource();
    source.buffer = this.audioBuffers.get(key);
    source.connect(this.sfxGain);
    source.start();
  }

  playSyntheticSfx(sfxName) {
    if (!this.context) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime;

    const presets = {
      click: { freq: 880, dur: 0.04, type: 'sine', vol: 0.08 },
      weekComplete: { freq: 440, dur: 0.2, type: 'sine', vol: 0.1 },
      gameOver: { freq: 110, dur: 0.4, type: 'sawtooth', vol: 0.1 },
    };

    const p = presets[sfxName] || presets.click;
    osc.type = p.type;
    osc.frequency.setValueAtTime(p.freq, now);
    gain.gain.setValueAtTime(p.vol * useAudioStore.getState().getEffectiveSfxVolume(), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + p.dur);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + p.dur);
  }

  startAmbient() {
    if (!this.context || !this.audioBuffers.has(AMBIENT_KEY) || this.ambientStarted) return;

    this.stopMusic();

    const source = this.context.createBufferSource();
    source.buffer = this.audioBuffers.get(AMBIENT_KEY);
    source.loop = true;
    source.connect(this.musicGain);
    source.start();
    this.currentMusic = source;
    this.ambientStarted = true;
    useAudioStore.getState().setCurrentTrack(AMBIENT_KEY);
  }

  stopMusic() {
    if (this.currentMusic) {
      try {
        this.currentMusic.stop();
      } catch {
        /* already stopped */
      }
      this.currentMusic = null;
      this.ambientStarted = false;
      useAudioStore.getState().setCurrentTrack(null);
    }
  }

  async resume() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  async ensureReady() {
    await this.init();
    await this.resume();
  }
}

const audioManager = new AudioManager();
export default audioManager;
