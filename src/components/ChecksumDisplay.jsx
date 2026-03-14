import React from 'react';

const ChecksumDisplay = ({ remaining, mode }) => {
  const isPositive = remaining > 0;
  
  return (
    <div style={containerStyle}>
      <span style={labelStyle}>Needed to reach target:</span>
      <span style={{ 
        ...valueStyle, 
        color: isPositive ? '#ffff00' : '#ff4444' 
      }}>
        {remaining}
      </span>
    </div>
  );
};

const containerStyle = {
  background: 'rgba(0, 0, 0, 0.4)',
  padding: '12px 24px',
  borderRadius: '30px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  margin: '15px 0',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.1)'
};

const labelStyle = {
  color: '#aaa',
  fontSize: '1rem'
};

const valueStyle = {
  fontSize: '1.4rem',
  fontWeight: 'bold'
};

export default ChecksumDisplay;
