import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Banknote, GraduationCap, Users } from 'lucide-react';
import useGameStore from '../store/gameStore.js';
import './StatsHUD.css';

const STATS_CONFIG = [
  { key: 'health', label: 'Health', icon: Heart, colorVar: '--color-health', bgVar: '--color-health-bg' },
  { key: 'money', label: 'Money', icon: Banknote, colorVar: '--color-money', bgVar: '--color-money-bg' },
  { key: 'grades', label: 'Grades', icon: GraduationCap, colorVar: '--color-grades', bgVar: '--color-grades-bg' },
  { key: 'social', label: 'Social', icon: Users, colorVar: '--color-social', bgVar: '--color-social-bg' }
];

export default function StatsHUD() {
  const stats = useGameStore((s) => s.stats);
  const lastChoiceEffects = useGameStore((s) => s.lastChoiceEffects);
  const [activeToasts, setActiveToasts] = useState({});

  useEffect(() => {
    if (lastChoiceEffects) {
      const newToasts = {};
      let hasChanges = false;

      STATS_CONFIG.forEach(({ key }) => {
        const value = lastChoiceEffects[key];
        if (value && value !== 0) {
          newToasts[key] = {
            id: `${key}-${Date.now()}-${value}`,
            value
          };
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setActiveToasts(newToasts);
        const timer = setTimeout(() => {
          setActiveToasts({});
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [lastChoiceEffects]);

  return (
    <div className="stats-hud-container">
      {STATS_CONFIG.map(({ key, label, icon: Icon, colorVar, bgVar }) => {
        const val = stats[key] ?? 50;
        const toast = activeToasts[key];

        return (
          <div key={key} className="stat-hud-item" style={{ '--accent-color': `var(${colorVar})`, '--bg-color': `var(${bgVar})` }}>
            {/* Stat Header: Icon + Value & Toast container */}
            <div className="stat-hud-header">
              <div className="stat-hud-icon-wrap">
                <Icon size={16} className="stat-hud-icon" />
              </div>
              <span className="stat-hud-value">{val}</span>
              
              {/* Stat Toast Notification */}
              <AnimatePresence>
                {toast && (
                  <motion.div
                    key={toast.id}
                    className={`stat-hud-toast ${toast.value > 0 ? 'toast-positive' : 'toast-negative'}`}
                    initial={{ opacity: 0, y: toast.value > 0 ? 10 : -10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: toast.value > 0 ? -15 : 15, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {toast.value > 0 ? `+${toast.value}` : toast.value}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stat Bar */}
            <div className="stat-hud-bar-bg">
              <div
                className="stat-hud-bar-fill"
                style={{ width: `${Math.min(Math.max(val, 0), 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
