import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameBoard from './GameBoard';

/**
 * Path: Index 0 (Val 5) -> Index 10 (Val 2) -> Index 8 (Val 3) = 10
 */
const TUTORIAL_NUMS = [
    5, 4, 6,  // row 0
    1, 2, 8,  // row 1
    9, 3, 3,  // row 2
    4, 2, 2   // row 3 (Index 11 is 2)
];

const TUTORIAL_STEPS = [
    { target: 10, selected: [], frogPos: 'start', action: null, message: "Welcome! Help the frog reach exactly 10.", handTo: null },
    { target: 10, selected: [0], frogPos: 0, action: 'jump-1', message: "First, click on 5 to help the frog jump!", handTo: 0 },
    { target: 10, selected: [0], frogPos: 0, action: 'invalid-2', message: "Oops! You can't jump to a pad in the same column!", handTo: 3 },
    { target: 10, selected: [0, 4], frogPos: 4, action: 'jump-3', message: "Great! 5 + 2 = 7. Let's keep going!", handTo: 4 },
    { target: 10, selected: [0, 4, 11], frogPos: 11, action: 'jump-4', message: "Wait! 5 + 2 + 2 = 9. That's not 10!", handTo: 11 },
    { target: 10, selected: [0, 4], frogPos: 4, action: 'penalty-5', message: "We can't reach the goal! Let's go back. (Heart lost ❤️)", handTo: 4 }, 
    { target: 10, selected: [0, 4, 8], frogPos: 8, action: 'jump-6', message: "Try this 3! 7 + 3 = 10! You did it!", handTo: 8 },
    { target: 10, selected: [0, 4, 8], frogPos: 'goal', action: 'jump-7', message: "Amazing! The frog reached the goal land!", handTo: 'goal' },
];

const TutorialMode = ({ onSkip, onFinish }) => {
    const [step, setStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [lives, setLives] = useState(3);
    const [isMuted, setIsMuted] = useState(false);
    const [handPos, setHandPos] = useState({ top: '50%', left: '50%', opacity: 0 });
    const timerRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    const currentData = TUTORIAL_STEPS[step];

    const speakMessage = useCallback((text) => {
        if (isMuted) return;
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.2;
        utterance.pitch = 1.1;
        synthRef.current.speak(utterance);
    }, [isMuted]);

    const getHandCoords = (pos) => {
        if (pos === null) return { top: '50%', left: '50%', opacity: 0 };
        if (pos === 'start') return { top: '80%', left: '10%', opacity: 1 };
        if (pos === 'goal') return { top: '35%', left: '90%', opacity: 1 };
        
        const padPositions = [
            { top: '23%', left: '33.5%' }, { top: '42%', left: '32%' }, { top: '61%', left: '29.5%' }, { top: '80%', left: '28.5%' },
            { top: '24%', left: '50%' }, { top: '43%', left: '50%' }, { top: '62%', left: '50%' }, { top: '81%', left: '50%' },
            { top: '23%', left: '67%' }, { top: '42%', left: '68.5%' }, { top: '61%', left: '71%' }, { top: '80%', left: '73%' },
        ];

        const col = pos % 3;
        const row = Math.floor(pos / 3);
        const posIndex = col * 4 + row;
        const rawPos = padPositions[posIndex];
        return { top: `calc(${rawPos.top} + 20px)`, left: `calc(${rawPos.left} - 25px)`, opacity: 1 };
    };

    const advanceStep = useCallback(() => {
        if (step < TUTORIAL_STEPS.length - 1) {
            const nextStep = step + 1;
            if (TUTORIAL_STEPS[nextStep].action?.startsWith('penalty')) {
                setLives(l => Math.max(1, l - 1));
            }
            setStep(nextStep);
        } else {
            setIsFinished(true);
        }
    }, [step]);

    useEffect(() => {
        speakMessage(currentData.message);
        const nextStepData = TUTORIAL_STEPS[step + 1];
        if (nextStepData && nextStepData.handTo !== undefined) {
            setHandPos(getHandCoords(nextStepData.handTo));
        }

        if (!isFinished) {
            timerRef.current = setTimeout(advanceStep, 4500); 
        }
        return () => {
            clearTimeout(timerRef.current);
            synthRef.current.cancel();
        };
    }, [step, isFinished, advanceStep, speakMessage, currentData.message]);

    const handleNext = () => {
        clearTimeout(timerRef.current);
        advanceStep();
    };

    const handleReplay = () => {
        setStep(0);
        setIsFinished(false);
        setLives(3);
    };

    const remaining = currentData.target - currentData.selected.reduce((acc, i) => acc + TUTORIAL_NUMS[i], 0);
    // Trigger "won" status on the last step to show the victory overlay
    const gameStatus = (isFinished && step === TUTORIAL_STEPS.length - 1) ? 'won' : 'playing';

    return (
        <div style={containerStyle}>
             <div style={headerStyle}>
                <h2 style={titleStyle}>Game Tutorial</h2>
                <div style={rightControlsStyle}>
                    <button onClick={() => setIsMuted(!isMuted)} style={muteButtonStyle}>
                        {isMuted ? '🔇' : '🔊'}
                    </button>
                    <div style={stepIndicatorStyle}>Step {step + 1} / {TUTORIAL_STEPS.length}</div>
                </div>
            </div>

            <div style={messageBoxStyle}>
                {currentData.message}
            </div>

            <div style={boardWrapperStyle}>
                <GameBoard 
                    nums={TUTORIAL_NUMS}
                    selected={currentData.selected}
                    target={currentData.target}
                    remaining={remaining}
                    lives={lives}
                    frogPos={currentData.frogPos}
                    lastAction={currentData.action}
                    gameStatus={gameStatus} 
                    handleLeafClick={() => {}} 
                    handleJumpBack={() => {}}
                    handleNewGame={onSkip} 
                    wonButtonText="Start Game →"
                />
                
                {/* Tilted Hand Cursor */}
                {!isFinished && (
                    <div style={{
                        ...handCursorStyle,
                        ...handPos,
                        transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        pointerEvents: 'none',
                        transform: 'translate(-50%, -50%) rotate(45deg)', 
                    }}>
                        👆
                    </div>
                )}
            </div>

            <div style={footerStyle}>
                {!isFinished ? (
                    <>
                        <button onClick={handleNext} style={nextButtonStyle}>Next Move (Fast) ➔</button>
                        <button onClick={onSkip} style={skipButtonStyle}>Skip Tutorial</button>
                    </>
                ) : (
                    <>
                        <button onClick={handleReplay} style={nextButtonStyle}>Replay Tutorial 🔄</button>
                        <button onClick={onSkip} style={skipButtonStyle}>Start Game 🐸</button>
                    </>
                )}
            </div>

            <style>{`
                @keyframes click-tilt {
                    0% { transform: translate(-50%, -50%) rotate(45deg) scale(1); }
                    50% { transform: translate(-50%, -50%) rotate(45deg) scale(0.85); }
                    100% { transform: translate(-50%, -50%) rotate(45deg) scale(1); }
                }
            `}</style>
        </div>
    );
};

const containerStyle = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 10px', minHeight: 'auto', background: '#1b5e20',
};

const headerStyle = {
    display: 'flex', justifyContent: 'space-between', width: '850px', alignItems: 'center', marginBottom: '2px'
};

const rightControlsStyle = { display: 'flex', alignItems: 'center', gap: '20px' };

const muteButtonStyle = {
    background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '45px', height: '45px', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const boardWrapperStyle = {
    position: 'relative',
    width: 'auto',
    height: 'auto',
    transform: 'scale(0.95)',
    marginTop: '0px',
    marginBottom: '0px'
};

const handCursorStyle = {
    position: 'absolute', fontSize: '3rem', zIndex: 200, animation: 'click-tilt 1s infinite'
};

const titleStyle = { color: 'white', fontFamily: "'Lexend', sans-serif", margin: 0, fontSize: '1.5rem' };
const stepIndicatorStyle = { color: '#c0ffc0', fontFamily: "'Lexend', sans-serif", fontSize: '0.85rem' };

const messageBoxStyle = {
    background: 'white', padding: '6px 15px', borderRadius: '20px', marginBottom: '2px', boxShadow: '0 6px 12px rgba(0,0,0,0.25)', fontSize: '1.2rem', fontFamily: "'Lexend', sans-serif", color: '#2e7d32', border: '3px solid #4CAF50', minWidth: '450px', textAlign: 'center', zIndex: 10
};

const footerStyle = { display: 'flex', gap: '15px', marginTop: '0' };

const baseButtonStyle = {
    padding: '10px 30px', borderRadius: '18px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: "'Lexend', sans-serif", boxShadow: '0 5px 0 rgba(0,0,0,0.2)'
};

const nextButtonStyle = { ...baseButtonStyle, background: '#c09a06', color: 'white', borderBottom: '6px solid #8b6e00' };

const skipButtonStyle = { ...baseButtonStyle, background: '#4CAF50', color: 'white', borderBottom: '6px solid #2e7d32' };

export default TutorialMode;
