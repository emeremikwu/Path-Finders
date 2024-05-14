/*
 TODO:
  [x] - finish smart resize function (existing nodes)
  [ ] - add jest|vitest tests for the Grid class
 */

import { INodeAttributes, NodeType, initializeNode } from './NodeAttributes';

export interface DimensionObject { rows: number, cols: number }
export type DimensionArray = [number, number];
export type DimensionString = string;
export type Dimension = DimensionObject | DimensionArray | DimensionString;
export type GridState = INodeAttributes[][];

export type AddRowPosition = 'top' | 'bottom';
export type AddColPosition = 'left' | 'right';

export interface NodeLocation {
  row?: number;
  col?: number;
  startFromOne: boolean;
  reverseRowIndex?: boolean;
}

export const DefaultNodeLocation: NodeLocation = {
  row: undefined,
  col: undefined,
  startFromOne: false,
  reverseRowIndex: false,
};

export type Endpoints = [NodeLocation | undefined, NodeLocation | undefined];
export type EndpointType = 'start' | 'end';

interface NodeResistryEntry {
  location: NodeLocation;
  node: INodeAttributes;
}

interface NodeBalanceArea {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

class Grid {
  #nodes: GridState;

  #shape: DimensionArray;

  #endpoints: Endpoints;

  #nodeRegistry: NodeResistryEntry[] = [];

  #startNodeSet: boolean;

  #endNodeSet: boolean;

  throwOnOutOfBounds = true;

  constructor(rows: number, cols: number) {
    this.#nodes = Grid.createGrid(rows, cols);
    this.#startNodeSet = false;
    this.#endNodeSet = false;
    this.#endpoints = [undefined, undefined];
    this.#shape = [rows, cols];
  }

  /**
   * Creates a grid of rows x cols
   * @param rows
   * @param cols
   * @returns a 2D array of strings representing the grid (GridState)
   */
  static createGrid(rows: number, cols: number): GridState {
    // this took me forever to properly annotate.
    const attributeArray: GridState = Array.from<object, INodeAttributes[]>(
      { length: rows },
      () => (
        Array.from<object, INodeAttributes>(
          { length: cols },
          () => initializeNode(),
        )
      ),
    );
    return attributeArray;
  }

  /**
   * Get the absolute location of a node in the grid
   * @param location location object containing the row and column
   * @returns [number, number]
   */
  // [ ] - reorganize the parameters to be more consistent
  private getAbsoluteLocation(location: NodeLocation): [number, number] {
    let { row, col } = { ...DefaultNodeLocation, ...location };
    const { startFromOne, reverseRowIndex } = location;

    if (row === undefined || col === undefined) {
      throw new Error('Location inproperly initialized, requires node object or (row and col) ');
    }

    if (startFromOne) {
      row -= 1;
      col -= 1;
    }

    if (reverseRowIndex) {
      row = this.#shape[0] - row;
    }

    this.checkBounds(row, col, startFromOne);

    return [row, col];
  }

  private updateEndpoint(type: EndpointType, location: NodeLocation) {
    if (type !== 'start' && type !== 'end') {
      throw new Error("Invalid endpoint type. Must be 'start' or 'end'");
    }

    const index = type === 'start' ? 0 : 1;

    const currentEndpoint = this.#endpoints[index];

    if (currentEndpoint?.row !== undefined && currentEndpoint.col !== undefined) {
      const { row, col } = currentEndpoint;
      this.#nodes[row][col].type = NodeType.default;
    }

    this.#endpoints[index] = location;
    if (type === 'start') {
      this.#startNodeSet = true;
    } else {
      this.#endNodeSet = true;
    }
  }

  private updateShape() {
    this.#shape = [this.#nodes.length, this.#nodes[0].length];
  }

  /**
   * Get the distance of a node to each edge of the grid
   * @param location the location of the node in the grid
   * @returns NodeBalanceArea
   */
  private distanceToEdge(location: NodeLocation): NodeBalanceArea {
    const [row, col] = this.getAbsoluteLocation(location);

    return {
      top: row,
      right: this.#shape[1] - 1 - col,
      bottom: this.#shape[0] - 1 - row,
      left: col,
    };
  }

  /**
   * Calculates the area of the grid that nodes are occupying.
   * This is useful for balancing the grid when adding or removing rows and columns
   */
  private calcNodeOccupationArea(): NodeBalanceArea {
    const activeArea = {
      top: Infinity,
      right: Infinity,
      bottom: Infinity,
      left: Infinity,
    };

    this.#nodeRegistry.forEach((nodeEntry) => {
      const { location } = nodeEntry;
      const {
        top, right, bottom, left,
      } = this.distanceToEdge(location);

      activeArea.top = Math.min(activeArea.top, top);
      activeArea.right = Math.min(activeArea.right, right);
      activeArea.bottom = Math.min(activeArea.bottom, bottom);
      activeArea.left = Math.min(activeArea.left, left);
    });

    return activeArea;
  }

  /**
   * Check if the row and column are within the bounds of the grid
   * @param row the row index
   * @param col the column index
   * @param target the grid to check the bounds against
   * @param startFromOne whether the row and column are 1-indexed
   * @param throwError whether to throw an error if the index is out of bounds
   * @returns boolean
   */
  // [ ] - might switch parameters to location object for consistency
  checkBounds(
    row: number,
    col: number,
    startFromOne = false,
    throwError = true,
  ): boolean {
    const isWithinBounds = startFromOne
      ? (row >= 0 && col >= 0 && row < this.#shape[0] && col < this.#shape[1])
      : (row >= 0 && col >= 0 && row <= this.#shape[0] - 1 && col <= this.#shape[1] - 1);

    if (!isWithinBounds && throwError) {
      const msg = `Index out of bounds ${row}:${col} \nShape: ${JSON.stringify(this.#shape)} \nStarting Index: ${startFromOne ? 1 : 0}`;
      throw new Error(msg);
    }

    return isWithinBounds;
  }

  /**
   * Get the node at a given the relative / absolute location in the grid
   * @param location location of the node in the grid
   * @returns NodeAttributes | undefined
   */
  getNode(location: NodeLocation): INodeAttributes | undefined {
    const [row, col] = this.getAbsoluteLocation(location);
    return this.#nodes[row][col];
  }

  /**
   * Set the node at a given location in the grid
   * @param location the location of the node in the grid
   * @param type Node type
   * @param weight Node weight
   * @returns NodeResistryEntry
   */
  setNode(location: NodeLocation, type: NodeType, weight = 1): NodeResistryEntry {
    // convert the location to an absolute location
    const [row, col] = this.getAbsoluteLocation(location);

    // get the node at the location
    const node = this.#nodes[row][col];

    // retain oldType for updating the endpoint
    const { type: oldType } = node;

    // update the node
    node.type = type;
    node.weight = weight;

    // update the endpoint if the node is a start or end node
    if (oldType === NodeType.start || oldType === NodeType.end) {
      // we can cast it as a EndpointType because we know it's either start or end
      this.updateEndpoint(node.type as EndpointType, location);
    }

    const registeredEntry = this.nodeIsRegistered(location);

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
      this.#nodeRegistry.push({
        location,
        node,
      });
    }

    return { location, node };
  }

  /**
   * Check if a node is already registered in the grid
   * @param location the location of the node in the grid
   * @returns NodeResistryEntry | undefined
   */
  private nodeIsRegistered(location: NodeLocation): NodeResistryEntry | undefined {
    return this.#nodeRegistry.find((nodeEntry) => nodeEntry.location === location);
  }

  /**
   * Modify the number of rows in the grid
   * @param position the position to modify the rows
   * @param count the number of rows to add or remove
   * @returns void
   */
  modifyRow(position: AddRowPosition, count: number): void {
    if (count === 0) return;

    // Validate position
    if (position !== 'top' && position !== 'bottom') {
      throw new Error(`Invalid Row position. Given: "${position as AddRowPosition}". Allowed: "top" | "bottom"`);
    }

    // Prepare new rows if count is positive
    const newRows: GridState | undefined = count > 0
      ? Grid.createGrid(count, this.#shape[1])
      : undefined;

    // Update grid based on position and count
    // eslint-disable-next-line default-case
    switch (position) {
      case 'top':
        if (count > 0) {
          this.#nodes.unshift(...newRows!);
        } else {
          for (let i = 0; i < Math.abs(count); i += 1) {
            this.#nodes.shift();
          }
        }
        break;

      case 'bottom':
        if (count > 0) {
          this.#nodes.push(...newRows!);
        } else {
          for (let i = 0; i < Math.abs(count); i += 1) {
            this.#nodes.pop();
          }
        }
        break;
    }

    // Update grid shape
    this.updateShape();
  }

  /**
   * Modify the number of columns in the grid
   * @param position the position to modify the columns
   * @param count the number of columns to add or remove
   * @returns void
   */
  modifyCol(position: AddColPosition, count: number): void {
    if (count === 0) return;

    // Validate position
    if (position !== 'left' && position !== 'right') {
      throw new Error(`Invalid Col position. Given: "${position as AddRowPosition}". Allowed: "left" | "right"`);
    }

    // Prepare new cols if count is positive
    const newCols: GridState | undefined = count > 0
      ? Grid.createGrid(this.#shape[0], count)
      : undefined;

    // Update grid based on position and count
    // eslint-disable-next-line default-case
    switch (position) {
      case 'left':
        if (count > 0) {
          // Map over each row and create a new array by combining newCols and existing row
          this.#nodes = this.#nodes.map((row, index) => [...newCols![index], ...row]);
        } else {
          // Iterate over each row and remove elements from the beginning
          this.#nodes.forEach((row) => {
            for (let i = 0; i < Math.abs(count); i += 1) {
              row.shift();
            }
          });
        }
        break;

      case 'right':
        if (count > 0) {
          // Map over each row and create a new array by combining existing row and newCols
          this.#nodes = this.#nodes.map((row, index) => [...row, ...newCols![index]]);
        } else {
          // Iterate over each row and remove elements from the end
          this.#nodes.forEach((row) => {
            for (let i = 0; i < Math.abs(count); i += 1) {
              row.pop();
            }
          });
        }
        break;
    }

    this.updateShape();
  }

  /*
resizeGridSmart(targetRows: number, targetCols: number, protected: boolean): DimensionArray | null {
    if (true) {
      console.log('Resize gird smart not yet implemented');
      return null;
    }
    const cuurrentRows = this.#nodes.length;
    const currentCols = this.#nodes[0].length;

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

    return this.#shape;
  } */

  /**
   * Resize the grid to the target number of rows and columns
   * @param targetRows
   * @param targetCols
   */
  resizeGrid(targetRows: number, targetCols: number): DimensionArray {
    const newGrid = Grid.createGrid(targetRows, targetCols);

    this.#nodes = newGrid;
    this.updateShape();

    return this.#shape;
  }

  /**
   * Find the start and end nodes in the grid.
   * If the start and end nodes are already set, return them
   * Probably won't be used very often
   * @returns [NodeAttributes, NodeAttributes]
   */
  findEndpoints(): Endpoints {
    // if the endpoints are already set, return them
    if (this.#endNodeSet || this.#startNodeSet) {
      return this.#endpoints;
    }

    // local function to check if the node is a start or end node
    const checkIfEndpoint = (node: INodeAttributes, location: NodeLocation) => {
      if (node.type === NodeType.start || node.type === NodeType.end) {
        // we can cast it as a EndpointType because we know it's either start or end
        this.updateEndpoint(node.type as EndpointType, location);
      }
    };

    // check the occupied nodes first
    // eslint-disable-next-line no-restricted-syntax
    for (const nodeEntry of this.#nodeRegistry) {
      checkIfEndpoint(nodeEntry.node, nodeEntry.location);

      if (this.#startNodeSet && this.#endNodeSet) {
        return this.#endpoints;
      }
    }

    // check the rest of the nodes
    for (let r = 0; r < this.#shape[0]; r += 1) {
      for (let c = 0; c < this.#shape[1]; c += 1) {
        const node = this.#nodes[r][c];
        if (this.nodeIsRegistered({ ...DefaultNodeLocation, row: r, col: c })?.node === node) {
          // eslint-disable-next-line no-continue
          continue;
        }

        checkIfEndpoint(node, { ...DefaultNodeLocation, row: r, col: c });

        if (this.#startNodeSet && this.#endNodeSet) {
          break;
        }
      }

      if (this.#startNodeSet && this.#endNodeSet) {
        break;
      }
    }

    return this.#endpoints;
  }

  /**
   * Get the nodes in the grid
   */
  get nodes() {
    return this.#nodes;
  }

  /**
   * Set the nodes in the grid
   * Shouldn't be used very often if at all
   *  call resizeGrid, modifyRow, or modifyCol instead or create a new Grid
   */
  set nodes(newNodes: GridState) {
    this.#nodes = newNodes;
    this.updateShape();
  }

  /**
   * Get the shape of the grid
   */
  get shape() {
    return this.#shape;
  }

  /**
   * Check if the start node is set
   */
  get startNodeSet() {
    return this.#startNodeSet;
  }

  /**
   * Check if the end node is set
   */
  get endNodeSet() {
    return this.#endNodeSet;
  }

  get nodeRegistry() {
    return this.#nodeRegistry;
  }
}

export default Grid;
