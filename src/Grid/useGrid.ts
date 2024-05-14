// TODO:
import {
  useState, Dispatch, SetStateAction, createContext,
} from 'react';

import Grid, {
  DefaultNodeLocation,
  Dimension, DimensionArray, DimensionObject,
  NodeLocation,
} from './Grid';
import { NodeType } from './NodeAttributes';

/**
 * Checks if the dimension is a DimensionArray
 * @param dimension
 * @returns boolean
 */
function isDimensionArray(dimension: Dimension): dimension is DimensionArray {
  if (!Array.isArray(dimension)) return false;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (dimension.length !== 2) return false;

  if (dimension.some((val) => typeof val !== 'number' || val <= 0)) return false;

  return true;
}

export interface IGridContext {
  grid: Grid
  setGrid: Dispatch<SetStateAction<Grid>>
  updateDimensions: (rows: number, cols: number) => void
  setNode: (row: number, col: number, nodeType: NodeType, weight: number) => void

}

/**
 * Checks if the dimension is a DimensionObject
 * @param dimension
 * @returns boolean
 */
function isDimensionObject(dimension: Dimension): dimension is DimensionObject {
  if (typeof dimension !== 'object') return false;

  if (!('rows' in dimension) || !('cols' in dimension)) return false;

  if (typeof dimension.rows !== 'number' || typeof dimension.cols !== 'number') return false;

  if (dimension.rows <= 0 || dimension.cols <= 0) return false;

  return true;
}

/**
 * Parses a dimension string, object, or array into a DimensionArray.
 * Throws an error if the dimension is invalid.
 * @param dimension
 * @param delimiter
 * @returns DimensionArray
 */
export function parseDimension(dimension: Dimension, delimiter?: string): DimensionArray {
  if (typeof dimension === 'string') {
    // const dimValidator = /^(?<rows>\d+)[x|X|](?<cols>\d+)$/
    const dimValidator = new RegExp(`^(?<rows>\\d+)[x|X|${delimiter ?? ''}](?<cols>\\d+)$`);
    const match = dimension.match(dimValidator);

    if (match) {
      const { rows, cols } = match.groups as { rows: string, cols: string };

      if (Number(rows) > 0 && Number(cols) > 0) { return [Number(rows), Number(cols)]; }
    }
  }

  if (isDimensionArray(dimension)) {
    return dimension;
  }

  if (isDimensionObject(dimension)) {
    return [dimension.rows, dimension.cols];
  }

  throw new Error('Invalid dimension format');
}

const updateGridDimensions = (
  dispatch: Dispatch<SetStateAction<Grid>>,
) => (rows: number, cols: number): void => {
  const [parsedRows, parsedCols] = parseDimension({ rows, cols });
  dispatch((prev) => {
    prev.resizeGrid(parsedRows, parsedCols);
    return prev;
  });
};

const setGridNode = (
  dispatch: Dispatch<SetStateAction<Grid>>,
) => (row: number, col: number, nodeType: NodeType, weight: number) => {
  dispatch((prev) => {
    const location: NodeLocation = {
      ...DefaultNodeLocation, row, col, startFromOne: true,
    };
    prev.setNode(location, nodeType, weight);
    return prev;
  });
};

/**
 * Custom hook for managing a grid of nodes
 * @param dimensions
 * @param delimiter
 * @returns {gridNodes, setGridNodes, updateGridDimension}
 */

function useGrid(dimensions: Dimension, delimiter?: string) {
  const [rows, cols] = parseDimension(dimensions, delimiter);
  const [grid, setGrid] = useState<Grid>(new Grid(rows, cols));

  /*
  [ ] - add functionality to keep track of currently occupied nodes.
        Maybe a calculateAreaOfUse function?
   */

  return {
    grid,
    setGrid,
    updateDimensions: updateGridDimensions(setGrid),
    setNode: setGridNode(setGrid),

  };
}

/* export const GridContext = createContext<ReturnType<typeof useGrid>>({
  gridNodes: [],
  setGridNodes: () => {},
  updateDimensions: () => {},
}); */

export const GridContext = createContext<IGridContext | null>(null);

export default useGrid;
