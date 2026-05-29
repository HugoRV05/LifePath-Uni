import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import audioManager from '../audio/audioManager.js';
import './EventCard.css';

// Safe text cleaning helper to prevent any dashes from rendering
const sanitizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/—/g, ', ')
    .replace(/–/g, ', ')
    .replace(/ - /g, ', ');
};

export default function EventCard({ event, onMakeChoice }) {
  const [showingOutcome, setShowingOutcome] = useState(false);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);

  const handleChoiceClick = (index) => {
    audioManager.playSfx('click');

    setShowingOutcome(true);
    setSelectedChoiceIndex(index);

    setTimeout(() => {
      onMakeChoice(index);
    }, 4000);
  };

  const choice = selectedChoiceIndex !== null ? event.choices[selectedChoiceIndex] : null;

  return (
    <motion.div 
      className="event-card-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 180 }}
    >
      <AnimatePresence mode="wait">
        {!showingOutcome ? (
          <motion.div
            key="choices-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="event-card-content"
          >
            <h3 className="event-title">{sanitizeText(event.title)}</h3>
            <p className="event-narrative">{sanitizeText(event.narrative)}</p>

            <div className="event-choices-list">
              {event.choices.map((item, i) => (
                <motion.button
                  key={i}
                  type="button"
                  className="btn-choice event-choice-btn"
                  onClick={() => handleChoiceClick(i)}
                  aria-label={`Choice: ${sanitizeText(item.text)}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { delay: i * 0.1, type: 'spring', stiffness: 150, damping: 15 } 
                  }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="choice-text">{sanitizeText(item.text)}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="outcome-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="event-card-outcome"
          >
            <p className="outcome-text">{sanitizeText(choice?.outcome)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
