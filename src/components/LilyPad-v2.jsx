import React from 'react';
import { LILYPAD_IMG } from '../constants/images';

const LilyPadV2 = ({ value, isSelected, isSunk, onClick, index }) => {
  return (
    <div 
      onClick={() => onClick(index)}
      style={{
        width: '180px',
        height: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'transform 0.5s ease-in-out, opacity 0.5s, filter 0.3s',
        // Sinking effect: move down, scale slightly, and fade
        transform: isSunk 
          ? 'translateY(15px) scale(0.85)' 
          : (isSelected ? 'scale(1.1)' : 'scale(1)'),
        opacity: isSunk ? 0.6 : 1,
        filter: isSelected ? 'drop-shadow(0 0 15px rgba(255,255,255,0.8)) brightness(1.2)' : 'none',
        pointerEvents: isSunk ? 'none' : 'auto'
      }}
    >
      {/* Lilypad Image */}
      <img 
        src={LILYPAD_IMG} 
        alt="lilypad" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          position: 'absolute',
          bottom: isSunk ? '-10%' : '0'
        }} 
      />

      {/* Numerical Value */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        color: '#fff',
        fontSize: '2.2rem',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        fontFamily: "'Lexend', sans-serif",
        marginBottom: '10px',
        transform: isSunk ? 'translateY(5px)' : 'none'
      }}>
        {value}
      </div>
    </div>
  );
};

export default LilyPadV2;
