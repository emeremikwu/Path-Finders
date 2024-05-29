// TODO:
import { DefaultNodeLocation } from '../Grid/grid.defaults';
import { IGrid, NodeLocation } from '../Grid/grid.types';
import { getAbsoluteLocation } from '../Grid/utils';

/*
export function getNeighborsOld(grid: IGrid, node: NodeLocation, diagonal = false): NodeLocation[] {
  const neighbors: NodeLocation[] = [];
  // [ ] - switch to shape instead of row and col
  const [rowCount, colCount] = [grid.nodes.length, grid.nodes[0].length];

  // not really necessary but insures that a node has a proper location,
  // and if we decided to modify how we access a node index we don't have to change much

  const [row, col] = getAbsoluteLocation(grid, node, false);

  if (row > 0) {
    neighbors.push({ ...DefaultNodeLocation, row: row - 1, col });
  }
  if (row < rowCount - 1) {
    neighbors.push({ ...DefaultNodeLocation, row: row + 1, col });
  }
  if (col > 0) {
    neighbors.push({ ...DefaultNodeLocation, row, col: col - 1 });
  }
  if (col < colCount - 1) {
    neighbors.push({ ...DefaultNodeLocation, row, col: col + 1 });
  }

  if (diagonal) {
    if (row > 0 && col > 0) {
      neighbors.push({ ...DefaultNodeLocation, row: row - 1, col: col - 1 });
    }
    if (row > 0 && col < colCount - 1) {
      neighbors.push({ ...DefaultNodeLocation, row: row - 1, col: col + 1 });
    }
    if (row < rowCount - 1 && col > 0) {
      neighbors.push({ ...DefaultNodeLocation, row: row + 1, col: col - 1 });
    }
    if (row < rowCount - 1 && col < colCount - 1) {
      neighbors.push({ ...DefaultNodeLocation, row: row + 1, col: col + 1 });
    }
  }
  return neighbors;
}
 */

// version 2 - using a more functional approach
// [ ] - add documentation
export function getNeighbors(grid: IGrid, node: NodeLocation, diagonal = false): NodeLocation[] {
  const neighbors: NodeLocation[] = [];
  const [rowCount, colCount] = [grid.nodes.length, grid.nodes[0].length];
  const [row, col] = getAbsoluteLocation(grid, node, false);

  const orthogonals = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const diagonals = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  const addNeighbor = (pRow: number, pCol: number) => {
    const newRow = row + pRow;
    const newCol = col + pCol;
    if (newRow >= 0 && newRow < rowCount && newCol >= 0 && newCol < colCount) {
      neighbors.push({ ...DefaultNodeLocation, row: newRow, col: newCol });
    }
  };

  const offsets = diagonal ? orthogonals.concat(diagonals) : orthogonals;
  offsets.forEach(([currentRow, currentCol]) => addNeighbor(currentRow, currentCol));

  return neighbors;
}

export default getNeighbors;
