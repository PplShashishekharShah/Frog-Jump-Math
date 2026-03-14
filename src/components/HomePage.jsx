import React from 'react';
import { FROG_IMG } from '../constants/images';

const HomePage = ({ onStart, onTutorial }) => {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={heroAreaStyle}>
            <img src={FROG_IMG} alt="frog" style={frogStyle} />
            <h1 style={titleStyle}>Frog Jump Math</h1>
            <p style={subtitleStyle}>A Fun Pond Adventure for Grade 2-3!</p>
        </div>

        <div style={buttonContainerStyle}>
            <button onClick={onStart} style={primaryButtonStyle}>
            Start Game 🐸
            </button>
            <button onClick={onTutorial} style={secondaryButtonStyle}>
            How to Play 🎯
            </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: #4CAF50; }
          50% { border-color: #81C784; }
        }
      `}</style>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100%',
  backgroundColor: '#1b5e20',
  padding: '20px',
  textAlign: 'center'
};

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  padding: '50px 70px',
  borderRadius: '35px',
  boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
  border: '12px solid #4CAF50',
  animation: 'pulse-border 3s infinite ease-in-out',
  maxWidth: '650px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '35px',
  position: 'relative'
};

const heroAreaStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
};

const frogStyle = {
  width: '160px',
  height: 'auto',
  animation: 'float 4s infinite ease-in-out'
};

const titleStyle = {
  fontSize: '3.5rem',
  color: '#2e7d32',
  margin: '0',
  fontFamily: 'cursive',
  textShadow: '2px 2px 0 #fff'
};

const subtitleStyle = {
  fontSize: '1.3rem',
  color: '#555',
  margin: '0',
  fontFamily: 'cursive'
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '15px',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '280px'
};

const buttonBaseStyle = {
  padding: '18px',
  borderRadius: '20px',
  border: 'none',
  fontSize: '1.6rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontFamily: 'cursive',
  transition: 'transform 0.1s, filter 0.2s',
  boxShadow: '0 8px 0 rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px'
};

const primaryButtonStyle = {
  ...buttonBaseStyle,
  background: '#4CAF50',
  color: 'white',
  borderBottom: '8px solid #2e7d32'
};

const secondaryButtonStyle = {
  ...buttonBaseStyle,
  background: '#2196F3',
  color: 'white',
  borderBottom: '8px solid #1565C0'
};

export default HomePage;
