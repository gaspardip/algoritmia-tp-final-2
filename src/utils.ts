import type { CellCoordinates } from "./types";

export const serialize = (x: number, y: number): CellCoordinates => `${x},${y}`;
export const deserialize = (coord: CellCoordinates) => coord.split(",").map(Number);

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

export const calculateNextGeneration = (currentLiveCells: Set<CellCoordinates>, gridSize: number) => {
  const newLiveCells = new Set<CellCoordinates>();
  const cellsToEvaluate = new Set<CellCoordinates>();

  for (const cell of currentLiveCells) {
    const [x, y] = deserialize(cell);

    // Add the current live cell
    cellsToEvaluate.add(cell);

    // Add neighbors
    for (const [dx, dy] of dirs) {
      const neighborX = x + dx;
      const neighborY = y + dy;

      if (
        neighborX >= 0 &&
        neighborX < gridSize &&
        neighborY >= 0 &&
        neighborY < gridSize
      ) {
        const neighborCoord = serialize(neighborX, neighborY);
        cellsToEvaluate.add(neighborCoord);
      }
    }
  }

  for (const cell of cellsToEvaluate) {
    const [x, y] = deserialize(cell);

    const isAlive = currentLiveCells.has(cell);

    let count = 0;

    for (const [dx, dy] of dirs) {
      const neighborX = x + dx;
      const neighborY = y + dy;
      if (
        neighborX >= 0 &&
        neighborX < gridSize &&
        neighborY >= 0 &&
        neighborY < gridSize
      ) {
        const neighborCoord = serialize(neighborX, neighborY);
        if (currentLiveCells.has(neighborCoord)) {
          count++;
        }
      }
    };

    if (isAlive && (count === 2 || count === 3)) {
      newLiveCells.add(cell);
    } else if (!isAlive && count === 3) {
      newLiveCells.add(cell);
    }
  };

  return newLiveCells;
};

export const generateRandomGrid = (gridSize: number) => {
  const newLiveCells = new Set<CellCoordinates>();

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (Math.random() > 0.5) {
        const coord = serialize(x, y);
        newLiveCells.add(coord);
      }
    }
  }

  return newLiveCells;
}

export const isGridEmpty = (grid: Set<CellCoordinates>) => {
  return grid.size === 0;
}