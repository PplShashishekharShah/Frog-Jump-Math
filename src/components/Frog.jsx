import React, { useEffect, useState } from 'react';
import { FROG_IMG } from '../constants/images';

const Frog = ({ pos, isShaking }) => {
  const [isJumping, setIsJumping] = useState(false);
  const [prevPos, setPrevPos] = useState(pos);
  const [showDust, setShowDust] = useState(false);

  useEffect(() => {
    if (pos !== prevPos) {
      setIsJumping(true);
      setShowDust(false);
      const timer = setTimeout(() => {
        setIsJumping(false);
        setPrevPos(pos);
        setShowDust(true);
        setTimeout(() => setShowDust(false), 600);
      }, 400); 
      return () => clearTimeout(timer);
    }
  }, [pos, prevPos]);

  // Determine scale/rotation based on jump state
  const jumpScale = isJumping ? 1.3 : 1;
  const stretch = isJumping ? 'scale(1.1, 0.9)' : 'scale(1)';
  const shakeClass = isShaking ? 'shake-frog' : '';

  return (
    <div 
      className={shakeClass}
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        transform: `translate(-50%, -85%) ${stretch}`,
        width: '130px',
        height: '110px',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        zIndex: 10,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.4))'
      }}
    >
      <img 
        src={FROG_IMG} 
        alt="frog" 
        style={{ 
          width: '100%', 
          height: '100%',
          transform: `scale(${jumpScale})`,
          transition: 'transform 0.2s ease-out'
        }} 
      />
      {isJumping && <SplashEffect />}
      {showDust && <DustEffect />}
      <style>{`
        @keyframes shake-frog {
          0%, 100% { transform: translate(-50%, -85%) rotate(0deg); }
          25% { transform: translate(-55%, -85%) rotate(-5deg); }
          75% { transform: translate(-45%, -85%) rotate(5deg); }
        }
        .shake-frog {
          animation: shake-frog 0.1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const DustEffect = () => (
    <div style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '120px',
        height: '40px',
        zIndex: -1
    }}>
        <div style={dustParticleStyle(10)} />
        <div style={dustParticleStyle(-20)} />
        <div style={dustParticleStyle(30)} />
        <style>{`
            @keyframes dust-cloud {
                0% { transform: translateY(0) scale(0.5); opacity: 0.8; }
                100% { transform: translateY(-20px) scale(1.5); opacity: 0; }
            }
        `}</style>
    </div>
);

const dustParticleStyle = (offset) => ({
    position: 'absolute',
    left: `calc(50% + ${offset}px)`,
    bottom: '0',
    width: '30px',
    height: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: '50%',
    animation: 'dust-cloud 0.6s ease-out forwards'
});

const SplashEffect = () => {
    return (
        <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '40px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '50%',
            animation: 'splash 0.4s ease-out forwards'
        }}>
            <style>{`
                @keyframes splash {
                    0% { transform: translateX(-50%) scale(0.2); opacity: 1; }
                    100% { transform: translateX(-50%) scale(1.5); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Frog;
