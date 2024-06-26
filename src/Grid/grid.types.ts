import { NodeAttributes, NodeType } from './nodeAttributes';

export interface DimensionObject { rows: number, cols: number }
export type DimensionArray = [number, number];
export type DimensionString = string;
export type Dimension = DimensionObject | DimensionArray | DimensionString;
export type GridState = NodeAttributes[][];

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

type NodeCoordinate = string;
export interface NodeRegistryEntry {
  location: NodeLocation,
  attributes: NodeAttributes
}

export type NodeRegistry = Map<NodeCoordinate, NodeRegistryEntry>;

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
  nodeRegistry: NodeRegistry;
  // D, D2 and the previous length of nodeRegistry
  /* heuristics: [D, Update];
  D: number;
  D2: number; */
}

/* export interface IGridContext {
  grid: IGrid,
  setGrid: Dispatch<SetStateAction<IGrid>>
  updateDimensions: (rows: number, cols: number) => void
  setNode: (row: number, col: number, attributes: Partial<NodeAttributes>) => void
  getNode: (row: number, col: number, startFromOne: boolean) => NodeType
}
 */
