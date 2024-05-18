// TODO:
import {
  useState, Dispatch, SetStateAction,
} from 'react';

import {
  Dimension,
  NodeLocation,
  IGrid,

} from './grid.types';
import { createGrid, setNode } from './mutaters';
import { INodeAttributes, NodeType } from './nodeAttributes';
import { DefaultNodeLocation } from './grid.defaults';
import { getAbsoluteLocation, parseDimension } from './utils';

const updateGridDimensions = (
  dispatch: Dispatch<SetStateAction<IGrid>>,
) => (rows: number, cols: number): void => {
  const [parsedRows, parsedCols] = parseDimension({ rows, cols });
  dispatch(() => {
    // [ ] - use smartResizeGrid mutater once implemented
    const newGrid = createGrid(parsedRows, parsedCols);
    return newGrid;
  });
};

const setGridNode = (
  dispatch: Dispatch<SetStateAction<IGrid>>,
) => (row: number, col: number, attributes: Partial<INodeAttributes>) => {
  dispatch((prev) => {
    const newGrid = { ...prev };
    const location: NodeLocation = {
      ...DefaultNodeLocation, row, col, startFromOne: false,
    };
    setNode(newGrid, location, attributes);
    return newGrid;
  });
};

const getGridNode = (
  grid: IGrid,
) => (row: number, col: number, startFromOne: boolean): NodeType => {
  const location: NodeLocation = {
    ...DefaultNodeLocation,
    row,
    col,
    ...(startFromOne ? { startFromOne } : {}),
  };

  const [nRow, nCol] = getAbsoluteLocation(grid, location);
  return grid.nodes[nRow][nCol].type;
};

/**
 * Custom hook for managing a grid of nodes
 * @param dimensions
 * @param delimiter
 * @returns {gridNodes, setGridNodes, updateGridDimension}
 */
// export const GridContext = createContext<IGridContext | null>(null);

function useGrid(dimensions: Dimension, delimiter?: string) {
  const [rows, cols] = parseDimension(dimensions, delimiter);
  const [grid, setGrid] = useState<IGrid>(createGrid(rows, cols));

  return {
    grid,
    setGrid,
    updateDimensions: updateGridDimensions(setGrid),
    setNode: setGridNode(setGrid),
    getNode: getGridNode(grid),
  };
}
/*
export const GridContext = createContext<ReturnType<typeof useGrid>>({
  grid,
  setGrid,
  updateDimensions: updateGridDimensions(setGrid),
  setNode: setGridNode(setGrid),
  getNode: getGridNode(grid),
}); */

export default useGrid;
