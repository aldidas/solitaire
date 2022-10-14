export const SIZE = 7;
export const BOARD_SIZE = 700;

export const TEMPLATES = {
  cross: [
    ["X", "X", "0", "0", "0", "X", "X"],
    ["X", "X", "0", "0", "0", "X", "X"],
    ["0", "0", "0", "1", "0", "0", "0"],
    ["0", "0", "1", "1", "1", "0", "0"],
    ["0", "0", "0", "1", "0", "0", "0"],
    ["X", "X", "0", "1", "0", "X", "X"],
    ["X", "X", "0", "0", "0", "X", "X"],
  ],
  plus: [
    ["X", "X", "0", "0", "0", "X", "X"],
    ["X", "X", "0", "1", "0", "X", "X"],
    ["0", "0", "0", "1", "0", "0", "0"],
    ["0", "1", "1", "1", "1", "1", "0"],
    ["0", "0", "0", "1", "0", "0", "0"],
    ["X", "X", "0", "1", "0", "X", "X"],
    ["X", "X", "0", "0", "0", "X", "X"],
  ],
  fireplace: [
    ["X", "X", "1", "1", "1", "X", "X"],
    ["X", "X", "1", "1", "1", "X", "X"],
    ["0", "0", "1", "1", "1", "0", "0"],
    ["0", "0", "1", "0", "1", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0"],
    ["X", "X", "0", "0", "0", "X", "X"],
    ["X", "X", "0", "0", "0", "X", "X"],
  ],
  uparrow: [
    ["X", "X", "0", "1", "0", "X", "X"],
    ["X", "X", "1", "1", "1", "X", "X"],
    ["0", "1", "1", "1", "1", "1", "0"],
    ["0", "0", "0", "1", "0", "0", "0"],
    ["0", "0", "0", "1", "0", "0", "0"],
    ["X", "X", "1", "1", "1", "X", "X"],
    ["X", "X", "1", "1", "1", "X", "X"],
  ],
  pyramid: [
    ["X", "X", "0", "0", "0", "X", "X"],
    ["X", "X", "0", "1", "0", "X", "X"],
    ["0", "0", "1", "1", "1", "0", "0"],
    ["0", "1", "1", "1", "1", "1", "0"],
    ["1", "1", "1", "1", "1", "1", "1"],
    ["X", "X", "0", "0", "0", "X", "X"],
    ["X", "X", "0", "0", "0", "X", "X"],
  ],
  diamond: [
    ["X", "X", "0", "1", "0", "X", "X"],
    ["X", "X", "1", "1", "1", "X", "X"],
    ["0", "1", "1", "1", "1", "1", "0"],
    ["1", "1", "1", "1", "1", "1", "1"],
    ["0", "1", "1", "1", "1", "1", "0"],
    ["X", "X", "1", "1", "1", "X", "X"],
    ["X", "X", "0", "1", "0", "X", "X"],
  ],
  solitaire: [
    ["X", "X", "1", "1", "1", "X", "X"],
    ["X", "X", "1", "1", "1", "X", "X"],
    ["1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "0", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1"],
    ["X", "X", "1", "1", "1", "X", "X"],
    ["X", "X", "1", "1", "1", "X", "X"],
  ],
};
