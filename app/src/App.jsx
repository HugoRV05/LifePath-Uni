import { useEffect } from 'react';
import useGameStore from './store/gameStore.js';
import { GAME_PHASES } from './engine/weeks.js';
import { GAME_OVER_MESSAGES } from './engine/stats.js';
import './App.css';

/**
 * Root App component — screen router based on game phase.
 * Each screen will be a full component in Phase 2.
 * This is the minimal wiring to prove the engine works.
 */
function App() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const initGame = useGameStore((s) => s.initGame);

  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <div className="app-root">
      <div className="phone-frame">
        {renderScreen(gamePhase)}
      </div>
    </div>
  );
}

function renderScreen(phase) {
  switch (phase) {
    case GAME_PHASES.ONBOARDING:
      return <OnboardingPlaceholder />;
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
      return <OnboardingPlaceholder />;
  }
}

// ════════════════════════════════════════
// Temporary inline screens for Phase 1 validation.
// These will be replaced with full components in Phase 2.
// ════════════════════════════════════════

function OnboardingPlaceholder() {
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const goToAvatarCreate = useGameStore((s) => s.goToAvatarCreate);
  const startGame = useGameStore((s) => s.startGame);

  const handleStart = () => {
    setPlayerName('Player');
    startGame();
  };

  return (
    <div className="screen onboarding-screen">
      <div className="screen-content">
        <div className="onboarding-icon">🎓</div>
        <h1>LifePath Uni</h1>
        <p className="lead">Your choices. Your semester. Your story.</p>
        <p className="subtitle">
          Navigate 15 weeks of university life — manage your health, money, grades,
          and social life through every dilemma. No choice is free.
        </p>
        <button className="btn-primary start-btn" onClick={handleStart}>
          Begin Your Semester
        </button>
      </div>
    </div>
  );
}

function AvatarPlaceholder() {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <div className="screen">
      <div className="screen-content">
        <h2>Avatar Creator</h2>
        <p>Coming in Phase 3</p>
        <button className="btn-primary" onClick={startGame}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function PlayingScreen() {
  const currentWeek = useGameStore((s) => s.currentWeek);
  const stats = useGameStore((s) => s.stats);
  const currentEventIndex = useGameStore((s) => s.currentEventIndex);
  const eventQueue = useGameStore((s) => s.eventQueue);
  const makeChoice = useGameStore((s) => s.makeChoice);
  const getCurrentDay = useGameStore((s) => s.getCurrentDay);

  const event = eventQueue[currentEventIndex];

  if (!event) {
    return (
      <div className="screen">
        <div className="screen-content">
          <h2>Week {currentWeek}</h2>
          <p>No events available. The event deck needs more content!</p>
        </div>
      </div>
    );
  }

  const backgroundMap = {
    dorm: '/backgrounds/dorm.jpg',
    class: '/backgrounds/class.jpg',
    party: '/backgrounds/party.jpg',
    library: '/backgrounds/library.jpg',
    cafe: '/backgrounds/cafe.jpg',
  };

  const bgImage = backgroundMap[event.scenario] || backgroundMap.dorm;

  return (
    <div className="screen playing-screen">
      {/* Background */}
      <div
        className="event-bg"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="event-bg-overlay" />

      {/* Stats HUD */}
      <div className="stats-hud">
        <div className="stat-item stat-health">
          <span className="stat-label">HP</span>
          <div className="stat-bar">
            <div className="stat-fill" style={{ width: `${stats.health}%` }} />
          </div>
          <span className="stat-value">{stats.health}</span>
        </div>
        <div className="stat-item stat-money">
          <span className="stat-label">$</span>
          <div className="stat-bar">
            <div className="stat-fill" style={{ width: `${stats.money}%` }} />
          </div>
          <span className="stat-value">{stats.money}</span>
        </div>
        <div className="stat-item stat-grades">
          <span className="stat-label">GR</span>
          <div className="stat-bar">
            <div className="stat-fill" style={{ width: `${stats.grades}%` }} />
          </div>
          <span className="stat-value">{stats.grades}</span>
        </div>
        <div className="stat-item stat-social">
          <span className="stat-label">SC</span>
          <div className="stat-bar">
            <div className="stat-fill" style={{ width: `${stats.social}%` }} />
          </div>
          <span className="stat-value">{stats.social}</span>
        </div>
      </div>

      {/* Week / Day indicator */}
      <div className="week-indicator">
        Week {currentWeek} · {getCurrentDay()} · Event {currentEventIndex + 1}/{eventQueue.length}
      </div>

      {/* Event Card */}
      <div className="event-card">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-narrative">{event.narrative}</p>

        <div className="event-choices">
          {event.choices.map((choice, i) => (
            <button
              key={i}
              className="btn-choice"
              onClick={() => makeChoice(i)}
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function WeekSummaryScreen() {
  const currentWeek = useGameStore((s) => s.currentWeek);
  const stats = useGameStore((s) => s.stats);
  const getWeekDelta = useGameStore((s) => s.getWeekDelta);
  const currentBudget = useGameStore((s) => s.currentBudget);
  const selectBudget = useGameStore((s) => s.selectBudget);
  const advanceWeek = useGameStore((s) => s.advanceWeek);

  const delta = getWeekDelta();

  const budgets = [
    { id: 'survival', name: 'Survival Mode', min: 0 },
    { id: 'ramen', name: 'Ramen Budget', min: 10 },
    { id: 'balanced', name: 'Balanced Living', min: 25 },
    { id: 'comfort', name: 'Comfort Zone', min: 40 },
    { id: 'premium', name: 'Premium Living', min: 60 },
    { id: 'baller', name: 'Campus Baller', min: 80 },
  ];

  return (
    <div className="screen summary-screen">
      <div className="screen-content">
        <h2>Week {currentWeek} Complete</h2>

        <div className="delta-grid">
          {['health', 'money', 'grades', 'social'].map((stat) => (
            <div key={stat} className={`delta-item delta-${stat}`}>
              <span className="delta-label">{stat}</span>
              <span className="delta-value">{stats[stat]}</span>
              <span className={`delta-change ${delta[stat] >= 0 ? 'positive' : 'negative'}`}>
                {delta[stat] >= 0 ? '+' : ''}{delta[stat]}
              </span>
            </div>
          ))}
        </div>

        <h3>Choose Budget for Week {currentWeek + 1}</h3>
        <div className="budget-list">
          {budgets.map((b) => {
            const locked = stats.money < b.min;
            return (
              <button
                key={b.id}
                className={`btn-choice budget-option ${currentBudget === b.id ? 'selected' : ''} ${locked ? 'locked' : ''}`}
                onClick={() => !locked && selectBudget(b.id)}
                disabled={locked}
              >
                {b.name} {locked ? '🔒' : ''}
                {currentBudget === b.id && ' ✓'}
              </button>
            );
          })}
        </div>

        <button className="btn-primary" onClick={advanceWeek}>
          Start Week {currentWeek + 1}
        </button>
      </div>
    </div>
  );
}

function GameOverScreen() {
  const gameOverCause = useGameStore((s) => s.gameOverCause);
  const restartGame = useGameStore((s) => s.restartGame);

  const msg = GAME_OVER_MESSAGES[gameOverCause] || {
    title: 'Game Over',
    subtitle: 'Something went wrong.',
    description: 'Your semester has ended early.',
  };

  return (
    <div className="screen gameover-screen">
      <div className="screen-content">
        <h1>{msg.title}</h1>
        <h3>{msg.subtitle}</h3>
        <p>{msg.description}</p>
        <button className="btn-primary" onClick={restartGame}>
          Try Again
        </button>
      </div>
    </div>
  );
}

function EndingScreen() {
  const ending = useGameStore((s) => s.ending);
  const restartGame = useGameStore((s) => s.restartGame);

  if (!ending) return null;

  return (
    <div className="screen ending-screen">
      <div className="screen-content">
        <h1>{ending.headline}</h1>
        <div className="life-score">
          <span className="score-number">{ending.lifeScore}</span>
          <span className="score-label">/ 100</span>
        </div>

        {ending.combo && (
          <div className="combo-badge">
            <span className="combo-rarity">{ending.combo.rarity}</span>
            <p>{ending.combo.text}</p>
          </div>
        )}

        <div className="ending-fragments">
          {Object.entries(ending.fragments).map(([stat, fragment]) => (
            <div key={stat} className={`fragment fragment-${stat}`}>
              <h4>{fragment.label}</h4>
              <p>{fragment.text}</p>
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={restartGame}>
          Play Again
        </button>
      </div>
    </div>
  );
}

export default App;
