import { useState, useCallback } from 'react';
import { MODES, GRID_ROWS, GRID_COLS } from '../constants/gameConstants';

/**
 * Generates a random integer between min (inclusive) and max (inclusive)
 */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate 12 leaf numbers (4 rows x 3 columns) and a target
 */
function generatePuzzle(mode) {
  const totalPads = GRID_ROWS * GRID_COLS;
  const nums = Array.from({ length: totalPads }, () => randInt(1, 9));

  const col0Idx = [0, 3, 6, 9][randInt(0, 3)];
  const col1Idx = [1, 4, 7, 10][randInt(0, 3)];
  const col2Idx = [2, 5, 8, 11][randInt(0, 3)];

  const path = [nums[col0Idx], nums[col1Idx], nums[col2Idx]];
  
  let target;
  if (mode === MODES.ADDITION) {
    target = path.reduce((a, b) => a + b, 0);
  } else {
    target = path[0] * path[1] * path[2];
  }

  return { nums, target };
}

/**
 * Core game state hook
 */
export function useGameState() {
  const [mode, setMode] = useState(MODES.ADDITION);
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(MODES.ADDITION));
  const [selected, setSelected] = useState([]); 
  const [history, setHistory] = useState([]);   
  const [gameStatus, setGameStatus] = useState('playing'); 
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [frogPos, setFrogPos] = useState('start'); 
  const [lastAction, setLastAction] = useState(null); // 'jump', 'penalty', 'invalid'

  const { nums, target } = puzzle;

  const currentValue = selected.reduce((acc, idx) => {
    if (mode === MODES.ADDITION) return acc + nums[idx];
    return acc === 0 ? nums[idx] : acc * nums[idx];
  }, 0);

  const remaining = target - currentValue;

  const handleLeafClick = useCallback(
    (index) => {
      if (gameStatus !== 'playing') return;
      
      const currentSteps = selected.length;
      const clickedCol = index % GRID_COLS;
      
      // Case: Forward Move
      if (clickedCol === currentSteps) {
        if (selected.includes(index)) {
            setLastAction('invalid-' + Date.now());
            return;
        }
        
        const newSelected = [...selected, index];
        const newValue = newSelected.reduce((acc, idx) => {
           if (mode === MODES.ADDITION) return acc + nums[idx];
           return acc === 0 ? nums[idx] : acc * nums[idx];
        }, 0);

        // Check if this move exceeds the target
        if (newValue > target) {
            setLives(l => {
                const nl = l - 1;
                if (nl <= 0) setGameStatus('lost');
                return Math.max(0, nl);
            });
            setLastAction('penalty-' + Date.now());
            // Optionally: Auto jump back? Let's just stay but mark as penalty
            return; 
        }

        setHistory([...history, frogPos]);
        setSelected(newSelected);
        setFrogPos(index);
        setLastAction('jump-' + Date.now());

        if (newSelected.length === 3) {
            if (newValue === target) {
                setTimeout(() => {
                    setFrogPos('goal');
                    setTimeout(() => {
                        setGameStatus('won');
                        setScore(s => s + 1);
                    }, 1200); 
                }, 400); 
            } else {
                // Reach the end but wrong sum
                setTimeout(() => {
                    setLives(l => {
                        const nl = l - 1;
                        if (nl <= 0) setGameStatus('lost');
                        return Math.max(0, nl);
                    });
                    setLastAction('penalty-' + Date.now());
                    // Force jump back so they can try again
                    handleJumpBack();
                }, 600);
            }
        }
      } 
      // Case: Backward Move to previous pad
      else if (currentSteps > 0 && clickedCol === currentSteps - 2) {
          const previousPad = selected[selected.length - 2] ?? 'start';
          if (index === (previousPad === 'start' ? -1 : previousPad)) {
              setLives(l => {
                  const nl = l - 1;
                  if (nl <= 0) setGameStatus('lost');
                  return Math.max(0, nl);
              });
              setLastAction('penalty-' + Date.now());
              setFrogPos(previousPad);
              setSelected(s => s.slice(0, -1));
              setHistory(h => h.slice(0, -1));
          } else {
              setLastAction('invalid-' + Date.now());
          }
      }
      else {
          // Any other invalid move (same column, skip column)
          setLastAction('invalid-' + Date.now());
      }
    },
    [selected, history, gameStatus, mode, nums, target, frogPos, lives]
  );

  const handleJumpBack = useCallback(() => {
    if (selected.length === 0) return;
    
    setLives(l => {
        const nl = l - 1;
        if (nl <= 0) setGameStatus('lost');
        return Math.max(0, nl);
    });
    setLastAction('penalty-' + Date.now());

    const prev = history[history.length - 1];
    setFrogPos(prev);
    setSelected(s => s.slice(0, -1));
    setHistory(h => h.slice(0, -1));
    setGameStatus('playing');
  }, [selected, history]);

  const handleNewGame = useCallback(
    (newMode) => {
      const m = newMode ?? mode;
      setMode(m);
      setPuzzle(generatePuzzle(m));
      setSelected([]);
      setHistory([]);
      setGameStatus('playing');
      setLives(3);
      setFrogPos('start');
      setLastAction(null);
    },
    [mode]
  );

  const toggleMode = useCallback(() => {
    const newMode = mode === MODES.ADDITION ? MODES.MULTIPLICATION : MODES.ADDITION;
    handleNewGame(newMode);
  }, [mode, handleNewGame]);

  return {
    mode,
    nums,
    target,
    selected,
    currentValue,
    remaining,
    gameStatus,
    score,
    lives,
    frogPos,
    lastAction,
    handleLeafClick,
    handleJumpBack,
    handleNewGame,
    toggleMode,
  };
}
