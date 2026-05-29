import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore.js';
import audioManager from '../audio/audioManager.js';
import useAudioStore from '../store/audioStore.js';
import { useReducedMotion } from '../utils/useReducedMotion.js';
import './StartScreen.css';

export default function StartScreen() {
  const [name, setName] = useState('');
  const [canContinue, setCanContinue] = useState(false);
  const prefersReduced = useReducedMotion();

  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const startGame = useGameStore((s) => s.startGame);
  const loadGame = useGameStore((s) => s.loadGame);
  const clearSave = useGameStore((s) => s.clearSave);
  const hasSave = useGameStore((s) => s.hasSave);
  const setAudioReady = useAudioStore((s) => s.setAudioReady);

  useEffect(() => {
    setCanContinue(hasSave());
  }, [hasSave]);

  const motionProps = prefersReduced
    ? { initial: false, animate: { opacity: 1 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8 } };

  const handleContinue = async () => {
    await audioManager.ensureReady();
    setAudioReady();
    if (loadGame()) {
      audioManager.playSfx('click');
    }
  };

  const handleBegin = async (e) => {
    e.preventDefault();
    await audioManager.ensureReady();
    setAudioReady();
    clearSave();
    const finalName = name.trim() || 'Student';
    setPlayerName(finalName);
    startGame();
    audioManager.playSfx('click');
  };

  return (
    <motion.div className="screen start-screen" {...motionProps}>
      <div className="start-screen-content">
        <motion.div
          className="start-logo-wrap"
          initial={prefersReduced ? false : { opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ease: 'easeOut', duration: 0.8 }}
        >
          <img src="/logo.png" alt="LifePath Uni" className="start-logo" />
        </motion.div>

        <motion.p
          className="start-tagline"
          initial={prefersReduced ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Your choices, Your path, Your future.
        </motion.p>

        <motion.p
          className="start-intro"
          initial={prefersReduced ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Welcome to university. Manage your health, grades, money, and social circle week by week. Every choice dictates your future.
        </motion.p>

        <motion.form
          onSubmit={handleBegin}
          className="start-form"
          initial={prefersReduced ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="name-input-group">
            <label htmlFor="player-name-input" className="visually-hidden">
              Your name
            </label>
            <input
              type="text"
              id="player-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="name-input"
              autoComplete="name"
            />
          </div>

          {canContinue && (
            <motion.button
              type="button"
              className="btn-primary start-continue-btn"
              onClick={handleContinue}
              whileHover={prefersReduced ? {} : { scale: 1.03 }}
              whileTap={prefersReduced ? {} : { scale: 0.98 }}
            >
              Continue
            </motion.button>
          )}

          <motion.button
            type="submit"
            className={`btn-primary start-begin-btn ${canContinue ? 'start-begin-secondary' : ''}`}
            whileHover={prefersReduced ? {} : { scale: 1.03 }}
            whileTap={prefersReduced ? {} : { scale: 0.98 }}
          >
            {canContinue ? 'New game' : 'Begin'}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
}
