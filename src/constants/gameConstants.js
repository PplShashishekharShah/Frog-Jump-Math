export const GRID_ROWS = 4;
export const GRID_COLS = 3;

export const MODES = {
  ADDITION: 'addition',
  MULTIPLICATION: 'multiplication',
};

export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

// Number ranges for leaf generation per difficulty
export const NUMBER_RANGES = {
  [DIFFICULTY.EASY]: { min: 1, max: 9 },
  [DIFFICULTY.MEDIUM]: { min: 1, max: 12 },
  [DIFFICULTY.HARD]: { min: 1, max: 15 },
};

// Target range per difficulty and mode
export const TARGET_RANGES = {
  [MODES.ADDITION]: {
    [DIFFICULTY.EASY]: { min: 5, max: 18 },
    [DIFFICULTY.MEDIUM]: { min: 8, max: 24 },
    [DIFFICULTY.HARD]: { min: 12, max: 30 },
  },
  [MODES.MULTIPLICATION]: {
    [DIFFICULTY.EASY]: { min: 2, max: 36 },
    [DIFFICULTY.MEDIUM]: { min: 4, max: 72 },
    [DIFFICULTY.HARD]: { min: 6, max: 120 },
  },
};
