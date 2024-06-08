/*
 TODO:
  [x] - finish smart resize function (existing nodes)
  [ ] - add jest|vitest tests for the Grid class
 */

import { DefaultGridObject } from './grid.defaults';
import {
  // Endpoints,
  // NodeBalanceArea,
  GridState,
  NodeLocation,
  EndpointType,
  IGrid,
  AddRowPosition,
  AddColPosition,
} from './grid.types';

import { INodeAttributes, initializeNode, NodeType } from './NodeAttributes';
import { getAbsoluteLocation, stringifyLocationObject } from './utils';

let mutateOriginal = false;

export function setMuteteOriginal(value: boolean): void {
  mutateOriginal = value;
}

export function getMutateOriginal(): boolean {
  return mutateOriginal;
}

/**
 * Creates a 2 dimensional array of INodeAttributes (rows x cols)
 * @param rows
 * @param cols
 * @returns INodeAttributes[][]
 */
export function createAttributeArray(rows: number, cols: number): GridState {
  // this took me forever to properly annotate.
  return Array.from<object, INodeAttributes[]>(
    { length: rows },
    () => (
      Array.from<object, INodeAttributes>(
        { length: cols },
        () => initializeNode(),
      )
    ),
  );
}

/* const heuristicsUpdater = (grid: IGrid): IGrid => {
  const newGrid = grid;
  const horizontalVerticalWeights: number[] = [];
  const diagonalWeights: number[] = [];

  // Iterate over each node in the grid
  for (let row = 0; row < grid.nodes.length; row++) {
    for (let col = 0; col < grid.nodes[row].length; col++) {
      const currentNode = getNode(grid, { row, col });

      // If the node exists and is not a wall
      if (currentNode && currentNode.type !== NodeType.wall) {
        const neighbors = getNeighbors(grid, { row, col });

        // Iterate over neighbors to find weights of horizontal/vertical and diagonal moves
        for (const neighbor of neighbors) {
          const neighborNode = getNode(grid, neighbor);

          // Calculate the difference in row and column indices
          const dx = Math.abs(row - neighbor.row);
          const dy = Math.abs(col - neighbor.col);

          // If the difference in either dx or dy is 1, it's a horizontal/vertical move
          if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            if (neighborNode && neighborNode.type !== NodeType.wall) {
              horizontalVerticalWeights.push(neighborNode.weight ?? 1);
            }
          }
          // Otherwise, it's a diagonal move
          else {
            if (neighborNode && neighborNode.type !== NodeType.wall) {
              diagonalWeights.push(neighborNode.weight ?? 1);
            }
          }
        }
      }
    }
  }

  // Calculate average weights for horizontal/vertical and diagonal moves
  const D =
  horizontalVerticalWeights.reduce((acc, val) => acc + val, 0) / horizontalVerticalWeights.length;
  const D2 = diagonalWeights.reduce((acc, val) => acc + val, 0) / diagonalWeights.length;

  return { D, D2 };
  return newGrid;
}; */

/**
 * Create a grid object with the given number of rows and columns
 * @param rows
 * @param cols
 * @returns
 */
export function createGrid(rows: number, cols: number): IGrid {
  const GridObject: IGrid = {
    ...DefaultGridObject,
    nodes: createAttributeArray(rows, cols),
    shape: [rows, cols],
    /*  heuristics: [1, 0],
    get D() {
      if (this.heuristics[2] !== this.nodeRegistry.length) {
        this.heuristics;
      }
      return this.heuristics[0];
    },

    get D2() {
      return Math.sqrt(this.D * this.D);
    }, */
  };

  return GridObject;
}

export function updateEndpoint(oGrid: IGrid, type: EndpointType, location: NodeLocation): IGrid {
  if (type !== NodeType.start && type !== NodeType.end) {
    throw new Error("Invalid endpoint type. Must be 'start' or 'end'");
  }

  const grid = oGrid;
  const index = type === NodeType.start ? 0 : 1;
  const currentEndpoint = grid.endpoints[index];

  if (currentEndpoint?.row !== undefined && currentEndpoint?.col !== undefined) {
    const { row, col } = currentEndpoint;
    grid.nodes[row][col].type = NodeType.default;
  }

  grid.endpoints[index] = location;
  if (type === NodeType.start) {
    grid.startNodeSet = true;
  } else {
    grid.endNodeSet = true;
  }

  return grid;
}

export function updateShape(oGrid: IGrid): IGrid {
  const grid = oGrid;
  grid.shape = [grid.nodes.length, grid.nodes[0].length];
  return grid;
}

/**
 * Get the node at a given the relative / absolute location in the grid
 * @param location location of the node in the grid
 * @returns NodeAttributes | undefined
 */
export function getNode(grid: IGrid, location: NodeLocation): INodeAttributes | undefined {
  const [row, col] = getAbsoluteLocation(grid, location);
  return grid.nodes[row][col];
}

/**
 * Set the node at a given location or multiple locations in the grid
 * @param grid The grid to update
 * @param location The location or locations of the node in the grid
 * @param attributes The attributes to update the node with
 * @returns { location: NodeLocation | NodeLocation[], attributes: Partial<INodeAttributes>}
 *  The location and attributes of the node that was updated
 */
export function setNode(
  grid: IGrid,
  location: NodeLocation | NodeLocation[],
  attributes: Partial<INodeAttributes>,
): { location: NodeLocation | NodeLocation[], attributes: Partial<INodeAttributes> } {
  // Destructure the attributes
  const { type, weight, visited } = attributes;
  const normalizedLocation = Array.isArray(location) ? location : [location];

  normalizedLocation.forEach((loc) => {
    const [row, col] = getAbsoluteLocation(grid, loc);
    const node = grid.nodes[row][col];

    // Determine the final attributes for the node
    const finalType = (type ?? node.type) === NodeType.default && (weight ?? node.weight) > 1
      ? NodeType.weight
      : type ?? node.type;
    const finalWeight = weight ?? node.weight;
    const finalVisited = visited ?? node.visited;

    // Update the node attributes
    Object.assign(node, {
      type: finalType,
      weight: finalWeight,
      visited: finalVisited,
    });

    // Update the endpoint if the node is a start or end node
    if (finalType === NodeType.start || finalType === NodeType.end) {
      updateEndpoint(grid, finalType as EndpointType, loc);
    }

    // Determine if the node should be deleted from the registry
    const toDelete = finalType === NodeType.default && finalWeight === 1 && !finalVisited;
    // Update the node registry
    const nodeKey = stringifyLocationObject(loc);

    // clever but not easy to read
    /* const params = toDelete ? [nodeKey] : [nodeKey, { location, node }];
    grid.nodeRegistry[`${toDelete ? 'delete' : 'set'}`](...params); */

    if (toDelete) {
      grid.nodeRegistry.delete(nodeKey);
    } else {
      grid.nodeRegistry.set(nodeKey, { location: loc, attributes: node });
    }
  });

  return { location, attributes };
}

interface NodeParams {
  fullSearch?: boolean
  type?: boolean;
  visited?: boolean;
  weight?: boolean;
}

/**
 * Clear nodes in the grid based on specified parameters
 * @param grid The grid to update
 * @param params The parameters to clear nodes
 * @param useCache Whether to use the node registry or or grid to clear all nodes
 * @returns Updated grid
 */
export function clearNodes(grid: IGrid, params?: NodeParams, useCache = false): IGrid {
  const { type, visited, weight } = params ?? {};

  const resetObject: Partial<INodeAttributes> = {};

  if (type === true || type === undefined) resetObject.type = NodeType.default;
  if (visited === true || visited === undefined) resetObject.visited = false;
  if (weight === true || weight === undefined) resetObject.weight = 1;

  const fullClear = type && visited && weight;

  if (useCache) {
    // Clear nodes using the registry
    grid.nodeRegistry.forEach(({ location }) => {
      const node = grid.nodes[location.row][location.col];
      Object.assign(node, resetObject);
    });
  } else {
    // Clear all nodes in the grid
    grid.nodes.forEach((row) => {
      row.forEach((node) => {
        Object.assign(node, resetObject);
      });
    });
  }

  if (fullClear) {
    grid.nodeRegistry.clear();
  }

  return grid;
}

/**
 * Modify the number of rows in the grid
 * @param position the position to modify the rows
 * @param count the number of rows to add or remove
 * @returns void
 */
export function modifyRow(grid: IGrid, position: AddRowPosition, count: number): IGrid {
  if (count === 0) return grid;

  // Validate position
  if (position !== 'top' && position !== 'bottom') {
    throw new Error(`Invalid Row position. Given: "${position as string}". Allowed: "top" | "bottom"`);
  }

  // Prepare new rows if count is positive
  const newRows: GridState | undefined = count > 0
    ? createAttributeArray(count, grid.shape[1])
    : undefined;

  // Update grid based on position and count
  // eslint-disable-next-line default-case
  switch (position) {
    case 'top':
      if (count > 0) {
        grid.nodes.unshift(...newRows!);
      } else {
        for (let i = 0; i < Math.abs(count); i += 1) {
          grid.nodes.shift();
        }
      }
      break;

    case 'bottom':
      if (count > 0) {
        grid.nodes.push(...newRows!);
      } else {
        for (let i = 0; i < Math.abs(count); i += 1) {
          grid.nodes.pop();
        }
      }
      break;
  }

  // Update grid shape
  return updateShape(grid);
}

/**
 * Modify the number of columns in the grid
 * @param position the position to modify the columns
 * @param count the number of columns to add or remove
 * @returns void
 */
export function modifyCol(oGrid: IGrid, position: AddColPosition, count: number): IGrid {
  if (count === 0) return oGrid;

  // to keep eslint happy
  const grid = oGrid;

  // Validate position
  if (position !== 'left' && position !== 'right') {
    throw new Error(`Invalid Col position. Given: "${position as AddRowPosition}". Allowed: "left" | "right"`);
  }

  // Prepare new cols if count is positive
  const newCols: GridState | undefined = count > 0
    ? createAttributeArray(grid.shape[0], count)
    : undefined;

  // Update grid based on position and count
  // eslint-disable-next-line default-case
  switch (position) {
    case 'left':
      if (count > 0) {
        // Map over each row and create a new array by combining newCols and existing row
        grid.nodes = grid.nodes.map((row, index) => [...newCols![index], ...row]);
      } else {
        // Iterate over each row and remove elements from the beginning
        grid.nodes.forEach((row) => {
          for (let i = 0; i < Math.abs(count); i += 1) {
            row.shift();
          }
        });
      }
      break;

    case 'right':
      if (count > 0) {
        // Map over each row and create a new array by combining existing row and newCols
        grid.nodes = grid.nodes.map((row, index) => [...row, ...newCols![index]]);
      } else {
        // Iterate over each row and remove elements from the end
        grid.nodes.forEach((row) => {
          for (let i = 0; i < Math.abs(count); i += 1) {
            row.pop();
          }
        });
      }
      break;
  }

  return updateShape(grid);
}

export function updateDnD2(
  grid: IGrid,
  start: NodeLocation,
  end: NodeLocation,
  type: NodeType,
): IGrid {
  const startNode = getNode(grid, start);
  const endNode = getNode(grid, end);

  if (startNode && endNode) {
    startNode.type = type;
    endNode.type = type;
  }

  return grid;
}

/*
resizeGridSmart(targetRows: number, targetCols: number, protected: boolean): DimensionArray | null {
  if (true) {
    console.log('Resize gird smart not yet implemented');
    return null;
  }
  const cuurrentRows = grid.nodes.length;
  const currentCols = grid.nodes[0].length;

  if (targetRows === cuurrentRows && targetCols === currentCols) {
    return null;
  }

  const rowDiff = targetRows - cuurrentRows;
  const colDiff = targetCols - currentCols;

  const {
    top, right, bottom, left,
  } = this.calcNodeOccupationArea();

  if (targetRows < cuurrentRows) {
    // this.modifyRow('top', rowDiff);

    if (top < Math.abs(rowDiff)) {
      throw new Error('Cannot remove rows. Nodes are occupying the top area');
    }
  } else {
    return null;
  }

  this.updateShape();

  return grid.shape;
} */

export default {
  createAttributeArray,
  createGrid,
  getNode,
  setNode,
  modifyRow,
  modifyCol,
  updateEndpoint,
  updateShape,
};
