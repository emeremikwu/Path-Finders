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
  NodeResistryEntry,
  NodeLocation,
  EndpointType,
  IGrid,
  AddRowPosition,
  AddColPosition,
} from './grid.types';

import { INodeAttributes, initializeNode, NodeType } from './nodeAttributes';
import { getAbsoluteLocation, nodeIsRegistered } from './utils';

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

/**
 * Create a grid object with the given number of rows and columns
 * @param rows
 * @param cols
 * @returns
 */
export function createGrid(rows: number, cols: number): IGrid {
  const GridObject: IGrid = { ...DefaultGridObject };
  const attributeArray = createAttributeArray(rows, cols);

  GridObject.nodes = attributeArray;
  GridObject.shape = [rows, cols];

  return GridObject;
}

export function updateEndpoint(oGrid: IGrid, type: EndpointType, location: NodeLocation): IGrid {
  if (type !== 'start' && type !== 'end') {
    throw new Error("Invalid endpoint type. Must be 'start' or 'end'");
  }

  const grid = oGrid;
  const index = type === 'start' ? 0 : 1;
  const currentEndpoint = grid.endpoints[index];

  if (currentEndpoint?.row !== undefined && currentEndpoint.col !== undefined) {
    const { row, col } = currentEndpoint;
    grid.nodes[row][col].type = NodeType.default;
  }

  grid.endpoints[index] = location;
  if (type === 'start') {
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
 * Set the node at a given location in the grid
 * @param location the location of the node in the grid
 * @param type Node type
 * @param weight Node weight
 * @returns NodeResistryEntry
 */
export function setNode(
  grid: IGrid,
  location: NodeLocation,
  type: NodeType,
  weight = 1,
): NodeResistryEntry {
  // convert the location to an absolute location
  const [row, col] = getAbsoluteLocation(grid, location);

  // get the node at the location
  const node = grid.nodes[row][col];

  // retain oldType for updating the endpoint
  const { type: oldType } = node;

  // update the node
  node.type = type;
  node.weight = weight;

  // update the endpoint if the node is a start or end node
  if (oldType === NodeType.start || oldType === NodeType.end) {
    // we can cast it as a EndpointType because we know it's either start or end
    updateEndpoint(grid, node.type as EndpointType, location);
  }

  const registeredEntry = nodeIsRegistered(grid, location);

  // check if the node is already registered
  if (registeredEntry) {
    // if I wrote the other functions correctly, this should never be true
    if (
      registeredEntry.location.row === row && registeredEntry.location.col === col
      && registeredEntry.node !== node
    ) {
      const msg = `Node location mismatch. Node location is not the same as the occupied node's location. \nNode location: ${JSON.stringify(location)} \nOccupied node location: ${JSON.stringify(registeredEntry.location)}`;
      throw new Error(msg);
    }
  } else {
    grid.nodeRegistry.push({
      location,
      node,
    });
  }

  return { location, node };
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
