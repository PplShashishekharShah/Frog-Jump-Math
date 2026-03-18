import React, { useEffect, useRef, useState } from 'react';
import LilyPadV2 from './LilyPad-v2';
import Frog from './Frog';
import PathLine from './PathLine';
import { BG_V2_IMG, START_LABEL_IMG } from '../constants/images';
import { GRID_ROWS, GRID_COLS, MODES } from '../constants/gameConstants';
import frogJumpSound from '../assets/frog_jump_sound.mp3';

const BOARD_WIDTH = 900;
const BOARD_HEIGHT = 600;

const padPositions = [
  { top: '30%', left: '35%' }, { top: '45%', left: '34.5%' }, { top: '62%', left: '34%' }, { top: '79%', left: '33%' },
  { top: '30%', left: '50%' }, { top: '45%', left: '50%' }, { top: '62%', left: '50%' }, { top: '79%', left: '50%' },
  { top: '30%', left: '65%' }, { top: '45%', left: '65.5%' }, { top: '62%', left: '66%' }, { top: '79%', left: '67%' },
];

const startPos = { top: '55%', left: '20%' };
const goalPos = { top: '33%', left: '92%' };

const GameBoardV2 = ({
  mode, nums, selected, target, remaining, lives, frogPos, lastAction, gameStatus,
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

  const getPosition = (pos) => {
    if (pos === 'start') return startPos;
    if (pos === 'goal') return goalPos;
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

  const [windowSize, setWindowSize] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderEquation = () => {
    const op = mode === MODES.ADDITION ? '+' : '×';
    const parts = [0, 1, 2].map(i => {
      if (selected[i] !== undefined) return nums[selected[i]];
      return '_';
    });
    const currSum = selected.reduce((acc, i) => acc + nums[i], 0);
    return `${parts[0]} ${op} ${parts[1]} ${op} ${parts[2]} = ${currSum}`;
  };

  const canUndo = selected.length > 0;

  return (
    <div style={containerStyle}>
      <div className={isShaking ? 'shake-board' : ''} style={boardStyle}>
        {isDamageFlashing && <div style={damageFlashStyle} />}

        {/* Embedded Title UI */}
        {/* <div style={embeddedHeaderStyle}>
          <div style={embeddedModeBadgeStyle}>
            {mode === MODES.ADDITION ? '✨ ADDITION POND' : '🌀 MULTIPLICATION POND'}
          </div>
          <h1 style={embeddedTitleStyle}>Frog Jump Math <span style={v2BadgeStyle}>V2</span></h1>
        </div> */}

        {/* Start Label Image */}
        <div style={{ position: 'absolute', top: '40%', left: '0.5%', transform: 'translateY(-50%)', zIndex: 5 }}>
          <img src={START_LABEL_IMG} alt="Start" style={{ width: '170px', opacity: 0.99 }} />
        </div>

        {/* Vertical Separator Lines */}
        <div style={{ ...vLineStyle, left: '42%' }} />
        <div style={{ ...vLineStyle, left: '58%' }} />

        <PathLine
          selected={selected}
          padPositions={Array.from({ length: 12 }, (_, i) => numsIndexToPadPos(i))}
          boardWidth={windowSize.width}
          boardHeight={windowSize.height}
          startPos={startPos}
        />

        {/* Statistics Overlays */}
        <div style={{ ...overlayValueStyle, left: '40%', top: '4%' }}>{target}</div>
        
        {/* Overwrite 'Remaining' with 'More no.s' */}
        {/* <div style={overwriteLabelStyle}>
          {mode === MODES.ADDITION ? 'More to Add' : 'More no.s to Mult'}
        </div> */}
        <div style={{ ...overlayValueStyle, left: '72%', top: '4%' }}>{remaining}</div>

        <div style={{ ...heartContainerStyle, left: '100px', transform: heartAnim ? 'scale(1.3) rotate(5deg)' : 'scale(1)', transition: 'transform 0.2s' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} style={{ color: i < lives ? '#ff4444' : '#444', fontSize: '2.5rem', textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
              ♥
            </span>
          ))}
        </div>

        {nums.map((num, i) => {
          const pos = getPosition(i);
          const col = i % GRID_COLS;
          const isSunk = (gameStatus === 'won') ? true : 
                         (col > selected.length || (col < selected.length && !selected.includes(i)));
          
          return (
            <div key={i} style={{ position: 'absolute', ...pos, transform: 'translate(-50%, -50%)', zIndex: 10 }}>
              <LilyPadV2
                index={i}
                value={num}
                isSelected={selected.includes(i)}
                isSunk={isSunk}
                onClick={handleLeafClick}
              />
            </div>
          );
        })}

        <Frog pos={getPosition(frogPos)} isShaking={isShaking} />

        {/* Live Equation Box at Bottom Left-ish */}
        <div style={equationBoxStyle}>
          <div style={equationContentStyle}>
            {renderEquation()}
          </div>
        </div>

        {/* Embedded Jump Back Button at Bottom Right-ish */}
        <div style={jumpBackContainerStyle}>
          <button 
            onClick={handleJumpBack} 
            disabled={!canUndo}
            style={canUndo ? goldButtonStyle : { ...goldButtonStyle, opacity: 0.5, cursor: 'not-allowed' }}
          >
            ↩ Jump Back
          </button>
        </div>

        {gameStatus !== 'playing' && (
          <div style={resultOverlayStyle}>
            <div style={resultBoxStyle}>
              <h2 style={{ color: gameStatus === 'won' ? '#2e7d32' : '#d32f2f', fontSize: '2.5rem', margin: '0 0 15px 0' }}>
                {gameStatus === 'won' ? '🐸 Victory!' : '🍄 Oops!'}
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '25px' }}>
                {gameStatus === 'won' ? 'Great job! You reached the target!' : 'Try again to help the frog!'}
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
          .shake-board { animation: shake 0.5s; }
          @keyframes flash-anim {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes popIn {
            from { transform: scale(0.8) translateY(20px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

// Full Screen Layout Styles
const containerStyle = { width: '100vw', height: '100vh', overflow: 'hidden' };
const boardStyle = {
  position: 'relative', width: '100%', height: '100%',
  backgroundImage: `url(${BG_V2_IMG})`, backgroundSize: '100% 100%',
  backgroundPosition: 'center', overflow: 'hidden'
};

const embeddedHeaderStyle = {
  position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
  display: 'flex', alignItems: 'center', gap: '20px', zIndex: 30, textAlign: 'center'
};
const embeddedTitleStyle = {
  color: '#fff', fontSize: '2rem', margin: '0', textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  fontFamily: 'cursive', display: 'flex', alignItems: 'center', gap: '10px'
};
const embeddedModeBadgeStyle = {
  background: 'rgba(255, 255, 255, 0.4)', color: '#fff', padding: '3px 12px',
  borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', fontFamily: 'cursive',
  border: '2px solid rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(4px)'
};
const v2BadgeStyle = {
  background: '#FF9800', color: '#fff', borderRadius: '8px', padding: '2px 8px',
  fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px', boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
};

const vLineStyle = {
  position: 'absolute', top: '20%', bottom: '15%', width: '3px',
  borderLeft: '3px dashed rgba(255, 255, 255, 0.4)', zIndex: 1
};

const overwriteLabelStyle = {
  position: 'absolute', top: '22px', left: '52.5%', background: '#f7ecdaff',
  padding: '2px 12px', fontSize: '0.9rem', fontWeight: 'bold', color: '#3e2723',
  zIndex: 19, fontFamily: "'Lexend', sans-serif"
};

const equationBoxStyle = {
  position: 'absolute', bottom: '20px', left: '41%',
  background: 'rgba(255, 255, 255, 0.9)', padding: '10px 25px', borderRadius: '20px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)', border: '4px solid #4CAF50',
  animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', zIndex: 30
};
const equationContentStyle = {
  fontSize: '2rem', color: '#1b5e20', fontWeight: 'bold', fontFamily: "'Lexend', sans-serif"
};

const jumpBackContainerStyle = {
  position: 'absolute', bottom: '25px', right: '12%', zIndex: 30
};
const goldButtonStyle = {
  padding: '12px 30px', borderRadius: '15px', border: 'none', color: 'white',
  background: '#c09a06', borderBottom: '6px solid #8b6e00', fontSize: '1.2rem',
  fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center',
  gap: '8px', fontFamily: 'cursive', boxShadow: '0 6px 0 rgba(0,0,0,0.2)'
};

const overlayValueStyle = {
  position: 'absolute', width: '100px', textAlign: 'center',
  fontSize: '2.5rem', fontWeight: 'bold', color: '#1B5E20', zIndex: 20,
  fontFamily: "'Lexend', sans-serif"
};
const heartContainerStyle = {
  position: 'absolute', top: '15px', display: 'flex', gap: '15px', zIndex: 30
};
const resultOverlayStyle = {
  position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(3px)'
};
const resultBoxStyle = {
  background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center',
  boxShadow: '0 15px 40px rgba(0,0,0,0.3)', border: '6px solid #4CAF50', maxWidth: '350px', fontFamily: 'cursive'
};
const resultButtonStyle = (color) => ({
  background: color, color: 'white', border: 'none', padding: '12px 30px', borderRadius: '15px',
  fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 0 rgba(0,0,0,0.2)'
});
const damageFlashStyle = {
  position: 'absolute', inset: 0, backgroundColor: 'rgba(255,0,0,0.4)', zIndex: 10,
  pointerEvents: 'none', animation: 'flash-anim 1s ease-out forwards'
};

export default GameBoardV2;
