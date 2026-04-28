/**
 * Audio Store (Zustand)
 * Controls music and SFX volumes, muting, and current track.
 */

import { create } from 'zustand';

const useAudioStore = create((set, get) => ({
  // ── State ──
  musicVolume: 0.4,
  sfxVolume: 0.6,
  isMuted: false,
  currentTrack: null,     // current background music key
  isAudioReady: false,    // true after first user interaction unlocks audio

  // ── Actions ──

  setMusicVolume: (volume) => set({ musicVolume: Math.max(0, Math.min(1, volume)) }),

  setSfxVolume: (volume) => set({ sfxVolume: Math.max(0, Math.min(1, volume)) }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  setCurrentTrack: (trackKey) => set({ currentTrack: trackKey }),

  setAudioReady: () => set({ isAudioReady: true }),

  /**
   * Get the effective music volume (considering mute).
   */
  getEffectiveMusicVolume: () => {
    const { musicVolume, isMuted } = get();
    return isMuted ? 0 : musicVolume;
  },

  /**
   * Get the effective SFX volume (considering mute).
   */
  getEffectiveSfxVolume: () => {
    const { sfxVolume, isMuted } = get();
    return isMuted ? 0 : sfxVolume;
  },
}));

export default useAudioStore;
