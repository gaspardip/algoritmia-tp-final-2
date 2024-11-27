import type { GridState } from "./types";

// possible directions to check for neighbors
const dirs = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
];

export const countNeighbors = (grid: GridState, x: number, y: number) => {
  const gridSize = grid.length;

  let count = 0;

  for (const [dx, dy] of dirs) {
    const newX = x + dx;
    const newY = y + dy;
    if (
      newX >= 0 &&
      newX < gridSize &&
      newY >= 0 &&
      newY < gridSize &&
      grid[newX][newY]
    ) {
      count++;
    }
  }

  return count;
};

export const generateEmptyGrid = (size: number) => {
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  return grid;
}

export const generateRandomGrid = (size: number) => {
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.random() > 0.5)
  );

  return grid;
}

export const isGridEmpty = (grid: GridState) => {
  return grid.every((row) => row.every((cell) => !cell));
}