import React, { useEffect, useRef, useState } from 'react';
import LilyPad from './LilyPad';
import Frog from './Frog';
import PathLine from './PathLine';
import { BG_IMG, START_LABEL_IMG } from '../constants/images';
import { GRID_ROWS, GRID_COLS } from '../constants/gameConstants';
import frogJumpSound from '../assets/frog_jump_sound.mp3';

const GameBoard = ({ 
  nums, selected, target, remaining, lives, frogPos, lastAction, gameStatus, 
  handleLeafClick, handleJumpBack, handleNewGame, 
  wonButtonText = 'Next Pond →' 
}) => {
  const jumpSound = useRef(null);
  const splashSound = useRef(null);
  const failSound = useRef(null);
  const [heartAnim, setHeartAnim] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isDamageFlashing, setIsDamageFlashing] = useState(false);

  useEffect(() => {
    jumpSound.current = new Audio(frogJumpSound);
    splashSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1110/1110-preview.mp3');
    failSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/255/255-preview.mp3');
  }, []);

  useEffect(() => {
      if (lastAction?.startsWith('jump')) {
          jumpSound.current?.play().catch(() => {});
          setTimeout(() => splashSound.current?.play().catch(() => {}), 300);
          if (navigator.vibrate) navigator.vibrate(50);
      } else if (lastAction?.startsWith('penalty')) {
          failSound.current?.play().catch(() => {});
          setHeartAnim(true);
          setIsDamageFlashing(true);
          setTimeout(() => {
            setHeartAnim(false);
            setIsDamageFlashing(false);
          }, 1000);
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      } else if (lastAction?.startsWith('invalid')) {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
          if (navigator.vibrate) navigator.vibrate(200);
      }
  }, [lastAction]);

  const padPositions = [
    { top: '23%', left: '33.5%' }, { top: '42%', left: '32%' }, { top: '61%', left: '29.5%' }, { top: '80%', left: '28.5%' },
    { top: '24%', left: '50%' }, { top: '43%', left: '50%' }, { top: '62%', left: '50%' }, { top: '81%', left: '50%' },
    { top: '23%', left: '67%' }, { top: '42%', left: '68.5%' }, { top: '61%', left: '71%' }, { top: '80%', left: '73%' },
  ];

  const getPosition = (pos) => {
    if (pos === 'start') return { top: '55%', left: '16%' };
    if (pos === 'goal') return { top: '33%', left: '92%' };
    
    const col = pos % GRID_COLS;
    const row = Math.floor(pos / GRID_COLS);
    const posIndex = col * GRID_ROWS + row;
    return padPositions[posIndex];
  };

  const numsIndexToPadPos = (i) => {
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    return padPositions[col * GRID_ROWS + row];
  };

  return (
    <div style={containerStyle}>
      <div className={isShaking ? 'shake-board' : ''} style={boardStyle}>
        {/* Red Flash Overlay for Heart Deduction */}
        {isDamageFlashing && <div style={damageFlashStyle} />}

        {/* Start Label Image */}
        <div style={{ position: 'absolute', top: '35%', left: '3%', transform: 'translateY(-50%)', zIndex: 5 }}>
          <img src={START_LABEL_IMG} alt="Start" style={{ width: '130px', opacity: 0.95 }} />
        </div>

        <PathLine
          selected={selected}
          padPositions={Array.from({ length: 12 }, (_, i) => numsIndexToPadPos(i))}
          boardWidth={900}
          boardHeight={600}
          startPos={{ top: '55%', left: '16%' }}
        />

        {/* Statistics Overlays - Move up slightly based on user fix */}
        <div style={{ ...overlayValueStyle, left: '37.5%', top: '2.5%' }}>{target}</div>
        <div style={{ ...overlayValueStyle, left: '64%', top: '2.5%' }}>{remaining}</div>
        
        {/* Hearts Overlay */}
        <div style={{ ...heartContainerStyle, left: '100px', transform: heartAnim ? 'scale(1.3) rotate(5deg)' : 'scale(1)', transition: 'transform 0.2s' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} style={{ color: i < lives ? '#ff4444' : '#444', fontSize: '2.5rem', textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
              ♥
            </span>
          ))}
        </div>

        {nums.map((num, i) => {
          const pos = getPosition(i);
          return (
            <div key={i} style={{ position: 'absolute', ...pos, transform: 'translate(-50%, -50%)', zIndex: 10 }}>
              <LilyPad 
                index={i}
                value={num}
                isSelected={selected.includes(i)}
                onClick={handleLeafClick}
              />
            </div>
          );
        })}

        <Frog pos={getPosition(frogPos)} isShaking={isShaking} />

        {/* In-game Result Window */}
        {gameStatus !== 'playing' && (
           <div style={resultOverlayStyle}>
             <div style={resultBoxStyle}>
               <h2 style={{ 
                 color: gameStatus === 'won' ? '#2e7d32' : '#d32f2f', 
                 fontSize: '2.5rem', 
                 margin: '0 0 15px 0' 
               }}>
                 {gameStatus === 'won' ? '🐸 Victory!' : '🍄 Oops!'}
               </h2>
               <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '25px' }}>
                 {gameStatus === 'won' 
                   ? 'Great job! You reached the target!' 
                   : 'Try again to help the frog!'}
               </p>
               <button 
                 onClick={() => handleNewGame()}
                 style={resultButtonStyle(gameStatus === 'won' ? '#4CAF50' : '#FF9800')}
               >
                 {gameStatus === 'won' ? wonButtonText : 'Try Again ↩'}
               </button>
             </div>
           </div>
        )}
        
        <style>{`
          @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
          }
          .shake-board {
            animation: shake 0.5s;
          }
          @keyframes flash-anim {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
};

const resultOverlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(255, 255, 255, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  backdropFilter: 'blur(3px)'
};

const resultBoxStyle = {
  background: '#fff',
  padding: '40px',
  borderRadius: '30px',
  textAlign: 'center',
  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
  border: '6px solid #4CAF50',
  maxWidth: '350px',
  fontFamily: 'cursive'
};

const resultButtonStyle = (color) => ({
  background: color,
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '15px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 5px 0 rgba(0,0,0,0.2)'
});

const containerStyle = { display: 'flex', justifyContent: 'center', padding: '10px', width: '100%' };
const boardStyle = {
  position: 'relative', width: '900px', height: '600px',
  backgroundImage: `url(${BG_IMG})`, backgroundSize: '100% 100%',
  borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
  overflow: 'hidden', border: '10px solid #2e7d32'
};
const overlayValueStyle = {
  position: 'absolute', width: '100px', textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#3e2723', zIndex: 20,
  fontFamily: "'Lexend', sans-serif"
};
const heartContainerStyle = {
  position: 'absolute', top: '15px', display: 'flex', gap: '15px', zIndex: 30
};

const damageFlashStyle = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(255, 0, 0, 0.4)',
  zIndex: 10,
  pointerEvents: 'none',
  animation: 'flash-anim 1s ease-out forwards'
};

export default GameBoard;
