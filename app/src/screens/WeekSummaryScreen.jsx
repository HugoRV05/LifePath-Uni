import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore.js';
import audioManager from '../audio/audioManager.js';
import useAudioStore from '../store/audioStore.js';
import BudgetPicker from '../components/BudgetPicker.jsx';
import InfoTooltip from '../components/InfoTooltip.jsx';
import './WeekSummaryScreen.css';

const STAT_CONFIGS = [
  { key: 'health', label: 'Health', colorVar: '--color-health', bgVar: '--color-health-bg' },
  { key: 'money', label: 'Money', colorVar: '--color-money', bgVar: '--color-money-bg' },
  { key: 'grades', label: 'Grades', colorVar: '--color-grades', bgVar: '--color-grades-bg' },
  { key: 'social', label: 'Social', colorVar: '--color-social', bgVar: '--color-social-bg' }
];

export default function WeekSummaryScreen() {
  const currentWeek = useGameStore((s) => s.currentWeek);
  const stats = useGameStore((s) => s.stats);
  const getWeekDelta = useGameStore((s) => s.getWeekDelta);
  const advanceWeek = useGameStore((s) => s.advanceWeek);

  const delta = getWeekDelta();
  const isAudioReady = useAudioStore((s) => s.isAudioReady);

  useEffect(() => {
    if (isAudioReady) audioManager.playSfx('weekComplete');
  }, [isAudioReady]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 180, damping: 15 } 
    }
  };

  return (
    <motion.div
      className="screen summary-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="summary-screen-content">
        {/* Header */}
        <motion.div 
          className="summary-header"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="summary-subtitle">Semester Progress</span>
          <h2 className="summary-title">Week {currentWeek} Complete</h2>
        </motion.div>

        {/* Delta Grid */}
        <motion.div 
          className="delta-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {STAT_CONFIGS.map(({ key, label, colorVar, bgVar }) => {
            const change = delta[key] || 0;
            const currentVal = stats[key] ?? 50;

            let changeClass = 'neutral';
            let changeText = 'No change';

            if (change > 0) {
              changeClass = 'positive';
              changeText = `Up ${change}`;
            } else if (change < 0) {
              changeClass = 'negative';
              changeText = `Down ${Math.abs(change)}`;
            }

            return (
              <motion.div 
                key={key} 
                className="delta-item" 
                variants={cardVariants}
                style={{ 
                  '--accent-color': `var(${colorVar})`, 
                  '--bg-color': `var(${bgVar})` 
                }}
              >
                <span className="delta-label">{label}</span>
                <span className="delta-value">{currentVal}</span>
                <span className={`delta-change ${changeClass}`}>
                  {changeText}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Budget Selection */}
        <motion.div 
          className="budget-section"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="budget-section-header">
            <h3>Choose Budget for Week {currentWeek + 1}</h3>
            <InfoTooltip 
              message="Your budget choice dictates your weekly expenses and passive stats. It also alters your event odds, drawing activities that align with your lifestyle." 
            />
          </div>
          
          <BudgetPicker />
        </motion.div>

        {/* Next Week Button */}
        <motion.div 
          className="next-week-btn-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button 
            className="btn-primary advance-btn" 
            onClick={advanceWeek}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Week {currentWeek + 1}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
