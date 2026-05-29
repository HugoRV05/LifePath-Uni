import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import useAudioStore from '../store/audioStore.js';
import audioManager from '../audio/audioManager.js';
import './AudioControls.css';

export default function AudioControls() {
  const isMuted = useAudioStore((s) => s.isMuted);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  const setAudioReady = useAudioStore((s) => s.setAudioReady);

  const handleToggle = async () => {
    await audioManager.ensureReady();
    setAudioReady();
    toggleMute();
    audioManager.syncVolumes();
    audioManager.playSfx('click');
  };

  return (
    <button
      type="button"
      className="audio-controls-btn"
      onClick={handleToggle}
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      title={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}
