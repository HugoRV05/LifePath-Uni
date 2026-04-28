/**
 * Audio Manager
 * Wrapper for Web Audio API. Handles music loops, SFX, and crossfading.
 * Will be fully implemented in Phase 5 — this is the architecture stub.
 */

class AudioManager {
  constructor() {
    this.context = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.currentMusic = null;
    this.audioBuffers = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize audio context (must be called from a user gesture).
   */
  async init() {
    if (this.isInitialized) return;

    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();

      // Master gain nodes
      this.musicGain = this.context.createGain();
      this.musicGain.connect(this.context.destination);

      this.sfxGain = this.context.createGain();
      this.sfxGain.connect(this.context.destination);

      this.isInitialized = true;
    } catch (e) {
      console.warn('Audio not supported:', e.message);
    }
  }

  /**
   * Set music volume (0-1).
   */
  setMusicVolume(volume) {
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(volume, this.context.currentTime);
    }
  }

  /**
   * Set SFX volume (0-1).
   */
  setSfxVolume(volume) {
    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(volume, this.context.currentTime);
    }
  }

  /**
   * Load an audio file into the buffer cache.
   * @param {string} key - Unique identifier for the sound
   * @param {string} url - URL to the audio file
   */
  async loadSound(key, url) {
    if (this.audioBuffers.has(key)) return;
    if (!this.context) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(key, audioBuffer);
    } catch (e) {
      console.warn(`Failed to load sound "${key}":`, e.message);
    }
  }

  /**
   * Play a one-shot sound effect.
   * @param {string} key - Sound key from loadSound
   */
  playSfx(key) {
    if (!this.context || !this.audioBuffers.has(key)) return;

    const source = this.context.createBufferSource();
    source.buffer = this.audioBuffers.get(key);
    source.connect(this.sfxGain);
    source.start();
  }

  /**
   * Play background music (looped). Stops current music first.
   * @param {string} key - Sound key from loadSound
   */
  playMusic(key) {
    if (!this.context || !this.audioBuffers.has(key)) return;

    // Stop current music
    this.stopMusic();

    const source = this.context.createBufferSource();
    source.buffer = this.audioBuffers.get(key);
    source.loop = true;
    source.connect(this.musicGain);
    source.start();
    this.currentMusic = source;
  }

  /**
   * Stop currently playing music.
   */
  stopMusic() {
    if (this.currentMusic) {
      try {
        this.currentMusic.stop();
      } catch (e) {
        // Already stopped
      }
      this.currentMusic = null;
    }
  }

  /**
   * Resume audio context if suspended (browser autoplay policy).
   */
  async resume() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }
}

// Singleton instance
const audioManager = new AudioManager();
export default audioManager;
