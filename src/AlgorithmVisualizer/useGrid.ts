// TODO:
import { useState, Dispatch, SetStateAction } from 'react';
import { INodeAttributes, initializeWithLocation } from './NodeAttributes';

// I'm probably gonna have to remove 90% of the useReducer stuff and just use useState.
interface DimensionObject { rows: number, cols: number }
type DimensionArray = [number, number];
type DimensionString = string;
export type Dimension = DimensionObject | DimensionArray | DimensionString;
export type GridState = INodeAttributes[][];

/**
 * Creates a grid of rows x cols
 * @param rows
 * @param cols
 * @returns a 2D array of strings representing the grid (GridState)
 */
function createGrid(rows: number, cols: number): GridState {
  // Array<INodeAttributes>(cols).fill(Object.assign({}, NodeAttributes))

  // this took me forever to properly annotate.
  const attributeArray: GridState = Array.from<object, INodeAttributes[]>(
    { length: rows },
    (_rowObject, rowIndex) => (
      Array.from<object, INodeAttributes>(
        { length: cols },
        (_colObject, colIndex) => initializeWithLocation(rowIndex, colIndex),
      )
    ),
  );

  return attributeArray;
}

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
function parseDimension(dimension: Dimension, delimiter?: string): DimensionArray {
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
  dispatch: Dispatch<SetStateAction<GridState>>,
) => (rows: number, cols: number): void => {
  const [parsedRows, parsedCols] = parseDimension({ rows, cols });
  dispatch(createGrid(parsedRows, parsedCols));
};

/**
 * Custom hook for managing a grid of nodes
 * @param dimensions
 * @param delimiter
 * @returns {gridNodes, setGridNodes, updateGridDimension}
 */
function useGrid(dimensions: Dimension, delimiter?: string) {
  const [rows, cols] = parseDimension(dimensions, delimiter);
  const [gridNodes, setGridNodes] = useState<GridState>(createGrid(rows, cols));

  /*
  [ ] - add functionality to keep track of currently occupied nodes.
        Maybe a calculateAreaOfUse function?
   */

  return {
    gridNodes,
    setGridNodes,
    updateDimensions: updateGridDimensions(setGridNodes),
  };
}

export default useGrid;
