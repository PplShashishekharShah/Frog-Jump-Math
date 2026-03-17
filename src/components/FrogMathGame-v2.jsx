import React, { useEffect } from 'react';
import GameBoardV2 from './GameBoard-v2';
import Controls from './Controls';
import { useGameStateV2 } from '../hooks/useGameState-v2';

const FrogMathGameV2 = ({ onBackToHome }) => {
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
  } = useGameStateV2();

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
        <div style={modeBadgeStyle}>
           {mode === 'addition' ? '✨ ADDITION POND' : '🌀 MULTIPLICATION POND'}
        </div>
        <h1 style={titleStyle}>Frog Jump Math <span style={v2BadgeStyle}>V2</span></h1>
      </div>

      <GameBoardV2
        mode={mode}
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
  background: '#1b5e20',
};
const titleAreaStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  marginBottom: '5px',
};
const titleStyle = {
  color: '#fff',
  fontSize: '2rem',
  margin: '0',
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  fontFamily: 'cursive',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};
const v2BadgeStyle = {
  background: '#FF9800',
  color: '#fff',
  borderRadius: '8px',
  padding: '2px 10px',
  fontSize: '1rem',
  fontWeight: 'bold',
  letterSpacing: '1px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
};

const modeBadgeStyle = {
  background: 'rgba(255, 255, 255, 0.2)',
  color: '#fff',
  padding: '5px 15px',
  borderRadius: '12px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  fontFamily: 'cursive',
  border: '2px solid rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(4px)',
};

export default FrogMathGameV2;
