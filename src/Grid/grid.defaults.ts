import { IGrid, NodeLocation } from './grid.types';

export const DefaultNodeLocation: NodeLocation = {
  row: undefined,
  col: undefined,
  startFromOne: false,
  reverseRowIndex: false,
};

export const DefaultGridObject: IGrid = {
  nodes: [],
  shape: [0, 0],
  endpoints: [undefined, undefined],
  startNodeSet: false,
  endNodeSet: false,
  nodeRegistry: [],
};
