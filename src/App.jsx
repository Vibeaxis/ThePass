
import React, { useState, useEffect } from 'react';
import { GameProvider } from './contexts/GameContext';
import Game from './components/Game';
import TitleScreen from './components/TitleScreen';
import CareerScreen from './components/CareerScreen';

// INTERNAL HELPER - Simple local check
const checkSave = () => {
  try {
    const data = localStorage.getItem('the_pass_save_data_v1');
    return data !== null && data !== undefined && data !== '';
  } catch (e) {
    return false;
  }
};

const AppContent = () => {
  const [view, setView] = useState('title'); // 'title', 'game', 'career'
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    setHasSave(checkSave());
  }, [view]);

  if (view === 'career') {
    return <CareerScreen onBack={() => setView('title')} />;
  }

  if (view === 'title') {
    return (
      <TitleScreen
        onStartNewGame={() => setView('game')}
        onContinueGame={() => setView('game')}
        onViewCareer={() => setView('career')}
        hasSave={hasSave}
      />
    );
  }

  return <Game onReturnToTitle={() => setView('title')} />;
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
