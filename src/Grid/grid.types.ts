import { INodeAttributes, NodeType } from './NodeAttributes';

export interface DimensionObject { rows: number, cols: number }
export type DimensionArray = [number, number];
export type DimensionString = string;
export type Dimension = DimensionObject | DimensionArray | DimensionString;
export type GridState = INodeAttributes[][];

export type AddRowPosition = 'top' | 'bottom';
export type AddColPosition = 'left' | 'right';

export interface NodeLocation {
  row: number;
  col: number;
  startFromOne: boolean;
  reverseRowIndex?: boolean;
}

export type Endpoints = [NodeLocation | undefined, NodeLocation | undefined];
export type EndpointType = NodeType.start | NodeType.end;

export interface NodeRegistryEntry {
  location: NodeLocation;
  node: INodeAttributes;
}

export interface NodeBalanceArea {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/* type D = number;
type Update = boolean;
 */
export interface IGrid {
  nodes: GridState;
  shape: DimensionArray;
  endpoints: Endpoints;
  startNodeSet: boolean;
  endNodeSet: boolean;
  nodeRegistry: NodeRegistryEntry[];
  // D, D2 and the previous length of nodeRegistry
  /* heuristics: [D, Update];
  D: number;
  D2: number; */
}

/* export interface IGridContext {
  grid: IGrid,
  setGrid: Dispatch<SetStateAction<IGrid>>
  updateDimensions: (rows: number, cols: number) => void
  setNode: (row: number, col: number, attributes: Partial<INodeAttributes>) => void
  getNode: (row: number, col: number, startFromOne: boolean) => NodeType
}
 */
