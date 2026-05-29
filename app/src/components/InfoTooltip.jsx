import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import './InfoTooltip.css';

/**
 * A beautiful, accessible information tooltip modal.
 * Shows an info icon button that, when clicked, displays a descriptive popup overlay.
 */
export default function InfoTooltip({ message, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTooltip = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`info-tooltip-container ${className}`}>
      <button
        type="button"
        className="info-tooltip-trigger"
        onClick={toggleTooltip}
        aria-label="More information"
        title="More information"
      >
        <Info size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="info-tooltip-portal" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <motion.div
              className="info-tooltip-backdrop"
              initial={{ opacity: 0 }}
              aria-hidden="true"
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleTooltip}
            />

            {/* Content modal */}
            <motion.div
              className="info-tooltip-content"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              <div className="info-tooltip-header">
                <h3>Information</h3>
                <button
                  type="button"
                  className="info-tooltip-close"
                  onClick={toggleTooltip}
                  aria-label="Close tooltip"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="info-tooltip-text">{message}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
