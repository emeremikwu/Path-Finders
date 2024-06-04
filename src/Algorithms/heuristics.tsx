import { NodeLocation } from '../Grid/grid.types';
import { HeuristicFN } from './algorithms.types';

function validateStartEnd(start: NodeLocation, end: NodeLocation): void {
  if (!start || !end) {
    throw new Error('Invalid start or end node');
  }
}

export const manhattanDistance: HeuristicFN = (start, end) => {
  validateStartEnd(start, end);

  return Math.abs(start.row - end.row) + Math.abs(start.col - end.col);
};

export const diagonalDistance: HeuristicFN = (start, end) => {
  validateStartEnd(start, end);
  const D = 1;
  const D2 = Math.sqrt(2);

  const dx = Math.abs(start.row - end.row);
  const dy = Math.abs(start.col - end.col);

  // return Math.max(dx, dy);
  return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
};

export const euclideanDistance: HeuristicFN = (start, end) => {
  validateStartEnd(start, end);

  return Math.sqrt((start.row - end.row) ** 2 + (start.col - end.col) ** 2);
};
