// a class of non mutating utility functions for the grid
import { DefaultNodeLocation } from './grid.defaults';
import {
  Dimension,
  DimensionArray,
  DimensionObject,
  Endpoints, IGrid, NodeBalanceArea, NodeLocation, NodeRegistryEntry,
} from './grid.types';

import { INodeAttributes, NodeType } from './NodeAttributes';

/**
 * Check if the row and column are within the bounds of the grid
 * @param row the row index
 * @param col the column index
 * @param target the grid to check the bounds against
 * @param startFromOne whether the row and column are 1-indexed
 * @param throwError whether to throw an error if the index is out of bounds
 * @returns boolean
 */
function checkBounds(
  grid: IGrid,
  row: number,
  col: number,
  startFromOne = false,
  throwError = true,
): boolean {
  // [ ] - might switch parameters to location object for consistency
  const isWithinBounds = startFromOne
    ? (row >= 0 && col >= 0 && row < grid.shape[0] && col < grid.shape[1])
    : (row >= 0 && col >= 0 && row <= grid.shape[0] - 1 && col <= grid.shape[1] - 1);

  if (!isWithinBounds && throwError) {
    const msg = `Index out of bounds ${row}:${col} \nShape: ${JSON.stringify(grid.shape)} \nStarting Index: ${startFromOne ? 1 : 0}`;
    throw new Error(msg);
  }

  return isWithinBounds;
}
/**
 * Check if a node is already registered in the grid
 * @param location the location of the node in the grid
 * @returns NodeResistryEntry | undefined
 */
export function nodeIsRegistered(
  grid: IGrid,
  location: NodeLocation,
): NodeRegistryEntry | undefined {
  return grid.nodeRegistry.find((nodeEntry) => nodeEntry.location === location);
}

/**
 * Get the absolute location of a node in the grid
 * @param grid grid object,
 * @param location location object containing the row and column
 * @param {boolean} validateBounds check if the location is within bounds of the grid object
 * @returns [number, number]
 */
// [ ] - reorganize the parameters to be more consistent
// [ ] - update logic for reverseRowIndex and null grid
export function getAbsoluteLocation(
  grid: IGrid | null,
  location: NodeLocation,
  validateBounds = true,
): [number, number] {
  let { row, col } = { ...DefaultNodeLocation, ...location };
  const { startFromOne, reverseRowIndex } = location;

  if (row === undefined || col === undefined) {
    throw new Error('Location inproperly initialized, requires node object or (row and col) ');
  }

  if (grid === null && validateBounds) {
    throw new Error('Grid object is required for bounds validation');
  }

  if (startFromOne) {
    row -= 1;
    col -= 1;
  }

  if (reverseRowIndex && grid) {
    row = grid.shape[0] - row;
  }

  /*
    if the function is being called by an algorithm then we don't necessary need to check this
    it could also potentially shave milliseconds of execution time
  */
  if (validateBounds && grid) checkBounds(grid, row, col, startFromOne);

  return [row, col];
}

/**
   * Get the distance of a node to each edge of the grid
   * @param location the location of the node in the grid
   * @returns NodeBalanceArea
   */
export function distanceToEdge(grid: IGrid, location: NodeLocation): NodeBalanceArea {
  const [row, col] = getAbsoluteLocation(grid, location);

  return {
    top: row,
    right: grid.shape[1] - 1 - col,
    bottom: grid.shape[0] - 1 - row,
    left: col,
  };
}

/**
 * Find the start and end nodes in the grid.
 * If the start and end nodes are already set, return them
 * Probably won't be used very often
 * @returns [NodeAttributes, NodeAttributes]
 */
export function findEndpoints(grid: IGrid): Endpoints {
  // if the endpoints are already set, return them
  if (grid.endNodeSet || grid.startNodeSet) {
    return grid.endpoints;
  }

  const localEndpoints: Endpoints = [undefined, undefined];

  // local function to check if the node is a start or end node
  const setIfEndpoint = (node: INodeAttributes, location: NodeLocation) => {
    if (node.type === NodeType.start || node.type === NodeType.end) {
      localEndpoints[node.type === NodeType.start ? 0 : 1] = location;
    }
  };

  // check the occupied nodes first
  // eslint-disable-next-line no-restricted-syntax
  for (const nodeEntry of grid.nodeRegistry) {
    setIfEndpoint(nodeEntry.node, nodeEntry.location);

    if (localEndpoints[0] && localEndpoints[1]) {
      return localEndpoints;
    }
  }

  // check the rest of the nodes
  for (let r = 0; r < grid.shape[0]; r += 1) {
    for (let c = 0; c < grid.shape[1]; c += 1) {
      const node = grid.nodes[r][c];
      if (nodeIsRegistered(grid, { ...DefaultNodeLocation, row: r, col: c })?.node === node) {
        // eslint-disable-next-line no-continue
        continue;
      }

      setIfEndpoint(node, { ...DefaultNodeLocation, row: r, col: c });

      if (localEndpoints[0] && localEndpoints[1]) {
        return localEndpoints;
      }
    }

    if (localEndpoints[0] && localEndpoints[1]) {
      return localEndpoints;
    }
  }

  return grid.endpoints;
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

export function stringifyLocation(row: number, col: number): string {
  return `${row.toString()}:${col.toString()}`;
}

export function stringifyLocationObject(location: NodeLocation): string {
  if (location.row === undefined || location.col === undefined) {
    throw new Error('Location object must contain row and col properties');
  }

  const tmp = getAbsoluteLocation(null, location, false);
  return stringifyLocation(...tmp);
}
/**
 * Calculates the area of the grid that nodes are occupying.
 * This is useful for balancing the grid when adding or removing rows and columns
 */
// function calcNodeOccupationArea(grid: IGrid): NodeBalanceArea {
//   const activeArea = {
//     top: Infinity,
//     right: Infinity,
//     bottom: Infinity,
//     left: Infinity,
//   };

//   grid.nodeRegistry.forEach((nodeEntry) => {
//     const { location } = nodeEntry;
//     const {
//       top, right, bottom, left,
//     } = distanceToEdge(grid, location);

//     activeArea.top = Math.min(activeArea.top, top);
//     activeArea.right = Math.min(activeArea.right, right);
//     activeArea.bottom = Math.min(activeArea.bottom, bottom);
//     activeArea.left = Math.min(activeArea.left, left);
//   });

//   return activeArea;
// }
