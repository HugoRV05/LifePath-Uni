import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Scale,
  Armchair,
  Crown,
  Lock,
  Check
} from 'lucide-react';
import { BUDGET_PRESETS } from '../engine/budgets.js';
import useGameStore from '../store/gameStore.js';
import './BudgetPicker.css';

const ICON_MAP = {
  'alert-triangle': AlertTriangle,
  'scale': Scale,
  'armchair': Armchair,
  'crown': Crown,
};

export default function BudgetPicker() {
  const stats = useGameStore((s) => s.stats);
  const currentBudget = useGameStore((s) => s.currentBudget);
  const selectBudget = useGameStore((s) => s.selectBudget);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200, damping: 18 } }
  };

  return (
    <motion.div
      className="budget-grid"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {BUDGET_PRESETS.map((budget) => {
        const locked = stats.money < budget.minMoney;
        const isSelected = currentBudget === budget.id;
        const IconComponent = ICON_MAP[budget.icon] || Scale;

        return (
          <motion.button
            key={budget.id}
            variants={itemVariants}
            onClick={() => !locked && selectBudget(budget.id)}
            disabled={locked}
            className={`budget-card-btn ${isSelected ? 'selected' : ''} ${locked ? 'locked' : ''}`}
            whileTap={!locked ? { scale: 0.98 } : {}}
          >
            <div className="budget-card-left">
              <div className="budget-card-icon-wrap">
                {locked ? <Lock size={14} /> : <IconComponent size={14} />}
              </div>
              <span className="budget-card-name">{budget.name}</span>
              {locked && <span className="budget-card-min-cost">Needs ${budget.minMoney}</span>}
            </div>
            {isSelected && !locked && (
              <div className="budget-card-checked">
                <Check size={14} />
              </div>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
