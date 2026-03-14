import React, { useEffect } from 'react';
import GameBoard from './GameBoard';
import Controls from './Controls';
import { useGameState } from '../hooks/useGameState';

const FrogMathGame = ({ onBackToHome }) => {
  const {
    mode,
    nums,
    target,
    selected,
    remaining,
    gameStatus,
    score,
    lives,
    frogPos,
    lastAction,
    handleLeafClick,
    handleJumpBack,
    handleNewGame,
    toggleMode,
  } = useGameState();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleJumpBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJumpBack]);

  return (
    <div style={containerStyle}>
      <div style={titleAreaStyle}>
         <h1 style={titleStyle}>Frog Jump Math</h1>
      </div>
      
      <GameBoard 
        nums={nums}
        selected={selected}
        target={target}
        remaining={remaining}
        lives={lives}
        frogPos={frogPos}
        lastAction={lastAction}
        gameStatus={gameStatus}
        handleLeafClick={handleLeafClick} 
        handleJumpBack={handleJumpBack}
        handleNewGame={handleNewGame}
      />

      <Controls 
        mode={mode}
        toggleMode={toggleMode}
        handleJumpBack={handleJumpBack}
        canUndo={selected.length > 0}
      />
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '30px 10px 5px',
  minHeight: '100vh',
  width: '100%',
  background: '#1b5e20'
};

const titleAreaStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '5px'
};

const titleStyle = {
    color: '#fff',
    fontSize: '2rem',
    margin: '0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    fontFamily: 'cursive'
};

const backButtonStyle = {
    padding: '5px 15px',
    borderRadius: '10px',
    border: 'none',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    cursor: 'pointer',
    fontFamily: 'cursive'
};

export default FrogMathGame;
