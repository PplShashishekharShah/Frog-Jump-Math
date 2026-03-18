import React from 'react';

const Controls = ({ mode, toggleMode, handleJumpBack, canUndo }) => {
  return (
    <div style={controlsContainerStyle}>
      <button 
        disabled={true}
        onClick={toggleMode} 
        style={blueButtonStyle}
      >
        Mode: {mode === 'addition' ? '➕ Add' : '✖ Mult'}
      </button>
      
      <button 
        onClick={handleJumpBack} 
        disabled={!canUndo}
        style={canUndo ? goldButtonStyle : { ...goldButtonStyle, opacity: 0.5, cursor: 'not-allowed' }}
      >
        ↩ Jump Back
      </button>
    </div>
  );
};

const controlsContainerStyle = {
  display: 'flex',
  gap: '15px', // Smaller gap
  marginTop: '20px', // Smaller margin
  justifyContent: 'center'
};

const baseButtonStyle = {
  padding: '10px 35px', // Smaller padding
  borderRadius: '15px',
  border: 'none',
  color: 'white',
  fontSize: '1.2rem', // Smaller text
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'transform 0.1s, box-shadow 0.1s',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: "'Lexend', sans-serif",
  boxShadow: '0 6px 0 rgba(0,0,0,0.2)'
};

const blueButtonStyle = {
  ...baseButtonStyle,
  background: '#2196F3',
  borderBottom: '6px solid #1565C0',
  cursor: 'not-allowed',
  opacity: 0.7
};

const goldButtonStyle = {
  ...baseButtonStyle,
  background: '#c09a06',
  borderBottom: '6px solid #8b6e00',
};

export default Controls;
