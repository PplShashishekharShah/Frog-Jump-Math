import React, { useState } from 'react';
import HomePage from './components/HomePage';
import FrogMathGame from './components/FrogMathGame';
import TutorialMode from './components/TutorialMode';

export default function App() {
  const [screen, setScreen] = useState('home');

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#1b5e20' }}>
      {screen === 'home' && (
        <HomePage 
          onStart={() => setScreen('game')} 
          onTutorial={() => setScreen('tutorial')} 
        />
      )}
      
      {screen === 'tutorial' && (
        <TutorialMode 
          onSkip={() => setScreen('game')} 
          onFinish={() => setScreen('home')}
        />
      )}

      {screen === 'game' && (
        <FrogMathGame onBackToHome={() => setScreen('home')} />
      )}
    </div>
  );
}
