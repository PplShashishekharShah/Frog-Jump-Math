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
  gap: '20px',
  marginTop: '20px',
  justifyContent: 'center'
};

const baseButtonStyle = {
  padding: '15px 35px',
  borderRadius: '20px',
  border: 'none',
  color: 'white',
  fontSize: '1.4rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'transform 0.1s, box-shadow 0.1s',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontFamily: 'cursive',
  boxShadow: '0 8px 0 rgba(0,0,0,0.2)'
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
