import { INodeAttributes } from './NodeAttributes';

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

export type Endpoints = [NodeLocation | undefined, NodeLocation | undefined];
export type EndpointType = 'start' | 'end';

export interface NodeResistryEntry {
  location: NodeLocation;
  node: INodeAttributes;
}

export interface NodeBalanceArea {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface IGrid {
  nodes: GridState;
  shape: DimensionArray;
  endpoints: Endpoints;
  startNodeSet: boolean;
  endNodeSet: boolean;
  nodeRegistry: NodeResistryEntry[];
}

/* export interface IGridContext {
  grid: IGrid,
  setGrid: Dispatch<SetStateAction<IGrid>>
  updateDimensions: (rows: number, cols: number) => void
  setNode: (row: number, col: number, attributes: Partial<INodeAttributes>) => void
  getNode: (row: number, col: number, startFromOne: boolean) => NodeType
}
 */
