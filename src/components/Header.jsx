import React from 'react';

const Header = ({ target, score, mode }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h1 style={{ color: '#fff', fontSize: '2.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        Frog Jump Math
      </h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '10px' }}>
        <div style={statBoxStyle}>
          <span style={labelStyle}>Target</span>
          <span style={valueStyle}>{target}</span>
        </div>
        <div style={statBoxStyle}>
          <span style={labelStyle}>Score</span>
          <span style={valueStyle}>{score}</span>
        </div>
        <div style={statBoxStyle}>
          <span style={labelStyle}>Mode</span>
          <span style={valueStyle}>{mode.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

const statBoxStyle = {
  background: 'rgba(255, 255, 255, 0.2)',
  padding: '10px 20px',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  minWidth: '100px',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255,255,255,0.3)'
};

const labelStyle = {
  color: '#c0ffc0',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  textTransform: 'uppercase'
};

const valueStyle = {
  color: '#fff',
  fontSize: '1.8rem',
  fontWeight: 'bold'
};

export default Header;
