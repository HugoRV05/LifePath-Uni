import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import audioManager from '../audio/audioManager.js';
import useAudioStore from '../store/audioStore.js';
import { AlertOctagon } from 'lucide-react';
import useGameStore from '../store/gameStore.js';
import { GAME_OVER_MESSAGES } from '../engine/stats.js';
import './GameOverScreen.css';

const sanitizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/—/g, ', ')
    .replace(/–/g, ', ')
    .replace(/ - /g, ', ');
};

export default function GameOverScreen() {
  const gameOverCause = useGameStore((s) => s.gameOverCause);
  const restartGame = useGameStore((s) => s.restartGame);

  const isAudioReady = useAudioStore((s) => s.isAudioReady);

  useEffect(() => {
    if (isAudioReady) {
      audioManager.stopMusic();
      audioManager.playSfx('gameOver');
    }
  }, [isAudioReady]);

  const msg = GAME_OVER_MESSAGES[gameOverCause] || {
    title: 'Semester Ended Early',
    subtitle: 'You could not keep up with the demands.',
    description: 'Your semester came to an abrupt halt. Balancing university life is hard, but do not give up now.'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } }
  };

  return (
    <motion.div
      className="screen gameover-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="gameover-content"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div className="gameover-icon-box" variants={itemVariants}>
          <AlertOctagon size={48} className="gameover-alert-icon" />
        </motion.div>

        <motion.h1 className="gameover-title" variants={itemVariants}>
          {sanitizeText(msg.title)}
        </motion.h1>

        <motion.h3 className="gameover-subtitle" variants={itemVariants}>
          {sanitizeText(msg.subtitle)}
        </motion.h3>

        <motion.p className="gameover-desc" variants={itemVariants}>
          {sanitizeText(msg.description)}
        </motion.p>

        <motion.div className="gameover-actions" variants={itemVariants}>
          <motion.button
            className="btn-primary retry-btn"
            onClick={restartGame}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
