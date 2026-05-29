import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import audioManager from '../audio/audioManager.js';
import { Award, RefreshCw } from 'lucide-react';
import useGameStore from '../store/gameStore.js';
import './EndingScreen.css';

const sanitizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/—/g, ', ')
    .replace(/–/g, ', ')
    .replace(/ - /g, ', ');
};

const STAT_CONFIGS = [
  { key: 'health', label: 'Health Status', colorVar: '--color-health', bgVar: '--color-health-bg' },
  { key: 'money', label: 'Financial Status', colorVar: '--color-money', bgVar: '--color-money-bg' },
  { key: 'grades', label: 'Academic Status', colorVar: '--color-grades', bgVar: '--color-grades-bg' },
  { key: 'social', label: 'Social Status', colorVar: '--color-social', bgVar: '--color-social-bg' }
];

export default function EndingScreen() {
  const ending = useGameStore((s) => s.ending);
  const restartGame = useGameStore((s) => s.restartGame);

  useEffect(() => {
    audioManager.stopMusic();
  }, []);

  if (!ending) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 180, damping: 15 } 
    }
  };

  return (
    <motion.div
      className="screen ending-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="ending-content"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Title */}
        <motion.div className="ending-header" variants={itemVariants}>
          <span className="ending-subtitle">Semester Recap</span>
          <h1 className="ending-headline">{sanitizeText(ending.headline)}</h1>
        </motion.div>

        {/* Life Score Display */}
        <motion.div className="life-score-card" variants={itemVariants}>
          <span className="score-label">Life Score</span>
          <div className="score-circle">
            <span className="score-number">{ending.lifeScore}</span>
            <span className="score-total">/ 100</span>
          </div>
        </motion.div>

        {/* Special Combo Badge */}
        {ending.combo && (
          <motion.div className="combo-badge-card" variants={itemVariants}>
            <div className="combo-badge-header">
              <Award className="combo-icon" size={18} />
              <span className="combo-rarity">{sanitizeText(ending.combo.rarity)} Achievement</span>
            </div>
            <p className="combo-text">{sanitizeText(ending.combo.text)}</p>
          </motion.div>
        )}

        {/* Stat Fragments Staggered List */}
        <motion.div className="ending-fragments-list" variants={containerVariants}>
          {STAT_CONFIGS.map(({ key, label, colorVar, bgVar }) => {
            const frag = ending.fragments?.[key];
            if (!frag) return null;

            return (
              <motion.div
                key={key}
                className="ending-fragment-card"
                variants={itemVariants}
                style={{
                  '--accent-color': `var(${colorVar})`,
                  '--bg-color': `var(${bgVar})`
                }}
              >
                <div className="fragment-header">
                  <span className="fragment-label">{label}</span>
                  <span className="fragment-tier">{sanitizeText(frag.label)}</span>
                </div>
                <p className="fragment-text">{sanitizeText(frag.text)}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Play Again Button */}
        <motion.div className="ending-actions" variants={itemVariants}>
          <motion.button
            className="btn-primary replay-btn"
            onClick={restartGame}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw size={16} className="btn-icon" />
            Play Again
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
