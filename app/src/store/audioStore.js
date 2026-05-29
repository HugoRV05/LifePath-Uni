/**
 * Audio Store (Zustand)
 * Volume, mute, and persistence to localStorage.
 */

import { create } from 'zustand';

const STORAGE_KEY = 'lifepath-audio-prefs';

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return null;
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

const saved = loadPrefs();

const useAudioStore = create((set, get) => ({
  musicVolume: saved?.musicVolume ?? 0.3,
  sfxVolume: saved?.sfxVolume ?? 0.5,
  isMuted: saved?.isMuted ?? false,
  currentTrack: null,
  isAudioReady: false,

  setMusicVolume: (volume) => {
    const v = Math.max(0, Math.min(1, volume));
    set({ musicVolume: v });
    savePrefs({ ...getPrefsSnapshot(get()), musicVolume: v });
  },

  setSfxVolume: (volume) => {
    const v = Math.max(0, Math.min(1, volume));
    set({ sfxVolume: v });
    savePrefs({ ...getPrefsSnapshot(get()), sfxVolume: v });
  },

  toggleMute: () => {
    set((state) => {
      const isMuted = !state.isMuted;
      savePrefs({ ...getPrefsSnapshot(state), isMuted });
      return { isMuted };
    });
  },

  setCurrentTrack: (trackKey) => set({ currentTrack: trackKey }),

  setAudioReady: () => set({ isAudioReady: true }),

  getEffectiveMusicVolume: () => {
    const { musicVolume, isMuted } = get();
    return isMuted ? 0 : musicVolume;
  },

  getEffectiveSfxVolume: () => {
    const { sfxVolume, isMuted } = get();
    return isMuted ? 0 : sfxVolume;
  },
}));

function getPrefsSnapshot(state) {
  return {
    musicVolume: state.musicVolume,
    sfxVolume: state.sfxVolume,
    isMuted: state.isMuted,
  };
}

export default useAudioStore;
