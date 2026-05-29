import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore.js';
import audioManager from '../audio/audioManager.js';
import useAudioStore from '../store/audioStore.js';
import StatsHUD from '../components/StatsHUD.jsx';
import EventCard from '../components/EventCard.jsx';
import './PlayingScreen.css';

const BACKGROUND_MAP = {
  dorm: '/backgrounds/dorm.jpg',
  class: '/backgrounds/class.jpg',
  party: '/backgrounds/party.jpg',
  library: '/backgrounds/library.jpg',
  cafe: '/backgrounds/cafe.jpg',
  work: '/backgrounds/work.png'
};

export default function PlayingScreen() {
  const currentWeek = useGameStore((s) => s.currentWeek);
  const currentEventIndex = useGameStore((s) => s.currentEventIndex);
  const eventQueue = useGameStore((s) => s.eventQueue);
  const makeChoice = useGameStore((s) => s.makeChoice);
  const getCurrentDay = useGameStore((s) => s.getCurrentDay);

  const event = eventQueue[currentEventIndex];
  const isAudioReady = useAudioStore((s) => s.isAudioReady);

  useEffect(() => {
    if (isAudioReady) audioManager.startAmbient();
  }, [isAudioReady]);

  if (!event) {
    return (
      <div className="screen playing-screen empty-state">
        <div className="screen-content">
          <h2>Week {currentWeek}</h2>
          <p>No events available, please check back soon.</p>
        </div>
      </div>
    );
  }

  const bgImage = BACKGROUND_MAP[event.scenario] || BACKGROUND_MAP.dorm;

  return (
    <motion.div
      className="screen playing-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dynamic Background Crossfade */}
      <div className="event-bg-wrapper">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={bgImage}
            className="event-bg"
            style={{ backgroundImage: `url(${bgImage})` }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        {/* Double gradient overlay for readability */}
        <div className="event-bg-overlay" />
      </div>

      {/* Stats HUD overlay */}
      <div className="playing-header">
        <StatsHUD />
      </div>

      {/* Week / Day Indicators with gentle slide-in */}
      <motion.div
        key={`indicators-${currentWeek}-${currentEventIndex}`}
        className="playing-indicators"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="indicator-pill">Week {currentWeek}</span>
        <span className="indicator-dot">•</span>
        <span className="indicator-pill">{getCurrentDay()}</span>
        <span className="indicator-dot">•</span>
        <span className="indicator-pill">Dilemma {currentEventIndex + 1} of {eventQueue.length}</span>
      </motion.div>

      {/* Event Dilemma Card */}
      <div className="playing-body">
        <AnimatePresence mode="wait">
          <EventCard
            key={event.id}
            event={event}
            onMakeChoice={makeChoice}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
