import { useState, useCallback } from 'react';
import { MODES, GRID_ROWS, GRID_COLS } from '../constants/gameConstants';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Compute the result of combining two numbers with the given mode.
 */
function combine(a, b, mode) {
  return mode === MODES.ADDITION ? a + b : a * b;
}

/**
 * Generate 12 numbers (4 rows × 3 cols) and a target such that:
 *  - ALL 4 col-0 pads have ≥1 valid col-1 pad
 *  - Every reachable col-1 pad has ≥1 col-2 pad completing the path
 *
 * Strategy:
 *  1. Fill 12 cells with random numbers.
 *  2. Enumerate all 64 possible paths (4 × 4 × 4).
 *  3. Count how many DISTINCT col-0 pads contribute to each candidate target.
 *  4. Pick a target that is reachable from ALL 4 col-0 pads.
 *  5. Retry if none found (converges in a few iterations on average).
 */
function generatePuzzle(mode) {
  const MAX_TRIES = 500;
  let bestPuzzle = null;
  let bestScore = -1;

  for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
    const nums = Array.from({ length: GRID_ROWS * GRID_COLS }, () =>
      randInt(1, 9)
    );

    const col0 = [0, 3, 6, 9];
    const col1 = [1, 4, 7, 10];
    const col2 = [2, 5, 8, 11];

    const targetStats = new Map(); // target -> { col0Set, col1Set, pathCount }

    for (const i0 of col0) {
      for (const i1 of col1) {
        for (const i2 of col2) {
          const partial = combine(nums[i0], nums[i1], mode);
          const total = combine(partial, nums[i2], mode);
          
          if (!targetStats.has(total)) {
            targetStats.set(total, { col0Set: new Set(), col1Set: new Set(), pathCount: 0 });
          }
          const stats = targetStats.get(total);
          stats.col0Set.add(i0);
          stats.col1Set.add(i1);
          stats.pathCount++;
        }
      }
    }

    for (const [t, stats] of targetStats.entries()) {
      // Must be reachable from ALL 4 col-0 pads
      if (stats.col0Set.size < 4) continue;
      
      // Score based on how many col-1 pads are "active" and total density
      // stats.col1Set.size ranges from 1 to 4. 
      // We strongly prefer cases where all 4 col-1 pads are parts of paths.
      const score = (stats.col1Set.size * 1000) + stats.pathCount;

      if (score > bestScore) {
        bestScore = score;
        bestPuzzle = { nums, target: t, col1Count: stats.col1Set.size };
      }
    }
    
    // If we found a "perfect" density (all 4 col-0, all 4 col-1), we can stop early
    if (bestPuzzle && bestPuzzle.col1Count === 4 && bestScore > 4010) {
        // 4010 means 4 col-1 pads and at least 10 total paths
        break;
    }
  }

  if (bestPuzzle) {
    return { nums: bestPuzzle.nums, target: bestPuzzle.target };
  }

  // Fallback
  const nums = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4];
  return { nums, target: mode === MODES.ADDITION ? 6 : 24 };
}

/**
 * Core V2 game state hook — same API as useGameState, different puzzle generator.
 */
export function useGameStateV2() {
  const [mode, setMode] = useState(MODES.ADDITION);
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(MODES.ADDITION));
  const [selected, setSelected] = useState([]);
  const [history, setHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [frogPos, setFrogPos] = useState('start');
  const [lastAction, setLastAction] = useState(null);

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

      // Forward Move
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

        if (newValue > target) {
          setLastAction('invalid-' + Date.now());
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
                setScore((s) => s + 1);
              }, 1200);
            }, 400);
          } else {
            setTimeout(() => {
              setLives((l) => {
                const nl = l - 1;
                if (nl <= 0) setGameStatus('lost');
                return Math.max(0, nl);
              });
              setLastAction('penalty-' + Date.now());
              // Reset selection so they can retry
              setSelected([]);
              setHistory([]);
              setFrogPos('start');
            }, 600);
          }
        }
      }
      // Backward click (undo last step)
      else if (currentSteps > 0 && clickedCol === currentSteps - 2) {
        const previousPad = selected[selected.length - 2] ?? 'start';
        if (index === (previousPad === 'start' ? -1 : previousPad)) {
          setLives((l) => {
            const nl = l - 1;
            if (nl <= 0) setGameStatus('lost');
            return Math.max(0, nl);
          });
          setLastAction('penalty-' + Date.now());
          setFrogPos(previousPad);
          setSelected((s) => s.slice(0, -1));
          setHistory((h) => h.slice(0, -1));
        } else {
          setLastAction('invalid-' + Date.now());
        }
      } else {
        setLastAction('invalid-' + Date.now());
      }
    },
    [selected, history, gameStatus, mode, nums, target, frogPos]
  );

  const handleJumpBack = useCallback(() => {
    if (selected.length === 0) return;
    setLives((l) => {
      const nl = l - 1;
      if (nl <= 0) setGameStatus('lost');
      return Math.max(0, nl);
    });
    setLastAction('penalty-' + Date.now());
    const prev = history[history.length - 1];
    setFrogPos(prev ?? 'start');
    setSelected((s) => s.slice(0, -1));
    setHistory((h) => h.slice(0, -1));
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
    const newMode =
      mode === MODES.ADDITION ? MODES.MULTIPLICATION : MODES.ADDITION;
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
