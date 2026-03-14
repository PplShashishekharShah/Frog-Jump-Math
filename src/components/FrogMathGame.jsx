import React, { useEffect } from 'react';
import GameBoard from './GameBoard';
import Controls from './Controls';
import { useGameState } from '../hooks/useGameState';

const FrogMathGame = () => {
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
      <h1 style={titleStyle}>Frog Jump Math</h1>
      
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
  padding: '20px',
  minHeight: '100vh',
  width: '100%',
  background: '#1b5e20'
};

const titleStyle = {
    color: '#fff',
    fontSize: '3rem',
    marginBottom: '20px',
    textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
    fontFamily: 'cursive'
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  backdropFilter: 'blur(8px)'
};

const modalStyle = {
  background: '#fff',
  padding: '50px',
  borderRadius: '30px',
  textAlign: 'center',
  boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
  maxWidth: '500px',
  width: '90%',
  border: '8px solid #4CAF50'
};

const modalButtonStyle = {
  padding: '15px 40px',
  border: 'none',
  borderRadius: '15px',
  background: '#2196F3',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1.2rem',
  boxShadow: '0 5px 0 rgba(0,0,0,0.2)'
};

export default FrogMathGame;
