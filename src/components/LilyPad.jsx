import React from 'react';

const LilyPad = ({ value, isSelected, onClick, index }) => {
  // We use absolute positioning from GameBoard, 
  // so this just needs to be the interactive element.
  return (
    <div 
      onClick={() => onClick(index)}
      style={{
        width: '80px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'transform 0.2s',
        filter: isSelected ? 'brightness(1.5) drop-shadow(0 0 10px #fff)' : 'none',
        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      <div style={{
        background: 'rgba(0, 80, 0, 0.7)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '1.4rem',
        fontWeight: 'bold',
        border: '2px solid #fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
      }}>
        {value}
      </div>
    </div>
  );
};

export default LilyPad;
