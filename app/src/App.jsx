import React, { useEffect, useState } from 'react';
import useGameStore from './store/gameStore.js';
import { GAME_PHASES } from './engine/weeks.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import AudioControls from './components/AudioControls.jsx';
import StartScreen from './screens/StartScreen.jsx';
import PlayingScreen from './screens/PlayingScreen.jsx';
import WeekSummaryScreen from './screens/WeekSummaryScreen.jsx';
import GameOverScreen from './screens/GameOverScreen.jsx';
import EndingScreen from './screens/EndingScreen.jsx';
import './App.css';

function App() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const initGame = useGameStore((s) => s.initGame);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initGame();
    const t = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(t);
  }, [initGame]);

  if (!isReady) {
    return (
      <div className="app-loading" aria-busy="true" aria-label="Loading LifePath Uni">
        <img src="/logo.png" alt="" className="app-loading-logo" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app-root">
        <div className="phone-frame">
          <AudioControls />
          {renderScreen(gamePhase)}
        </div>
      </div>
    </ErrorBoundary>
  );
}

function renderScreen(phase) {
  switch (phase) {
    case GAME_PHASES.ONBOARDING:
      return <StartScreen />;
    case GAME_PHASES.AVATAR_CREATE:
      return <AvatarPlaceholder />;
    case GAME_PHASES.PLAYING:
      return <PlayingScreen />;
    case GAME_PHASES.WEEK_SUMMARY:
      return <WeekSummaryScreen />;
    case GAME_PHASES.GAME_OVER:
      return <GameOverScreen />;
    case GAME_PHASES.ENDING:
      return <EndingScreen />;
    default:
      return <StartScreen />;
  }
}

function AvatarPlaceholder() {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <div className="screen avatar-screen">
      <div className="screen-content">
        <h2>Avatar Creator</h2>
        <p className="lead">Create your custom student profile</p>
        <p className="subtitle">Coming in a future update. Skip to start your semester now.</p>
        <button type="button" className="btn-primary" onClick={startGame}>
          Skip to Semester
        </button>
      </div>
    </div>
  );
}

export default App;
